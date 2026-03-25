import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionService {

  constructor(private prisma: PrismaService) {}

  async create(data: any) {

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: data.tenantId }
    });

    if (!tenant) {
      throw new BadRequestException('Tenant not found');
    }

    const plan = await this.prisma.plan.findUnique({
      where: { id: data.planId }
    });

    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    const startDate = new Date();
    const endDate = new Date();

    endDate.setMonth(endDate.getMonth() + 1);

    return this.prisma.subscription.create({
      data: {
        tenantId: data.tenantId,
        planId: data.planId,
        startDate,
        endDate,
        isActive: true
      }
    });
  }

  async getActive(tenantId: number) {

  return this.prisma.subscription.findFirst({
    where: {
      tenantId,
      isActive: true
    }
  });

}

async activate(tenantId: number) {

  const existing = await this.prisma.subscription.findFirst({
    where: {
      tenantId,
      isActive: true
    }
  });

  // ✔ إذا يوجد اشتراك → نمدده
  if (existing) {

    const newEndDate = new Date(existing.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    return this.prisma.subscription.update({
      where: { id: existing.id },
      data: {
        endDate: newEndDate
      }
    });

  }

  // ✔ إذا لا يوجد → ننشئ جديد
  return this.prisma.subscription.create({
    data: {
      tenantId,
      planId: 1,
      startDate: new Date(),
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true
    }
  });

}

  async findAll() {
    return this.prisma.subscription.findMany({
      include: {
        tenant: true,
        plan: true
      }
    });
  }

}