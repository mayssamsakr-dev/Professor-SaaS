import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {

  constructor(private prisma: PrismaService) {}

async create(data: any, tenantId: number) {

  const invoice = await this.prisma.invoice.findFirst({
    where: {
      id: data.invoiceId,
      tenantId
    },
    include: {
      payments: true
    }
  });

  if (!invoice) {
    throw new BadRequestException('Invoice not found');
  }

  /*
  ❌ منع الدفع إذا الفاتورة مدفوعة بالكامل
  */
  if (invoice.paymentStatus === PaymentStatus.PAID) {
    throw new BadRequestException('Invoice already fully paid');
  }

  /*
  ❌ منع القيم غير الصالحة
  */
  const amount = Number(data.amount);

  if (!amount || amount <= 0) {
    throw new BadRequestException('Invalid payment amount');
  }

  const paidAmount = invoice.payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  );

  const newTotal = paidAmount + amount;

  if (newTotal > Number(invoice.totalAmount)) {
    throw new BadRequestException('Payment exceeds invoice total');
  }

  const payment = await this.prisma.payment.create({
    data: {
      invoiceId: data.invoiceId,
      tenantId,
      amount,
      amountBase: data.amountBase,
      paymentDate: new Date(data.paymentDate),
      method: data.method,
      referenceNumber: data.referenceNumber
    }
  });

  let paymentStatus: PaymentStatus = PaymentStatus.UNPAID;

  if (newTotal === Number(invoice.totalAmount)) {
    paymentStatus = PaymentStatus.PAID;
  } else if (newTotal > 0) {
    paymentStatus = PaymentStatus.PARTIALLY_PAID;
  }

  await this.prisma.invoice.update({
    where: { id: invoice.id },
    data: {
      paymentStatus
    }
  });

  return payment;

}

  async findAll(tenantId: number, invoiceId?: number) {

  return this.prisma.payment.findMany({
    where: {
      tenantId,
      ...(invoiceId && { invoiceId })
    },
    orderBy: {
      paymentDate: 'desc'
    }
  });

  }

}