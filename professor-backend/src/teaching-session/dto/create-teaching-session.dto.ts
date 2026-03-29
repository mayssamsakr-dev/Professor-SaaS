import { IsDateString, IsInt, IsNumber, Min } from 'class-validator';

export class CreateTeachingSessionDto {

  @IsDateString()
  date: string;

  @IsNumber()
  @Min(0.01)
  quantity: number;

  @IsInt()
  universitySubjectId: number;

  @IsInt()
classGroupId: number;

}