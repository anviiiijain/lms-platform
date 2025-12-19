import { api } from "./api-client"
import { API_ROUTES } from "@/constants/api-routes"
import type { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth.types"
import type {
  Course,
  Lesson,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  SimilarCourse,
} from "@/types/course.types"
import type { UserStats, RecentActivity, UserProfile } from "@/types/stats.types"

// Auth API
export const authApi = {
  register: (data: RegisterRequest) => api.post<AuthResponse>(API_ROUTES.REGISTER, data),

  login: (data: LoginRequest) => api.post<AuthResponse>(API_ROUTES.LOGIN, data),
}

// Courses API
export const coursesApi = {
  getAll: () => api.get<Course[]>(API_ROUTES.COURSES),

  getById: (id: string) => api.get<Course>(API_ROUTES.COURSE_BY_ID(id)),

  create: (data: CreateCourseRequest) => api.post<Course>(API_ROUTES.COURSES, data),

  update: (id: string, data: UpdateCourseRequest) => api.put<Course>(API_ROUTES.COURSE_BY_ID(id), data),

  delete: (id: string) => api.delete(API_ROUTES.COURSE_BY_ID(id)),

  getSimilar: (id: string) => api.get<SimilarCourse[]>(API_ROUTES.SIMILAR_COURSES(id)),
}

// Lessons API
export const lessonsApi = {
  getByCourse: (courseId: string) => api.get<Lesson[]>(`${API_ROUTES.LESSONS}?courseId=${courseId}`),

  getById: (id: string) => api.get<Lesson>(API_ROUTES.LESSON_BY_ID(id)),

  create: (data: CreateLessonRequest) => api.post<Lesson>(API_ROUTES.LESSONS, data),

  update: (id: string, data: UpdateLessonRequest) => api.put<Lesson>(API_ROUTES.LESSON_BY_ID(id), data),

  delete: (id: string) => api.delete(API_ROUTES.LESSON_BY_ID(id)),

  complete: (id: string) => api.post(API_ROUTES.COMPLETE_LESSON(id)),

  reorder: (courseId: string, lessonOrders: { lessonId: string; order: number }[]) =>
    api.post(API_ROUTES.REORDER_LESSONS, { courseId, lessonOrders }),
}

// Users API - Removed id parameter since backend uses JWT token to get current user
export const usersApi = {
  getProfile: () => api.get<UserProfile>(API_ROUTES.USER_PROFILE),

  getStats: () => api.get<UserStats>(API_ROUTES.USER_STATS),

  getRecentActivity: (limit?: number) => {
    const url = limit ? `${API_ROUTES.USER_ACTIVITY}?limit=${limit}` : API_ROUTES.USER_ACTIVITY
    return api.get<RecentActivity[]>(url)
  },
}
