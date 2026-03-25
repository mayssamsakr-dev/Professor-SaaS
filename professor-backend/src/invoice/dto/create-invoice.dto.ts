import {
  IsInt,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
  Min
} from 'class-validator';

import { DiscountType } from '@prisma/client';

export class CreateInvoiceDto {

  @IsInt()
  universityId: number;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  // تم استبدال currency -> currencyId
  @IsInt()
  currencyId: number;

  @IsNumber()
  @Min(0)
  exchangeRateToBase: number;

  @IsOptional()
  @IsEnum(DiscountType)
  discountType?: DiscountType;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

}