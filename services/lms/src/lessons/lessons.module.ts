import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from '@lms-monorepo/shared';

@Module({
  imports: [PrismaModule],
  providers: [LessonsService],
  controllers: [LessonsController]
})
export class LessonsModule {}
