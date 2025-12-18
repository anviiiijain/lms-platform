import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SimilarCoursesModule } from './similar-courses/similar-courses.module';

@Module({
  imports: [SimilarCoursesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
