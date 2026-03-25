import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateUniversityDto } from './dto/create-university.dto';

@Injectable()
export class UniversityService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async remove(id: number, tenantId: number) {

    const usedInInvoice =
      await this.prisma.invoice.findFirst({

        where: {

          universityId: id,

          tenantId

        }

      });

    if (usedInInvoice) {

      throw new BadRequestException(

        "Cannot delete university because it is used in invoices"

      );

    }

    return this.prisma.university.delete({

      where: { id }

    });

  }

  async create(
    data: CreateUniversityDto,
    tenantId: number
  ) {

    /*
    منع تكرار الاسم
    */

    const existing =
      await this.prisma.university.findFirst({

        where: {

          name: data.name,

          tenantId,

        },

      });

    if (existing) {

      throw new BadRequestException(

        'University name already exists for this tenant'

      );

    }

    return this.tenantCreate(

      this.prisma.university,

      tenantId,

      {

        name:
          data.name,

        defaultCurrencyId:
          data.defaultCurrencyId,

        addressLine:
          data.addressLine,

        city:
          data.city,

        country:
          data.country,

        contactEmail:
          data.contactEmail,

        contactPhone:
          data.contactPhone,

        registrationNumber:
          data.registrationNumber,

        taxNumber:
          data.taxNumber

      }

    );

  }

  async findAll(
    tenantId: number
  ) {

    return this.tenantFindMany(

      this.prisma.university,

      tenantId,

      {

        include:{

          defaultCurrency:true

        },

        orderBy:{

          createdAt:'desc'

        },

      }

    );

  }

  async update(

    id:number,

    dto:any,

    tenantId:number

  ){

    const university =
      await this.prisma.university.findFirst({

        where:{

          id,

          tenantId

        }

      });

    if(!university){

      throw new BadRequestException(

        "University not found"

      );

    }

    return this.prisma.university.update({

      where:{ id },

      data:{

        name:
          dto.name,

        defaultCurrencyId:
          dto.defaultCurrencyId,

        addressLine:
          dto.addressLine,

        city:
          dto.city,

        country:
          dto.country,

        registrationNumber:
          dto.registrationNumber,

        taxNumber:
          dto.taxNumber,

        contactEmail:
          dto.contactEmail,

        contactPhone:
          dto.contactPhone

      }

    });

  }

}