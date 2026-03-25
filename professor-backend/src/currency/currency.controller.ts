import { Controller, Get } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Public } from "../auth/public.decorator";

@Controller("currencies")
export class CurrencyController {

  constructor(
    private prisma: PrismaService
  ) {}

  @Public()
  @Get()
  findAll(){

    return this.prisma.currency.findMany({

      select:{
        id:true,
        code:true,
        name:true,
        symbol:true
      },

      orderBy:{
        code:"asc"
      }

    });

  }

}