import { notFound } from "next/navigation"
import { fetchCourseById, fetchLessons } from "@/lib/server-api"
import  CourseDetailPage  from "./course-details-client"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const {id:courseId} = await params
  const course = await fetchCourseById(courseId)
  if (!course) {
    return {
      title: "Course Not Found",
    }
  }

  return {
    title: `${course.title} | LearnHub`,
    description: course.description,
  }
}

export default async function Page({ params }: { params: { id: string } }) {
    const {id:courseId} = await params
  const [course, lessons] = await Promise.all([fetchCourseById(courseId), fetchLessons(courseId)])

  if (!course) {
    notFound()
  }
  console.log({course,lessons,courseId})

  return <CourseDetailPage initialCourse={course} initialLessons={lessons} />
}
