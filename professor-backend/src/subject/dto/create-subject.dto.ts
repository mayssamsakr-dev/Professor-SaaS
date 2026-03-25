import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSubjectDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}