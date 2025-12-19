export interface CourseProgress {
    courseId: string
    courseTitle: string
    totalLessons: number
    completedLessons: number
    completionPercentage: number
  }
  
  export interface RecentActivity {
    lessonId: string
    lessonTitle: string
    courseId: string
    courseTitle: string
    completedAt: string
  }
  
  export interface UserProfile {
    id: string
    email: string
    firstName: string
    lastName: string
    createdAt: string
    updatedAt: string
  }
  
  export interface UserStats {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
    }
    statistics: {
      totalLessonsCompleted: number
      totalCoursesStarted: number
      totalCoursesCompleted: number
    }
    coursesProgress: CourseProgress[]
  }
  