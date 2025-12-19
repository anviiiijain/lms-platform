import { api } from './api-client';
import { API_ROUTES } from '@/constants/api-routes';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '@/types/auth.types';
import type {
  Course,
  Lesson,
  CreateCourseRequest,
  UpdateCourseRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  ReorderLessonRequest,
  SimilarCourse,
} from '@/types/course.types';
import type { UserStats } from '@/types/stats.types';

// Auth API
export const authApi = {
  register: (data: RegisterRequest) =>
    api.post<AuthResponse>(API_ROUTES.REGISTER, data),

  login: (data: LoginRequest) =>
    api.post<AuthResponse>(API_ROUTES.LOGIN, data),
};

// Courses API
export const coursesApi = {
  getAll: () => api.get<Course[]>(API_ROUTES.COURSES),

  getById: (id: string) => api.get<Course>(API_ROUTES.COURSE_BY_ID(id)),

  create: (data: CreateCourseRequest) =>
    api.post<Course>(API_ROUTES.COURSES, data),

  update: (id: string, data: UpdateCourseRequest) =>
    api.patch<Course>(API_ROUTES.COURSE_BY_ID(id), data),

  delete: (id: string) => api.delete(API_ROUTES.COURSE_BY_ID(id)),

  getSimilar: (id: string) =>
    api.get<SimilarCourse[]>(API_ROUTES.SIMILAR_COURSES(id)),
};

// Lessons API
export const lessonsApi = {
  getAll: (courseId?: string) => {
    const url = courseId
      ? `${API_ROUTES.LESSONS}?courseId=${courseId}`
      : API_ROUTES.LESSONS;
    return api.get<Lesson[]>(url);
  },

  getById: (id: string) => api.get<Lesson>(API_ROUTES.LESSON_BY_ID(id)),

  create: (data: CreateLessonRequest) =>
    api.post<Lesson>(API_ROUTES.LESSONS, data),

  update: (id: string, data: UpdateLessonRequest) =>
    api.patch<Lesson>(API_ROUTES.LESSON_BY_ID(id), data),

  delete: (id: string) => api.delete(API_ROUTES.LESSON_BY_ID(id)),

  complete: (id: string) => api.post(API_ROUTES.COMPLETE_LESSON(id)),

  reorder: (lessons: ReorderLessonRequest[]) =>
    api.post(API_ROUTES.REORDER_LESSONS, { lessons }),
};

// Users API
export const usersApi = {
  getStats: (id: string) => api.get<UserStats>(API_ROUTES.USER_STATS(id)),
};