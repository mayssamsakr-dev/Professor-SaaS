import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  UseGuards
} from '@nestjs/common';

import { PaymentService } from './payment.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionGuard } from '../subscription/subscription.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class PaymentController {

  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Body() body: any, @Req() req: any) {

    return this.paymentService.create(
      body,
      req.user.tenantId
    );

  }

  @Get()
  findAll(@Req() req: any, @Query('invoiceId') invoiceId?: string) {

    return this.paymentService.findAll(
      req.user.tenantId,
      invoiceId ? Number(invoiceId) : undefined
    );

  }

}