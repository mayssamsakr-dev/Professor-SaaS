import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceStatus, AdjustmentType } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class InvoiceService {

  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateInvoiceDto,
    tenantId: number,
    userId: number
  ) {

    const university =
      await this.prisma.university.findFirst({

        where: {

          id: dto.universityId,

          tenantId

        }

      });

    if (!university) {

      throw new BadRequestException(
        'University not found'
      );

    }

    const sessions =
      await this.prisma.teachingSession.findMany({

        where: {

          tenantId,

          invoiceId: null,

          deletedAt: null,

          date: {

            gte: new Date(dto.periodStart),

            lte: new Date(dto.periodEnd)

          },

          universitySubject: {

            universityId: dto.universityId

          }

        }

      });

    const activities =
      await this.prisma.serviceActivity.findMany({

        where: {

          tenantId,

          invoiceId: null,

          deletedAt: null,

          universityId: dto.universityId,

          date: {

            gte: new Date(dto.periodStart),

            lte: new Date(dto.periodEnd)

          }

        }

      });

    if (
      sessions.length === 0 &&
      activities.length === 0
    ) {

      throw new BadRequestException(
        'No billable items found for the selected period'
      );

    }

    const sessionTotal =
      sessions.reduce(

        (sum, s) =>
          sum + Number(s.totalAmount),

        0

      );

    const activityTotal =
      activities.reduce(

        (sum, a) =>
          sum + Number(a.totalAmount),

        0

      );

    const subtotal =
      sessionTotal + activityTotal;

    let discountAmount = 0;

    if (dto.discountType === 'PERCENT') {

      discountAmount =
        subtotal *
        (dto.discountValue ?? 0) / 100;

    }

    if (dto.discountType === 'FIXED') {

      discountAmount =
        dto.discountValue ?? 0;

    }

    const tenant =
      await this.prisma.tenant.findUnique({

        where: {

          id: tenantId

        }

      });

    let vatAmount = 0;

    if (
      tenant?.vatEnabled &&
      tenant.vatRate
    ) {

      vatAmount =
        (subtotal - discountAmount) *
        Number(tenant.vatRate) / 100;

    }

    const totalAmount =
      subtotal -
      discountAmount +
      vatAmount;

    const totalAmountBase =
      totalAmount *
      dto.exchangeRateToBase;

    const year =
      new Date().getFullYear();

    const lastInvoice =
      await this.prisma.invoice.findFirst({

        where: {

          tenantId,

          invoiceYear: year

        },

        orderBy: {

          invoiceSequence: 'desc'

        }

      });

    const sequence =
      (lastInvoice?.invoiceSequence ?? 0) + 1;

    const invoice =
      await this.prisma.invoice.create({

        data: {

          invoiceNumber:
            `${year}-${sequence}`,

          invoiceYear: year,

          invoiceSequence: sequence,

          issueDate: new Date(),

          periodStart:
            new Date(dto.periodStart),

          periodEnd:
            new Date(dto.periodEnd),

          currencyId:
            university.defaultCurrencyId,

          exchangeRateToBase:
            dto.exchangeRateToBase,

          subtotal,

          discountType:
            dto.discountType,

          discountValue:
            dto.discountValue,

          discountAmount,

          vatRateSnapshot:
            tenant?.vatRate,

          vatAmount,

          totalAmount,

          totalAmountBase,

          universityId:
            dto.universityId,

          tenantId

        }

      });

    await this.prisma.teachingSession.updateMany({

      where: {

        id: {

          in:
            sessions.map(
              s => s.id
            )

        }

      },

      data: {

        invoiceId:
          invoice.id

      }

    });

    await this.prisma.serviceActivity.updateMany({

      where: {

        id: {

          in:
            activities.map(
              a => a.id
            )

        }

      },

      data: {

        invoiceId:
          invoice.id

      }

    });

    await this.prisma.auditLog.create({

      data: {

        entityType: 'Invoice',

        entityId:
          invoice.id,

        action: 'CREATE',

        tenant: {

          connect: {

            id: tenantId

          }

        },

        user: {

          connect: {

            id: userId

          }

        }

      }

    });

    return invoice;

  }

  async findAll(
    tenantId: number,
    query?: any
  ) {

    const where: any = {

      tenantId,

      deletedAt: null

    };

    if (query?.universityId) {

      where.universityId =
        Number(query.universityId);

    }

    if (query?.status) {

      where.status =
        query.status;

    }

    return this.prisma.invoice.findMany({

      where,

      select: {

        id: true,

        invoiceNumber: true,

        issueDate: true,

        periodStart: true,

        periodEnd: true,

        currency: true,

        totalAmount: true,

        status: true,

        paymentStatus: true,

        university: {

          select: {

            id: true,

            name: true

          }

        }

      },

      orderBy: {

        issueDate: 'desc'

      }

    });

  }

  async findOne(
    id: number,
    tenantId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id,

          tenantId

        },

        include: {

  currency:true,   // <-- أضف هذا السطر

  university:true,

  teachingSessions:{

    include:{

      universitySubject:{

        include:{

          subject:true,

          university:true

        }

      }

    }

  },

  serviceActivities:{

    include:{

      serviceType:true,

      university:true

    }

  },

  payments:true,

  adjustments:true

}

      });

    if (!invoice) {

      throw new BadRequestException(
        'Invoice not found'
      );

    }

    return invoice;

  }

  async finalize(
    id: number,
    tenantId: number,
    userId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id,

          tenantId

        }

      });

    if (!invoice) {

      throw new BadRequestException(
        'Invoice not found'
      );

    }

    if (
      invoice.status !==
      InvoiceStatus.DRAFT
    ) {

      throw new BadRequestException(
        'Only draft invoices can be finalized'
      );

    }

    const updated =
      await this.prisma.invoice.update({

        where: {

          id

        },

        data: {

          status:
            InvoiceStatus.FINALIZED

        }

      });

    await this.prisma.auditLog.create({

      data: {

        entityType: 'Invoice',

        entityId: id,

        action: 'FINALIZE',

        tenant: {

          connect: {

            id: tenantId

          }

        },

        user: {

          connect: {

            id: userId

          }

        }

      }

    });

    return updated;

  }

  async addAdjustment(
    invoiceId: number,
    tenantId: number,
    type: AdjustmentType,
    description: string,
    amount: number,
    userId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id: invoiceId,

          tenantId

        }

      });

    if (!invoice) {

      throw new BadRequestException(
        'Invoice not found'
      );

    }

    if (
      invoice.status !==
      InvoiceStatus.FINALIZED
    ) {

      throw new BadRequestException(
        'Adjustments allowed only on finalized invoices'
      );

    }

    const adjustment =
      await this.prisma.invoiceAdjustment.create({

        data: {

          type,

          description,

          amount,

          invoiceId,

          tenantId

        }

      });

    let newTotal =
      Number(invoice.totalAmount);

    if (
      type ===
      AdjustmentType.DISCOUNT
    ) {

      newTotal -= amount;

    }

    if (
      type ===
      AdjustmentType.EXTRA
    ) {

      newTotal += amount;

    }

    await this.prisma.invoice.update({

      where: {

        id: invoiceId

      },

      data: {

        totalAmount:
          newTotal

      }

    });

    await this.prisma.auditLog.create({

      data: {

        entityType: 'Invoice',

        entityId:
          invoiceId,

        action: 'ADJUSTMENT',

        tenant: {

          connect: {

            id: tenantId

          }

        },

        user: {

          connect: {

            id: userId

          }

        }

      }

    });

    await this.recalculatePaymentStatus(
      invoiceId,
      tenantId
    );

    return adjustment;

  }

  async recalculate(
    id: number,
    tenantId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id,

          tenantId

        }

      });

    if (!invoice) {

      throw new BadRequestException(
        'Invoice not found'
      );

    }

    if (
      invoice.status !==
      InvoiceStatus.DRAFT
    ) {

      throw new BadRequestException(
        'Cannot modify finalized invoice'
      );

    }

    const sessions =
      await this.prisma.teachingSession.findMany({

        where: {

          tenantId,

          invoiceId: id,

          deletedAt: null

        }

      });

    const activities =
      await this.prisma.serviceActivity.findMany({

        where: {

          tenantId,

          invoiceId: id,

          deletedAt: null

        }

      });

    const sessionTotal =
      sessions.reduce(

        (sum, s) =>
          sum + Number(s.totalAmount),

        0

      );

    const activityTotal =
      activities.reduce(

        (sum, a) =>
          sum + Number(a.totalAmount),

        0

      );

    const subtotal =
      sessionTotal + activityTotal;

    let discountAmount = 0;

    if (
      invoice.discountType ===
      'PERCENT'
    ) {

      discountAmount =
        subtotal *
        Number(
          invoice.discountValue ?? 0
        ) / 100;

    }

    if (
      invoice.discountType ===
      'FIXED'
    ) {

      discountAmount =
        Number(
          invoice.discountValue ?? 0
        );

    }

    const vatAmount =
      invoice.vatRateSnapshot
        ? (subtotal - discountAmount)
          * Number(
              invoice.vatRateSnapshot
            ) / 100
        : 0;

    const totalAmount =
      subtotal -
      discountAmount +
      vatAmount;

    const totalAmountBase =
      totalAmount *
      Number(
        invoice.exchangeRateToBase
      );

    return this.prisma.invoice.update({

      where: {

        id

      },

      data: {

        subtotal,

        discountAmount,

        vatAmount,

        totalAmount,

        totalAmountBase

      }

    });

  }

  async update(
    id: number,
    dto: any,
    tenantId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id,

          tenantId

        }

      });

    if (!invoice)

      throw new BadRequestException(
        "Invoice not found"
      );

    if (invoice.status !== "DRAFT")

      throw new BadRequestException(
        "Cannot edit finalized invoice"
      );

    await this.prisma.teachingSession.updateMany({

      where: {

        invoiceId: id

      },

      data: {

        invoiceId: null

      }

    });

    await this.prisma.serviceActivity.updateMany({

      where: {

        invoiceId: id

      },

      data: {

        invoiceId: null

      }

    });

    const sessions =
      await this.prisma.teachingSession.findMany({

        where: {

          tenantId,

          invoiceId: null,

          deletedAt: null,

          date: {

            gte: new Date(dto.periodStart),

            lte: new Date(dto.periodEnd)

          },

          universitySubject: {

            universityId:
              invoice.universityId

          }

        }

      });

    const activities =
      await this.prisma.serviceActivity.findMany({

        where: {

          tenantId,

          invoiceId: null,

          deletedAt: null,

          universityId:
            invoice.universityId,

          date: {

            gte: new Date(dto.periodStart),

            lte: new Date(dto.periodEnd)

          }

        }

      });

    await this.prisma.teachingSession.updateMany({

      where: {

        id: {

          in:
            sessions.map(
              s => s.id
            )

        }

      },

      data: {

        invoiceId: id

      }

    });

    await this.prisma.serviceActivity.updateMany({

      where: {

        id: {

          in:
            activities.map(
              a => a.id
            )

        }

      },

      data: {

        invoiceId: id

      }

    });

    await this.prisma.invoice.update({

      where: {

        id

      },

      data: {

        periodStart:
          new Date(dto.periodStart),

        periodEnd:
          new Date(dto.periodEnd),

        discountType:
          dto.discountType,

        discountValue:
          dto.discountValue

      }

    });

    return this.recalculate(
      id,
      tenantId
    );

  }

  async delete(
    id: number,
    tenantId: number
  ) {

    const invoice =
      await this.prisma.invoice.findFirst({

        where: {

          id,

          tenantId

        }

      });

    if (!invoice)

      throw new BadRequestException(
        'Invoice not found'
      );

    if (
      invoice.status !==
      InvoiceStatus.DRAFT
    )

      throw new BadRequestException(
        'Cannot delete finalized invoice'
      );

    await this.prisma.teachingSession.updateMany({

      where: {

        invoiceId: id

      },

      data: {

        invoiceId: null

      }

    });

    await this.prisma.serviceActivity.updateMany({

      where: {

        invoiceId: id

      },

      data: {

        invoiceId: null

      }

    });

    await this.prisma.payment.deleteMany({

      where: {

        invoiceId: id

      }

    });

    await this.prisma.invoiceAdjustment.deleteMany({

      where: {

        invoiceId: id

      }

    });

    return this.prisma.invoice.delete({

      where: {

        id

      }

    });

  }

  async recalculatePaymentStatus(
  invoiceId:number,
  tenantId:number
){

const invoice =
await this.prisma.invoice.findFirst({

where:{
id:invoiceId,
tenantId
},

include:{
payments:true
}

});

if(!invoice)

throw new BadRequestException(
"Invoice not found"
);

const total =
Number(invoice.totalAmount);

const paid =
invoice.payments.reduce(

(sum:number,p:any)=>
sum + Number(p.amount),

0

);

const diff =
Math.abs(total - paid);

/*
enum وليس string
*/

let status: PaymentStatus = PaymentStatus.UNPAID;

if(paid > 0)
status = PaymentStatus.PARTIALLY_PAID;

if(diff < 0.01)
status = PaymentStatus.PAID;

await this.prisma.invoice.update({

where:{ id:invoiceId },

data:{
paymentStatus: status
}

});

}

