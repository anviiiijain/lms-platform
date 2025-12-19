export const API_ROUTES = {
  // Auth
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",

  // Courses
  COURSES: "/courses",
  COURSE_BY_ID: (id: string) => `/courses/${id}`,
  SIMILAR_COURSES: (id: string) => `/courses/${id}/similar`,

  // Lessons
  LESSONS: "/lessons",
  LESSON_BY_ID: (id: string) => `/lessons/${id}`,
  COMPLETE_LESSON: (id: string) => `/lessons/${id}/complete`,
  REORDER_LESSONS: "/lessons/reorder",

  // Users
  USER_PROFILE: "/users/me/profile",
  USER_STATS: "/users/me/stats",
  USER_ACTIVITY: "/users/me/activity",
} as const
