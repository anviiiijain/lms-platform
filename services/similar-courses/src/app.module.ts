import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { SimilarCoursesModule } from './similar-courses/similar-courses.module';
import { PrismaModule } from '@lms-monorepo/shared';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    SimilarCoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
