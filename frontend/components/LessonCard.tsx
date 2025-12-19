"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { lessonsApi } from "@/lib/api-service"
import { cn } from "@/lib/utils"
import type { Lesson } from "@/types/course.types"

interface LessonCardProps {
  lesson: Lesson
  onComplete: () => void
}

export function LessonCard({ lesson, onComplete }: LessonCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async () => {
    if (lesson.isCompleted) {
      toast.info("Lesson already completed")
      return
    }

    setIsLoading(true)
    try {
      await lessonsApi.complete(lesson.id)
      toast.success("Lesson marked as complete!")
      onComplete() // Trigger parent refresh
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark lesson as complete")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card
      className={lesson.isCompleted ? "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-950/20" : ""}
    >
      <CardContent className="flex items-center justify-between p-6">
        <div className="flex items-start gap-4 flex-1">
          {/* Order Badge */}
          <Badge variant="outline" className="shrink-0">
            {lesson.order}
          </Badge>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("font-semibold text-lg", lesson.isCompleted && "line-through text-muted-foreground")}>
                {lesson.title}
              </h3>
              {lesson.isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" />}
            </div>
            <p className={cn("text-sm text-muted-foreground line-clamp-2", lesson.isCompleted && "line-through")}>
              {lesson.content}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleComplete}
          disabled={isLoading || lesson.isCompleted}
          variant={lesson.isCompleted ? "outline" : "default"}
          className="ml-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Marking...
            </>
          ) : lesson.isCompleted ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Completed
            </>
          ) : (
            <>
              <Circle className="mr-2 h-4 w-4" />
              Mark Complete
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
