import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLessonDto) {
    const courseExists = await this.prisma.course.findUnique({
      where: { id: dto.courseId },
    });

    if (!courseExists) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.lesson.create({
      data: dto,
    });
  }

  async findByCourse(courseId: string, userId?: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
    });

    if (!userId) {
      return lessons.map((lesson) => ({ ...lesson, isCompleted: false }));
    }

    // Check completion status for each lesson
    const lessonsWithCompletion = await Promise.all(
      lessons.map(async (lesson) => {
        const completion = await this.prisma.lessonCompletion.findUnique({
          where: {
            userId_lessonId: {
              userId,
              lessonId: lesson.id,
            },
          },
        });
        return { ...lesson, isCompleted: !!completion };
      }),
    );

    return lessonsWithCompletion;
  }

  async findOne(id: string, userId?: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    let isCompleted = false;
    if (userId) {
      const completion = await this.prisma.lessonCompletion.findUnique({
        where: {
          userId_lessonId: {
            userId,
            lessonId: id,
          },
        },
      });
      isCompleted = !!completion;
    }

    return { ...lesson, isCompleted };
  }

  async update(id: string, dto: UpdateLessonDto) {
    const exists = await this.prisma.lesson.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Lesson not found');
    }

    // If courseId is being updated, verify the new course exists
    if (dto.courseId) {
      const courseExists = await this.prisma.course.findUnique({
        where: { id: dto.courseId },
      });
      if (!courseExists) {
        throw new NotFoundException('Course not found');
      }
    }

    return this.prisma.lesson.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.lesson.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Lesson not found');
    }

    await this.prisma.lesson.delete({ where: { id } });
    return { message: 'Lesson deleted successfully' };
  }

  async markComplete(lessonId: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    // Check if already completed
    const existing = await this.prisma.lessonCompletion.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
    });

    if (existing) {
      return { message: 'Lesson already completed', completion: existing };
    }

    const completion = await this.prisma.lessonCompletion.create({
      data: {
        userId,
        lessonId,
      },
    });

    return { message: 'Lesson marked as complete', completion };
  }
}