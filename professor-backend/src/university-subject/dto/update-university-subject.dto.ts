import { IsNumber, Min } from 'class-validator';

export class UpdateUniversitySubjectDto {

  @IsNumber()
  @Min(0)
  ratePerSession: number;

}