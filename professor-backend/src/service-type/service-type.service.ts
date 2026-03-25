import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';

@Injectable()
export class ServiceTypeService extends BaseTenantService {

  constructor(prisma: PrismaService) {
    super(prisma);
  }

  async create(dto: CreateServiceTypeDto, tenantId: number) {

    const existing = await this.prisma.serviceType.findFirst({
      where: {
        name: dto.name,
        tenantId
      }
    });

    if (existing) {
      throw new BadRequestException('ServiceType already exists');
    }

    return this.tenantCreate(
      this.prisma.serviceType,
      tenantId,
      {
        name: dto.name
      }
    );

  }

  async findAll(tenantId: number) {

    return this.tenantFindMany(
      this.prisma.serviceType,
      tenantId,
      {
        orderBy: {
          id: 'desc'
        }
      }
    );

  }

}