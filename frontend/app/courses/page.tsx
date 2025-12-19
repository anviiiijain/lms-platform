import type { Metadata } from "next"
import { fetchCourses } from "@/lib/server-api"
import { CoursesClient } from "./courses-client"

export const metadata: Metadata = {
  title: "All Courses - LearnHub",
  description: "Browse all available courses and start your learning journey",
}

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string
    search?: string
    tag?: string
  }>
}

export default async function CoursesPage(props: CoursesPageProps) {
  const searchParams = await props.searchParams
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const search = searchParams.search
  const tag = searchParams.tag

  const response = await fetchCourses({
    page,
    limit: 9,
    search,
    tag,
  })

  return (
    <CoursesClient
      initialCourses={response.data}
      initialPagination={response.pagination}
      initialSearchQuery={search || ""}
      initialSelectedTag={tag || ""}
      initialPage={page}
    />
  )
}
