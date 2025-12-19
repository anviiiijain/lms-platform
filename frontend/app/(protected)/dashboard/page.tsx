"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { usersApi } from "@/lib/api-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, CheckCircle2, Clock, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { UserStats, RecentActivity } from "@/types/stats.types"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<UserStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return

      try {
        setIsLoading(true)
        setError(null)
        const [statsData, activityData] = await Promise.all([usersApi.getStats(), usersApi.getRecentActivity(10)])
        setStats(statsData)
        setRecentActivity(activityData)
      } catch (err: any) {
        console.error("Error fetching user data:", err)
        setError(err.response?.data?.message || "Failed to fetch statistics")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user?.id])

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Skeleton className="h-10 w-64 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Error: {error || "Failed to load data"}</p>
        </div>
      </div>
    )
  }

  const inProgressCourses = stats.coursesProgress.filter(
    (c) => c.completionPercentage > 0 && c.completionPercentage < 100,
  ).length

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {stats.user.firstName}!</h1>
        <p className="text-muted-foreground">Track your learning progress and achievements</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.statistics.totalCoursesStarted}</div>
            <p className="text-xs text-muted-foreground mt-1">Courses started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.statistics.totalCoursesCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Finished courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lessons Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.statistics.totalLessonsCompleted}</div>
            <p className="text-xs text-muted-foreground mt-1">Total lessons</p>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.coursesProgress.length === 0 ? (
              <p className="text-sm text-muted-foreground">No courses started yet</p>
            ) : (
              stats.coursesProgress.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/courses/${course.courseId}`}
                  className="block space-y-2 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{course.courseTitle}</h3>
                    <span className="text-sm text-muted-foreground">{course.completionPercentage}%</span>
                  </div>
                  <Progress value={course.completionPercentage} />
                  <p className="text-xs text-muted-foreground">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div key={activity.lessonId} className="flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.lessonTitle}</p>
                    <p className="text-xs text-muted-foreground truncate">{activity.courseTitle}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
