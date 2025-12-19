"use client"

import { useState, useEffect } from "react"
import { CourseCard } from "@/components/CourseCard"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import type { Course, PaginatedCoursesResponse } from "@/types/course.types"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import { coursesApi } from "@/lib/api-service"
import { useRouter, useSearchParams } from "next/navigation"

interface CoursesClientProps {
  initialCourses: Course[]
  initialPagination: PaginatedCoursesResponse["pagination"]
  initialSearchQuery: string
  initialSelectedTag: string
  initialPage: number
}

export function CoursesClient({
  initialCourses,
  initialPagination,
  initialSearchQuery,
  initialSelectedTag,
  initialPage,
}: CoursesClientProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedTag, setSelectedTag] = useState<string>(initialSelectedTag)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialPagination?.totalPages || 0)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const itemsPerPage = 9

  const allTags = Array.from(new Set(initialCourses.flatMap((course) => course.tags || [])))

  const updateURL = (page: number, search: string, tag: string) => {
    const params = new URLSearchParams()
    if (page > 1) params.set("page", page.toString())
    if (search) params.set("search", search)
    if (tag) params.set("tag", tag)

    const queryString = params.toString()
    router.push(`/courses${queryString ? `?${queryString}` : ""}`, { scroll: false })
  }

  const fetchCourses = async () => {
    try {
      setIsLoading(true)
      const response = await coursesApi.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        tag: selectedTag || undefined,
      })

      setCourses(response.data)
      setTotalPages(response.pagination.totalPages)
      updateURL(currentPage, searchQuery, selectedTag)
    } catch (error) {
      console.error("Error fetching courses:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [currentPage, searchQuery, selectedTag])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag)
    setCurrentPage(1)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Courses</h1>
            <p className="text-muted-foreground">
              {isLoading ? "Loading..." : `${courses.length} courses on this page`}
            </p>
          </div>
          {isAuthenticated && (
            <Link href="/courses/create">
              <Button size="lg" className="w-full md:w-auto">
                <Plus className="mr-2 h-5 w-5" />
                Create Course
              </Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses by title or description..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filter by tag:
              </span>
              {allTags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleTagChange(tag)}
                  className="text-xs"
                >
                  {tag}
                </Button>
              ))}
              {selectedTag && (
                <Button variant="ghost" size="sm" onClick={() => handleTagChange("")} className="text-xs">
                  Clear filter
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {!isLoading && courses.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {searchQuery || selectedTag ? "No courses found" : "No courses yet"}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery || selectedTag
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first course and begin your learning journey."}
          </p>
          {!searchQuery && !selectedTag && isAuthenticated && (
            <Link href="/courses/create">
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create Course
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Courses Grid */}
      {!isLoading && courses.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-10"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}
    </div>
  )
}
