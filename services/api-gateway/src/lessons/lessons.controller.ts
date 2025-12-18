import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    Request,
  } from '@nestjs/common';
  import { ClientProxy } from '@nestjs/microservices';
  import { Inject } from '@nestjs/common';
  import { firstValueFrom } from 'rxjs';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { CreateLessonDto } from './dto/create-lesson.dto';
  import { UpdateLessonDto } from './dto/update-lesson.dto';
  import { ReorderLessonsDto } from './dto/reorder-lesson.dto';
  
  @Controller('lessons')
  export class LessonsController {
    constructor(@Inject('LMS_SERVICE') private lmsClient: ClientProxy) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateLessonDto) {
      return firstValueFrom(
        this.lmsClient.send({ cmd: 'lessons.create' }, { dto }),
      );
    }
  
    @Get()
    @UseGuards(JwtAuthGuard)
    async findByCourse(@Query('courseId') courseId: string, @Request() req) {
      return firstValueFrom(
        this.lmsClient.send(
          { cmd: 'lessons.findByCourse' },
          { courseId, userId: req.user.userId },
        ),
      );
    }
  
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Request() req) {
      return firstValueFrom(
        this.lmsClient.send(
          { cmd: 'lessons.findOne' },
          { id, userId: req.user.userId },
        ),
      );
    }
  
    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
      return firstValueFrom(
        this.lmsClient.send({ cmd: 'lessons.update' }, { id, dto }),
      );
    }
  
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string) {
      return firstValueFrom(
        this.lmsClient.send({ cmd: 'lessons.delete' }, { id }),
      );
    }
  
    @Post('reorder')
    @UseGuards(JwtAuthGuard)
    async reorder(@Body() dto: ReorderLessonsDto) {
      return firstValueFrom(
        this.lmsClient.send(
          { cmd: 'lessons.reorder' },
          { courseId: dto.courseId, lessonOrders: dto.lessonOrders },
        ),
      );
    }
  
    @Post(':id/complete')
    @UseGuards(JwtAuthGuard)
    async markComplete(@Param('id') lessonId: string, @Request() req) {
      return firstValueFrom(
        this.lmsClient.send(
          { cmd: 'lessons.markComplete' },
          { lessonId, userId: req.user.userId },
        ),
      );
    }
  }