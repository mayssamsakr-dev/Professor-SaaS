import { Module } from "@nestjs/common";
import { CurrencyController } from "./currency.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({

  controllers: [
    CurrencyController
  ],

  providers: [
    PrismaService
  ]

})
export class CurrencyModule {}