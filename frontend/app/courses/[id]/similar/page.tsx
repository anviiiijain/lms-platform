import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/CourseCard';
import { ArrowLeft } from 'lucide-react';

async function getSimilarCourses(courseId: string) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  try {
    const [courseRes, similarRes] = await Promise.all([
      fetch(`${API_URL}/courses/${courseId}`, { cache: 'no-store' }),
      fetch(`${API_URL}/courses/${courseId}/similar`, { cache: 'no-store' }),
    ]);

    if (!courseRes.ok) {
      if (courseRes.status === 404) return null;
      throw new Error('Failed to fetch course');
    }

    const course = await courseRes.json();
    const similarCourses = similarRes.ok ? await similarRes.json() : [];

    return { course, similarCourses };
  } catch (error) {
    console.error('Error fetching similar courses:', error);
    throw error;
  }
}

export default async function SimilarCoursesPage({
  params,
}: {
  params: { id: string };
}) {
    const {id:courseId} = await params
  const data = await getSimilarCourses(courseId);

  if (!data) {
    notFound();
  }

  const { course, similarCourses } = data;

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Link href={`/courses/${course.id}`}>
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {course.title}
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Similar Courses</h1>
        <p className="text-lg text-muted-foreground">
          Courses related to <span className="font-semibold">{course.title}</span>
        </p>
      </div>

      {/* Empty State */}
      {similarCourses.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No similar courses found</p>
          <p className="text-sm text-muted-foreground">
            Try exploring other courses or check back later
          </p>
          <Link href="/courses">
            <Button variant="outline" className="mt-4">
              Browse All Courses
            </Button>
          </Link>
        </div>
      )}

      {/* Similar Courses Grid */}
      {similarCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {similarCourses.map((similarCourse: any) => (
            <CourseCard key={similarCourse.id} course={similarCourse} />
          ))}
        </div>
      )}
    </div>
  );
}