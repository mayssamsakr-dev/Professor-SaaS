import {
  IsInt,
  IsNumber,
  Min
} from 'class-validator';

export class CreateUniversitySubjectDto {

  @IsInt()
  universityId: number;

  @IsInt()
  subjectId: number;

  @IsNumber()
  @Min(0)
  ratePerSession: number;

}