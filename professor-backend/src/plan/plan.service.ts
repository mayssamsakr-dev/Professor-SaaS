import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PlanService {

  constructor(private prisma: PrismaService) {}

  async create(data: any) {

    return this.prisma.plan.create({

      data: {

        name:
          data.name,

        priceMonthly:
          data.priceMonthly,

        currencyId:
          data.currencyId

      },

      include:{

        currency:true

      }

    });

  }

  async findAll() {

    return this.prisma.plan.findMany({

      include:{

        currency:true

      },

      orderBy:{

        id:'asc'

      }

    });

  }

}