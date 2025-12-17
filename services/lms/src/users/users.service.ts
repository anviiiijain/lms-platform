import { Injectable, NotFoundException } from "@nestjs/common"
import type { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getStats(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const totalLessonsCompleted = await this.prisma.lessonCompletion.count({
      where: { userId },
    })

    const userCompletions = await this.prisma.lessonCompletion.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            course: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    })

    const coursesMap = new Map()
    for (const completion of userCompletions) {
      const courseId = completion.lesson.course.id
      if (!coursesMap.has(courseId)) {
        coursesMap.set(courseId, {
          course: completion.lesson.course,
          completedLessons: new Set(),
        })
      }
      coursesMap.get(courseId).completedLessons.add(completion.lessonId)
    }

    const coursesProgress = Array.from(coursesMap.values()).map(({ course, completedLessons }) => {
      const totalLessons = course.lessons.length
      const completedCount = completedLessons.size
      const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      return {
        courseId: course.id,
        courseTitle: course.title,
        totalLessons,
        completedLessons: completedCount,
        completionPercentage,
      }
    })

    coursesProgress.sort((a, b) => b.completionPercentage - a.completionPercentage)

    const completedCourses = coursesProgress.filter((c) => c.completionPercentage === 100)

    return {
      user,
      statistics: {
        totalLessonsCompleted,
        totalCoursesStarted: coursesProgress.length,
        totalCoursesCompleted: completedCourses.length,
      },
      coursesProgress,
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    return user
  }

  async getRecentActivity(userId: string, limit = 10) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new NotFoundException("User not found")
    }

    const recentCompletions = await this.prisma.lessonCompletion.findMany({
      where: { userId },
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { completedAt: "desc" },
      take: limit,
    })

    return recentCompletions.map((completion) => ({
      lessonId: completion.lesson.id,
      lessonTitle: completion.lesson.title,
      courseId: completion.lesson.course.id,
      courseTitle: completion.lesson.course.title,
      completedAt: completion.completedAt,
    }))
  }
}
