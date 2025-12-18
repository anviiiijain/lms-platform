import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCourseDto,
  UpdateCourseDto,
  PrismaService,
} from '@lms-monorepo/shared';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCourseDto) {
    return this.prisma.course.create({
      data: {
        title: dto.title,
        description: dto.description,
        tags: dto.tags || [],
      },
    });
  }

  async findAll(userId?: string) {
    const courses = await this.prisma.course.findMany({
      include: {
        lessons: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate completion percentage for each course
    const coursesWithCompletion = await Promise.all(
      courses.map(async (course) => {
        const totalLessons = course.lessons.length;
        let completionPercentage = 0;

        if (userId && totalLessons > 0) {
          const completedCount = await this.prisma.lessonCompletion.count({
            where: {
              userId,
              lesson: { courseId: course.id },
            },
          });
          completionPercentage = Math.round(
            (completedCount / totalLessons) * 100,
          );
        }

        return {
          id: course.id,
          title: course.title,
          description: course.description,
          tags: course.tags,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          lessonCount: totalLessons,
          completionPercentage,
        };
      }),
    );

    return coursesWithCompletion;
  }

  async findOne(id: string, userId?: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // Calculate completion percentage
    const totalLessons = course.lessons.length;
    let completionPercentage = 0;

    if (userId && totalLessons > 0) {
      const completedCount = await this.prisma.lessonCompletion.count({
        where: {
          userId,
          lesson: { courseId: course.id },
        },
      });
      completionPercentage = Math.round((completedCount / totalLessons) * 100);
    }

    return {
      ...course,
      completionPercentage,
    };
  }

  async update(id: string, dto: UpdateCourseDto) {
    const exists = await this.prisma.course.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Course not found');
    }

    return this.prisma.course.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const exists = await this.prisma.course.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException('Course not found');
    }

    await this.prisma.course.delete({ where: { id } });
    return { message: 'Course deleted successfully' };
  }
}
