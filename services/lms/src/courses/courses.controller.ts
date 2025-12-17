import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Controller()
export class CoursesController {
  constructor(private courses: CoursesService) {}

  @MessagePattern({ cmd: 'courses.create' })
  create(data: { dto: CreateCourseDto }) {
    return this.courses.create(data.dto);
  }

  @MessagePattern({ cmd: 'courses.findAll' })
  findAll(data: { userId?: string }) {
    return this.courses.findAll(data.userId);
  }

  @MessagePattern({ cmd: 'courses.findOne' })
  findOne(data: { id: string; userId?: string }) {
    return this.courses.findOne(data.id, data.userId);
  }

  @MessagePattern({ cmd: 'courses.update' })
  update(data: { id: string; dto: UpdateCourseDto }) {
    return this.courses.update(data.id, data.dto);
  }

  @MessagePattern({ cmd: 'courses.delete' })
  remove(data: { id: string }) {
    return this.courses.remove(data.id);
  }
}