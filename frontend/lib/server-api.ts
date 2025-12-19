import type { Course, PaginatedCoursesResponse } from "@/types/course.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Server-side API calls (no localStorage access)
export async function fetchCourses(params?: {
  page?: number
  limit?: number
  search?: string
  tag?: string
}): Promise<PaginatedCoursesResponse> {
  try {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    if (params?.search) queryParams.append("search", params.search)
    if (params?.tag) queryParams.append("tag", params.tag)

    const queryString = queryParams.toString()
    const url = queryString ? `${API_BASE_URL}/courses?${queryString}` : `${API_BASE_URL}/courses`

    const res = await fetch(url, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error(`Failed to fetch courses: ${res.status} ${res.statusText}`)
      return {
        data: [],
        pagination: {
          total: 0,
          page: 1,
          limit: params?.limit || 10,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      }
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching courses:", error)
    return {
      data: [],
      pagination: {
        total: 0,
        page: 1,
        limit: params?.limit || 10,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    }
  }
}

export async function fetchCourseById(id: string): Promise<Course | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${id}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return null
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error)
    return null
  }
}

export async function fetchLessons(courseId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return []
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching lessons for course ${courseId}:`, error)
    return []
  }
}

export async function fetchSimilarCourses(courseId: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/courses/${courseId}/similar`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      return []
    }

    return res.json()
  } catch (error) {
    console.error(`Error fetching similar courses for ${courseId}:`, error)
    return []
  }
}
