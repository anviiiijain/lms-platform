import { Module } from '@nestjs/common';
import { SimilarCoursesService } from './similar-courses.service';
import { SimilarCoursesController } from './similar-courses.controller';
import { SimilarCoursesService } from './similar-courses.service';
import { SimilarCoursesController } from './similar-courses.controller';

@Module({
  providers: [SimilarCoursesService],
  controllers: [SimilarCoursesController]
})
export class SimilarCoursesModule {}
