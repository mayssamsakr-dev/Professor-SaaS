import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber
} from 'class-validator';

export class CreateTenantDto {

  /*
  required
  */

  @IsString()
  @IsNotEmpty()
  legalName: string;

  @IsEmail()
  email: string;

  @IsInt()
  baseCurrencyId: number;

  /*
  company info (optional)
  */

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  taxNumber?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  iban?: string;

  @IsOptional()
  @IsString()
  swiftCode?: string;

  /*
  VAT
  */

  @IsOptional()
  @IsBoolean()
  vatEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  vatRate?: number;

  @IsOptional()
  @IsString()
  vatExemptionNote?: string;

}