import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Controller()
export class LessonsController {
  constructor(private lessons: LessonsService) {}

  @MessagePattern({ cmd: 'lessons.create' })
  create(data: { dto: CreateLessonDto }) {
    return this.lessons.create(data.dto);
  }

  @MessagePattern({ cmd: 'lessons.findByCourse' })
  findByCourse(data: { courseId: string; userId?: string }) {
    return this.lessons.findByCourse(data.courseId, data.userId);
  }

  @MessagePattern({ cmd: 'lessons.findOne' })
  findOne(data: { id: string; userId?: string }) {
    return this.lessons.findOne(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'lessons.update' })
  update(data: { id: string; dto: UpdateLessonDto }) {
    return this.lessons.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'lessons.delete' })
  remove(data: { id: string }) {
    return this.lessons.remove(data.id);
  }

  @MessagePattern({ cmd: 'lessons.reorder' })
  reorderLessons(data: { courseId: string; lessonOrders: { lessonId: string; order: number }[] }) {
    return this.lessons.reorderLessons(data.courseId, data.lessonOrders);
  }

  @MessagePattern({ cmd: 'lessons.markComplete' })
  markComplete(data: { lessonId: string; userId: string }) {
    return this.lessons.markComplete(data.lessonId, data.userId);
  }
}