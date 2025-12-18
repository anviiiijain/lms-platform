import { IsUUID, IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LessonOrderItem {
  @IsUUID()
  lessonId: string;

  @IsNumber()
  order: number;
}

export class ReorderLessonsDto {
  @IsUUID()
  courseId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonOrderItem)
  lessonOrders: LessonOrderItem[];
}