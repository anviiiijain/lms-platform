import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SimilarCoursesService } from './similar-courses.service';

@Controller('similar-courses')
export class SimilarCoursesController {
  constructor(private readonly similarCoursesService: SimilarCoursesService) {}

  @MessagePattern({ cmd: 'courses.findSimilar' })
  async findSimilar(courseId: string) {
    return this.similarCoursesService.findSimilar(courseId);
  }
}