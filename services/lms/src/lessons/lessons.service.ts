import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateLessonDto,UpdateLessonDto,PrismaService } from '@lms-monorepo/shared';

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

  // Check if order already exists 
  const existingOrder = await this.prisma.lesson.findFirst({
    where: {
      courseId: dto.courseId,
      order: dto.order,
    },
  });

  if (existingOrder) {
    throw new BadRequestException(
      `Order ${dto.order} is already taken by lesson "${existingOrder.title}". Please choose a different order number.`,
    );
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
  
    // Block order changes, we have reorder separately
    if (dto.order !== undefined && dto.order !== exists.order) {
      throw new BadRequestException(
        'Cannot change lesson order via update. Please use the reorder endpoint to rearrange lessons.',
      );
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
  
    // Remove order from update data
    const { order, ...updateData } = dto;
  
    return this.prisma.lesson.update({
      where: { id },
      data: updateData,
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

  async reorderLessons(courseId: string, lessonOrders: { lessonId: string; order: number }[]) {
    // Verify course exists
    const courseExists = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true },
    });
    if (!courseExists) {
      throw new NotFoundException('Course not found');
    }

    // Get current state of lessons
    const lessonIds = lessonOrders.map((lo) => lo.lessonId);
    const currentLessons = await this.prisma.lesson.findMany({
      where: {
        id: { in: lessonIds },
      },
      select: {
        id: true,
        title: true,
        order: true,
        courseId: true,
      },
    });

    // Verify all lessons exist and belong to this course
    if (currentLessons.length !== lessonIds.length) {
      throw new BadRequestException('Some lessons do not exist');
    }

    const invalidLessons = currentLessons.filter((l) => l.courseId !== courseId);
    if (invalidLessons.length > 0) {
      throw new BadRequestException(
        `Lessons [${invalidLessons.map((l) => l.title).join(', ')}] do not belong to this course`,
      );
    }

    // Check for duplicate orders in the request
    const orderSet = new Set(lessonOrders.map((lo) => lo.order));
    if (orderSet.size !== lessonOrders.length) {
      throw new BadRequestException('Duplicate orders in the request');
    }

    // Build change summary
    const changes = lessonOrders
      .map((newOrder) => {
        const current = currentLessons.find((l) => l.id === newOrder.lessonId);
        if (current && current.order !== newOrder.order) {
          return {
            lessonId: current.id,
            title: current.title,
            oldOrder: current.order,
            newOrder: newOrder.order,
          };
        }
        return null;
      })
      .filter(Boolean);

    // Update all lesson orders in a transaction
    await this.prisma.$transaction(
      lessonOrders.map((lo) =>
        this.prisma.lesson.update({
          where: { id: lo.lessonId },
          data: { order: lo.order },
        }),
      ),
    );

    // Get updated lessons
    const updatedLessons = await this.prisma.lesson.findMany({
      where: { courseId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        order: true,
      },
    });

    return {
      message: 'Lessons reordered successfully',
      course: {
        id: courseExists.id,
        title: courseExists.title,
      },
      summary: {
        totalLessons: updatedLessons.length,
        lessonsReordered: changes.length,
      },
      changes: changes.map((c) => ({
        lesson: c?.title,
        moved: `position ${c?.oldOrder} → ${c?.newOrder}`,
      })),
      newOrder: updatedLessons.map((l) => ({
        position: l.order,
        lesson: l.title,
        id: l.id,
      })),
    };
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