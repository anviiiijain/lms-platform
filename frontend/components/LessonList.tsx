'use client';

import { useRouter } from 'next/navigation';
import { LessonCard } from './LessonCard';
import type { Lesson } from '@/types/course.types';

interface LessonsListProps {
  lessons: Lesson[];
  courseId: string;
}

export function LessonsList({ lessons, courseId }: LessonsListProps) {
  const router = useRouter();

  const handleLessonComplete = () => {
    // Refresh the page to get updated data from server
    router.refresh();
  };

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No lessons available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.id}
          lesson={lesson}
          onComplete={handleLessonComplete}
        />
      ))}
    </div>
  );
}