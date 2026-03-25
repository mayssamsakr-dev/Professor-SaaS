import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSubjectDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

}