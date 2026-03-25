import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateServiceActivityDto } from './dto/create-service-activity.dto';

@Injectable()
export class ServiceActivityService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(dto: CreateServiceActivityDto, tenantId: number) {

    const serviceType = await this.prisma.serviceType.findFirst({
      where: {
        id: dto.serviceTypeId,
        tenantId
      }
    });

    if (!serviceType) {
      throw new BadRequestException('ServiceType not found');
    }

    const university = await this.prisma.university.findFirst({
      where: {
        id: dto.universityId,
        tenantId
      }
    });

    if (!university) {
      throw new BadRequestException('University not found');
    }

    const quantity = dto.quantity ?? 1;
    const totalAmount = quantity * dto.unitRate;

    return this.prisma.serviceActivity.create({
      data: {
        date: new Date(dto.date),
        quantity,
        unitRate: dto.unitRate,
        totalAmount,
        serviceTypeId: dto.serviceTypeId,
        universityId: dto.universityId,
        tenantId
      },
      include: {
        serviceType: true,
        university: true
      }
    });

  }

  async findAll(tenantId: number) {

    return this.prisma.serviceActivity.findMany({
      where: {
        tenantId,
        deletedAt: null
      },
      include: {
        serviceType: true,
        university: true,
        invoice: true
      },
      orderBy: {
        date: 'desc'
      }
    });

  }

  async softDelete(id: number, tenantId: number) {

    const activity = await this.prisma.serviceActivity.findFirst({
      where: {
        id,
        tenantId,
        deletedAt: null
      }
    });

    if (!activity) {
      throw new BadRequestException('ServiceActivity not found');
    }

    if (activity.invoiceId) {
      throw new BadRequestException('Cannot delete activity already invoiced');
    }

    return this.prisma.serviceActivity.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

  }

  /*
تعديل activity
*/
async update(
  id: number,
  dto: any,
  tenantId: number
) {

  const activity =
    await this.prisma.serviceActivity.findFirst({

      where: {

        id,
        tenantId,
        deletedAt: null

      }

    });

  if (!activity) {

    throw new BadRequestException(
      "Activity not found"
    );

  }

  if (activity.invoiceId) {

    throw new BadRequestException(
      "Cannot edit activity already invoiced"
    );

  }

  const serviceType =
    await this.prisma.serviceType.findFirst({

      where: {

        id: dto.serviceTypeId,
        tenantId

      }

    });

  if (!serviceType) {

    throw new BadRequestException(
      "ServiceType not found"
    );

  }

  const university =
    await this.prisma.university.findFirst({

      where: {

        id: dto.universityId,
        tenantId

      }

    });

  if (!university) {

    throw new BadRequestException(
      "University not found"
    );

  }

  const quantity =
    dto.quantity ?? 1;

  const totalAmount =
    quantity * dto.unitRate;

  return this.prisma.serviceActivity.update({

    where: {

      id

    },

    data: {

      date: new Date(dto.date),

      quantity,

      unitRate: dto.unitRate,

      totalAmount,

      serviceTypeId: dto.serviceTypeId,

      universityId: dto.universityId

    },

    include: {

      serviceType: true,

      university: true

    }

  });

}

}