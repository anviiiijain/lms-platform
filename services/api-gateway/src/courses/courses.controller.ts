import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCourseDto, UpdateCourseDto } from '@lms-monorepo/shared';
@Controller('courses')
export class CoursesController {
  constructor(
    @Inject('LMS_SERVICE') private lmsClient: ClientProxy,
    @Inject('SIMILAR_COURSES_SERVICE')
    private readonly similarClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCourseDto) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.create' }, { dto }),
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Request() req) {
    return firstValueFrom(
      this.lmsClient.send(
        { cmd: 'courses.findAll' },
        { userId: req.user.userId },
      ),
    );
  }

  @Get(':id/similar')
  @UseGuards(JwtAuthGuard)
  async findSimilar(@Param('id') id: string, @Request() req) {
    return firstValueFrom(
      this.similarClient.send(
        { cmd: 'courses.findSimilar' },
        { id, userId: req.user.userId },
      ),
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req) {
    return firstValueFrom(
      this.lmsClient.send(
        { cmd: 'courses.findOne' },
        { id, userId: req.user.userId },
      ),
    );
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.update' }, { id, dto }),
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.delete' }, { id }),
    );
  }
}
