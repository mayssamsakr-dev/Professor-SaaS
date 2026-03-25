import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class UpdateTeachingSessionDto {

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsInt()
  universitySubjectId: number;

}