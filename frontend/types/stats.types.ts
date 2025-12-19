export interface CourseProgress {
    courseId: string;
    courseTitle: string;
    completedLessons: number;
    totalLessons: number;
    completionPercentage: number;
  }
  
  export interface RecentActivity {
    id: string;
    lessonTitle: string;
    courseTitle: string;
    completedAt: string;
  }
  
  export interface UserStats {
    coursesEnrolled: number;
    lessonsCompleted: number;
    overallProgress: number;
    courseProgress: CourseProgress[];
    recentActivity: RecentActivity[];
  }