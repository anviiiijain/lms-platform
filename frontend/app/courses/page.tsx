import type { Metadata } from "next"
import { fetchCourses } from "@/lib/server-api"
import { CoursesClient } from "./courses-client"

export const metadata: Metadata = {
  title: "All Courses - LearnHub",
  description: "Browse all available courses and start your learning journey",
}

export default async function CoursesPage() {
  const courses = await fetchCourses()

  return <CoursesClient initialCourses={courses} />
}
