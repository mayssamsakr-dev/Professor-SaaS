import { IsNotEmpty, IsString } from 'class-validator';

export class CreateServiceTypeDto {

  @IsNotEmpty()
  @IsString()
  name: string;

}