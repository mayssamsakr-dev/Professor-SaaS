import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  Res,
  Query,
  Patch,
  Delete
} from '@nestjs/common';

import type { Response } from 'express';

import { InvoiceService } from './invoice.service';
import { InvoicePdfService } from './invoice-pdf.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionGuard } from '../subscription/subscription.guard';

import { AdjustmentType } from '@prisma/client';

@Controller('invoices')
@UseGuards(JwtAuthGuard, SubscriptionGuard)
export class InvoiceController {

  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly invoicePdfService: InvoicePdfService
  ) {}

  /*
  إنشاء
  */
  @Post()
  create(
    @Body() dto: CreateInvoiceDto,
    @Req() req: any
  ) {

    const userId =
      req.user.userId;

    return this.invoiceService.create(

      dto,

      req.user.tenantId,

      userId

    );

  }

@Get("preview")
preview(

  @Query() query:any,

  @Req() req:any

){

  return this.invoiceService.preview(

    query,

    req.user.tenantId

  );

}
  @Get()
  findAll(

    @Req() req: any,

    @Query() query: any

  ) {

    return this.invoiceService.findAll(

      req.user.tenantId,

      query

    );

  }

  /*
  فاتورة واحدة
  */
  @Get(':id')
  findOne(

    @Param('id') id: string,

    @Req() req: any

  ) {

    return this.invoiceService.findOne(

      Number(id),

      req.user.tenantId

    );

  }

  /*
  finalize
  */
  @Post(':id/finalize')
  finalize(

    @Param('id') id: string,

    @Req() req: any

  ) {

    const userId =
      req.user.userId;

    return this.invoiceService.finalize(

      Number(id),

      req.user.tenantId,

      userId

    );

  }

  /*
  adjustments
  */
  @Post(':id/adjustments')
  addAdjustment(

    @Param('id') id: string,

    @Body() body: {

      type: AdjustmentType;

      description: string;

      amount: number;

    },

    @Req() req: any

  ) {

    const userId =
      req.user.userId;

    return this.invoiceService.addAdjustment(

      Number(id),

      req.user.tenantId,

      body.type,

      body.description,

      body.amount,

      userId

    );

  }

  /*
  update draft
  */
  @Patch(':id')
  update(

    @Param('id') id: string,

    @Body() dto: any,

    @Req() req: any

  ) {

    return this.invoiceService.update(

      Number(id),

      dto,

      req.user.tenantId

    );

  }

  /*
  delete draft
  */
  @Delete(':id')
  delete(

    @Param('id') id: string,

    @Req() req: any

  ) {

    return this.invoiceService.delete(

      Number(id),

      req.user.tenantId

    );

  }

  /*
  pdf
  */
  @Get(':id/pdf')
  pdf(

    @Param('id') id: string,

    @Req() req: any,

    @Res() res: Response

  ) {

    return this.invoicePdfService.generate(

      Number(id),

      req.user.tenantId,

      res

    );

  }

  @Get(":id/preview")
previewPDF(

@Param("id") id:string,

@Req() req:any,

@Res() res:Response

){

return this.invoicePdfService.generate(

Number(id),

req.user.tenantId,

res,

true

);

}

}