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
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCourseDto, UpdateCourseDto } from '@lms-monorepo/shared';
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(
    @Inject('LMS_SERVICE')
    private lmsClient: ClientProxy,
    @Inject('SIMILAR_COURSES_SERVICE')
    private readonly similarClient: ClientProxy,
  ) {}

  @Post()
  async create(@Body() dto: CreateCourseDto) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.create' }, { dto }),
    );
  }

  @Get()
  async findAll(@Request() req) {
    return firstValueFrom(
      this.lmsClient.send(
        { cmd: 'courses.findAll' },
        { userId: req.user.userId },
      ),
    );
  }

  @Get(':id/similar')
  async findSimilar(@Param('id') id: string) {
    return firstValueFrom(
      this.similarClient.send(
        { cmd: 'courses.findSimilar' },
        { id },
      ),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.findOne' }, { id }),
    );
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.update' }, { id, dto }),
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return firstValueFrom(
      this.lmsClient.send({ cmd: 'courses.delete' }, { id }),
    );
  }
}
