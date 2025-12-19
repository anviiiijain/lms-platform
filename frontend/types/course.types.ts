export interface Course {
    id: string;
    title: string;
    description: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
    completionPercentage?: number;
  }

  export interface Lesson {
    id: string;
    title: string;
    content: string;
    order: number;
    courseId: string;
    createdAt: string;
    updatedAt: string;
    isCompleted?: boolean;
  }

  export interface CreateCourseRequest {
    title: string;
    description: string;
    tags?: string[];
  }

  export interface UpdateCourseRequest {
    title?: string;
    description?: string;
    tags?: string[];
  }

  export interface CreateLessonRequest {
    title: string;
    content: string;
    order: number;
    courseId: string;
  }

  export interface UpdateLessonRequest {
    title?: string;
    content?: string;
  }

  export interface ReorderLessonRequest {
    lessonId: string;
    newOrder: number;
  }

  export interface SimilarCourse extends Course {
   similarityScore?: number
  }

  export interface PaginatedCoursesResponse {
    data: Course[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
        hasNextPage: boolean
        hasPrevPage: boolean
    }
  }

  export interface CoursesQueryParams {
    page?: number
    limit?: number
    search?: string;
    tag?: string;
  }