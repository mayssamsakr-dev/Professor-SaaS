import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class ReportsService {

  constructor(private prisma: PrismaService) {}

  /*
  Helper: filter by date
  */
  private buildDateFilter(dateFrom?: string, dateTo?: string) {

    const filter: any = {};

    if (dateFrom || dateTo) {

      filter.issueDate = {};

      if (dateFrom) {
        filter.issueDate.gte = new Date(dateFrom);
      }

      if (dateTo) {
        filter.issueDate.lte = new Date(dateTo);
      }

    }

    return filter;

  }

  async revenueSummary(tenantId: number, dateFrom?: string, dateTo?: string) {

    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: 'FINALIZED', // مهم
        ...this.buildDateFilter(dateFrom, dateTo)
      }
    });

    const totalRevenue = invoices.reduce(
      (sum, i) => sum + Number(i.totalAmount),
      0
    );

    const paid = invoices
      .filter(i => i.paymentStatus === PaymentStatus.PAID)
      .reduce((sum, i) => sum + Number(i.totalAmount), 0);

    const unpaid = invoices
      .filter(i => i.paymentStatus !== PaymentStatus.PAID)
      .reduce((sum, i) => sum + Number(i.totalAmount), 0);

    return {
      totalRevenue,
      paidRevenue: paid,
      unpaidRevenue: unpaid,
      invoiceCount: invoices.length
    };

  }

  async revenueByUniversity(tenantId: number, dateFrom?: string, dateTo?: string) {

    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: 'FINALIZED',
        ...this.buildDateFilter(dateFrom, dateTo)
      },
      include: { university: true }
    });

    const map: Record<string, number> = {};

    for (const inv of invoices) {

      const name = inv.university.name;

      if (!map[name]) {
        map[name] = 0;
      }

      map[name] += Number(inv.totalAmount);

    }

    // تحويل إلى Array (مهم)
    return Object.entries(map).map(([universityName, total]) => ({
      universityName,
      total
    }));

  }

  async monthlyRevenue(tenantId: number, dateFrom?: string, dateTo?: string) {

    const invoices = await this.prisma.invoice.findMany({
      where: {
        tenantId,
        status: 'FINALIZED',
        ...this.buildDateFilter(dateFrom, dateTo)
      }
    });

    const map: Record<string, number> = {};

    for (const inv of invoices) {

      const month = new Date(inv.issueDate).toISOString().slice(0, 7);

      if (!map[month]) {
        map[month] = 0;
      }

      map[month] += Number(inv.totalAmount);

    }

    return Object.entries(map).map(([month, total]) => ({
      month,
      total
    }));

  }

}