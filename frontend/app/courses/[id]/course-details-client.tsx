"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Sparkles } from "lucide-react"
import { LessonsList } from "@/components/LessonList"
import { CourseContentSection } from "@/components/CourseContentSection"
import { coursesApi, lessonsApi } from "@/lib/api-service"
import type { Course, Lesson } from "@/types/course.types"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"

interface CourseDetailPageProps {
  initialCourse: Course
  initialLessons: Lesson[]
}

const CourseDetailPage = ({ initialCourse, initialLessons }: CourseDetailPageProps) => {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState<Course>(initialCourse)
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"sections" | "list">("sections")

  const courseId = course.id

  const completedLessonsCount = lessons.filter((l) => l.isCompleted).length
  const totalLessonsCount = lessons.length
  const frontendCalculatedPercentage =
    totalLessonsCount > 0 ? Math.round((completedLessonsCount / totalLessonsCount) * 100) : 0
  const backendPercentage = course.completionPercentage ?? 0

  const completionPercentage = frontendCalculatedPercentage

  // Refresh data when user authenticates to get their progress
  useEffect(() => {
    if (!isAuthenticated) return

    const refreshData = async () => {
      try {
        setIsLoading(true)
        const [courseData, lessonsData] = await Promise.all([
          coursesApi.getById(courseId),
          lessonsApi.getByCourse(courseId),
        ])

        const frontendCalc = (lessonsData.filter((l) => l.isCompleted).length / lessonsData.length) * 100
        console.log("[v0] Completion Check:")
        console.log("  Backend says:", courseData.completionPercentage, "%")
        console.log("  Frontend calculates:", Math.round(frontendCalc), "%")
        console.log("  Completed lessons:", lessonsData.filter((l) => l.isCompleted).length)
        console.log("  Total lessons:", lessonsData.length)
        console.log("  Mismatch:", courseData.completionPercentage !== Math.round(frontendCalc))

        setCourse(courseData)
        setLessons(lessonsData)
      } catch (err: any) {
        console.error("Error refreshing course data:", err)
        setError(err.response?.data?.message || "Failed to refresh course data")
      } finally {
        setIsLoading(false)
      }
    }

    refreshData()
  }, [isAuthenticated, courseId])

  const handleLessonComplete = async () => {
    try {
      const [courseData, lessonsData] = await Promise.all([
        coursesApi.getById(courseId),
        lessonsApi.getByCourse(courseId),
      ])

      const frontendCalc = (lessonsData.filter((l) => l.isCompleted).length / lessonsData.length) * 100
      console.log("[v0] After Completion Check:")
      console.log("  Backend says:", courseData.completionPercentage, "%")
      console.log("  Frontend calculates:", Math.round(frontendCalc), "%")
      console.log("  Completed lessons:", lessonsData.filter((l) => l.isCompleted).length)
      console.log("  Total lessons:", lessonsData.length)
      console.log("  Mismatch:", courseData.completionPercentage !== Math.round(frontendCalc))

      setCourse(courseData)
      setLessons(lessonsData)
    } catch (err: any) {
      console.error("Error refreshing after completion:", err)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error}</p>
        </div>
      </div>
    )
  }

  const lessonSections = [
    {
      title: course.title || "Course Lessons",
      lessons: lessons,
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back Button */}
      <Link href="/courses">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </Link>

      {/* Course Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
            <p className="text-lg text-muted-foreground">{course.description}</p>
          </div>
          {isAuthenticated && (
            <Badge variant={completionPercentage === 100 ? "default" : "secondary"} className="text-lg px-4 py-2">
              {completionPercentage}% Complete
            </Badge>
          )}
        </div>

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {course.tags.map((tag: string, index: number) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Progress Card - Only for authenticated users */}
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {isLoading ? (
                      "Loading..."
                    ) : (
                      <>
                        {completedLessonsCount} of {totalLessonsCount} lessons completed
                      </>
                    )}
                  </span>
                  <span className="font-medium">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Login prompt for non-authenticated users */}
        {!isAuthenticated && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold mb-1">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground">Sign in to track your progress and complete lessons</p>
                </div>
                <Link href="/login">
                  <Button>Sign In</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Separator className="my-8" />

      {/* Lessons Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Course Content</h2>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "sections" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("sections")}
            >
              Sections
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              List
            </Button>
            <Link href={`/courses/${course.id}/similar`}>
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Find Similar Courses
              </Button>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <>
            {viewMode === "sections" ? (
              <div className="space-y-4">
                {lessonSections.map((section, index) => (
                  <CourseContentSection
                    key={index}
                    title={section.title}
                    lessonsInSection={section.lessons}
                    onLessonComplete={handleLessonComplete}
                  />
                ))}
              </div>
            ) : (
              <LessonsList lessons={lessons} courseId={course.id} />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CourseDetailPage
