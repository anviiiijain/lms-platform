import type { Course } from "@/types/course.types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Server-side API calls (no localStorage access)
export async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/courses`, {
      cache: "no-store", // Always fetch fresh data
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error(`Failed to fetch courses: ${res.status} ${res.statusText}`)
      return []
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching courses:", error)
    return []
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
