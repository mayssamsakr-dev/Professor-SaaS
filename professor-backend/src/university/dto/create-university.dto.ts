import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  IsInt
} from 'class-validator';

export class CreateUniversityDto {

  @IsNotEmpty()
  @IsString()
  name: string;


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
  @IsEmail()
  contactEmail?: string;


  @IsOptional()
  @IsString()
  contactPhone?: string;


  @IsOptional()
  @IsString()
  registrationNumber?: string;


  @IsOptional()
  @IsString()
  taxNumber?: string;


  /*
  currency
  */

  @IsInt()
  defaultCurrencyId: number;

}