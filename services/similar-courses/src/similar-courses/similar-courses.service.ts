import { PrismaService } from '@lms-monorepo/shared';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SimilarCoursesService {
  constructor(private prisma: PrismaService) {}

    async findSimilar(courseId: string) {
        // Get target course and its tags
        const targetCourse = await this.prisma.course.findUnique({
          where: { id: courseId },
          select: { id: true, tags: true }
        });

        // Ensure that the course exists
        if (!targetCourse) {
            throw new NotFoundException(`Course with ID ${courseId} not found`)
          }
      
        // Find courses with any matching tags
        const similarCourses = await this.prisma.course.findMany({
          where: {
            id: { not: courseId }, 
            tags: { hasSome: targetCourse.tags } 
          }
        });
      
        // Calculate similarity score (count matching tags)
        const coursesWithScores = similarCourses.map(course => ({
          ...course,
          matchingTags: course.tags.filter(tag => targetCourse.tags.includes(tag)),
          similarityScore: course.tags.filter(tag => targetCourse.tags.includes(tag)).length
        }));
      
        // Sort by score
        return coursesWithScores.sort((a, b) => b.similarityScore - a.similarityScore);
      }
}
