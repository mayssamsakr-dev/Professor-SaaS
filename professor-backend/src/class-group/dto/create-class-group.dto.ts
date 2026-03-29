import { IsInt, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateClassGroupDto {

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsInt()
  universitySubjectId: number;

}