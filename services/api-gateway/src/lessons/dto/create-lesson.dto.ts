import { IsString, IsNumber, IsUUID, MinLength } from 'class-validator';

export class CreateLessonDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  content: string;

  @IsNumber()
  order: number;

  @IsUUID()
  courseId: string;
}