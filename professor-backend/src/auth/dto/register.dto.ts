import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsInt
} from 'class-validator';

export class RegisterDto {

  // بيانات الـ Tenant
  @IsNotEmpty()
  @IsString()
  legalName: string;

  @IsEmail()
  email: string;

  // تم استبدال baseCurrency -> baseCurrencyId
  @IsInt()
  baseCurrencyId: number;

  // بيانات الـ Owner
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

}