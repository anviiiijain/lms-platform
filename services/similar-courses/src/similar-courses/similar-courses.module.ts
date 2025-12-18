import { Module } from '@nestjs/common';
import { SimilarCoursesService } from './similar-courses.service';
import { SimilarCoursesController } from './similar-courses.controller';
import { PrismaModule } from '@lms-monorepo/shared';

@Module({
  imports: [PrismaModule],
  providers: [SimilarCoursesService],
  controllers: [SimilarCoursesController]
})
export class SimilarCoursesModule {}