async preview(
  query:any,
  tenantId:number
){

  const sessions =
    await this.prisma.teachingSession.findMany({

      where:{

        tenantId,

        invoiceId:null,

        deletedAt:null,

        date:{
          gte:new Date(query.periodStart),
          lte:new Date(query.periodEnd)
        },

        universitySubject:{
          universityId:Number(query.universityId)
        }

      }

    });


  const activities =
    await this.prisma.serviceActivity.findMany({

      where:{

        tenantId,

        invoiceId:null,

        deletedAt:null,

        universityId:Number(query.universityId),

        date:{
          gte:new Date(query.periodStart),
          lte:new Date(query.periodEnd)
        }

      }

    });


  /*
  totals in BASE currency (USD)
  */

  const sessionTotal =
    sessions.reduce(

      (sum:number,s:any)=>
        sum + Number(s.totalAmount || 0),

      0

    );


  const activityTotal =
    activities.reduce(

      (sum:number,a:any)=>
        sum + Number(a.totalAmount || 0),

      0

    );


  const subtotal =
    sessionTotal + activityTotal;


  /*
  VAT
  */

  const tenant =
    await this.prisma.tenant.findUnique({

      where:{ id:tenantId }

    });


  let vatAmount = 0;


  if(
    tenant?.vatEnabled &&
    tenant.vatRate
  ){

    vatAmount =
      subtotal *
      Number(tenant.vatRate) / 100;

  }


  const total =
    subtotal + vatAmount;


  /*
  currency conversion
  */

  const exchangeRate =
    query.exchangeRateToBase
      ? Number(query.exchangeRateToBase)
      : 1;


  const convertedSubtotal =
    subtotal * exchangeRate;


  const convertedVat =
    vatAmount * exchangeRate;


  const convertedTotal =
    total * exchangeRate;


  return {

    sessionsCount:
      sessions.length,

    activitiesCount:
      activities.length,

    /*
    base currency totals (USD)
    */

    subtotal,

    vatAmount,

    total,

    /*
    invoice currency totals
    */

    convertedSubtotal,

    convertedVat,

    convertedTotal,

    exchangeRate

  };

}

}