import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseTenantService } from '../common/base-tenant.service';
import { CreateServiceTypeDto } from './dto/create-service-type.dto';
import {
  Prisma
} from '@prisma/client';

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

  async update(

  id:number,

  dto:CreateServiceTypeDto,

  tenantId:number

){

  return this.prisma.serviceType.update({

    where:{
      id,
      tenantId
    },

    data:dto

  });

}


async remove(

  id:number,

  tenantId:number

){

  /*
  check if used in invoice
  */

  const usedInInvoice =

    await this.prisma.invoice.findFirst({

      where:{

        tenantId,

        serviceActivities:{

          some:{

            serviceTypeId:id

          }

        }

      }

    });


  if(usedInInvoice){

    throw new BadRequestException(

      "Cannot delete service type because it is used in invoice"

    );

  }


  /*
  safe delete
  */

  return this.prisma.serviceType.delete({

    where:{ id }

  });

}

async isUsedInInvoice(

  id:number,

  tenantId:number

){

  const found =

    await this.prisma.invoice.findFirst({

      where:{

        tenantId,

        serviceActivities:{

          some:{

            serviceTypeId:id

          }

        }

      }

    });

  return !!found;

}

}