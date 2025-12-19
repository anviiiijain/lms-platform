"use client"

import { useState } from "react"
import { CourseCard } from "@/components/CourseCard"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus, Search, Filter } from "lucide-react"
import Link from "next/link"
import type { Course } from "@/types/course.types"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"

interface CoursesClientProps {
  initialCourses: Course[]
}

export function CoursesClient({ initialCourses }: CoursesClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { isAuthenticated } = useAuth()

  const filteredCourses = initialCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">All Courses</h1>
            <p className="text-muted-foreground">
              {initialCourses.length} {initialCourses.length === 1 ? "course" : "courses"} available
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
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter courses..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            All Levels
          </Button>
        </div>
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">{searchQuery ? "No courses found" : "No courses yet"}</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {searchQuery
              ? "Try adjusting your search or filter to find what you're looking for."
              : "Get started by creating your first course and begin your learning journey."}
          </p>
          {!searchQuery && isAuthenticated && (
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
      {filteredCourses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
