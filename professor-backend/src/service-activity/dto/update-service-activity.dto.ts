import { IsDateString, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class UpdateServiceActivityDto {

  @IsDateString()
  date: string;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  quantity?: number;

  @IsNumber()
  @Min(0.01)
  unitRate: number;

  @IsInt()
  serviceTypeId: number;

  @IsInt()
  universityId: number;

}