import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {

  // يجب أن يكون Email صالح
  @IsEmail()
  email: string;

  // كلمة المرور نص وإلزامية
  @IsString()
  @MinLength(6)
  password: string;

}