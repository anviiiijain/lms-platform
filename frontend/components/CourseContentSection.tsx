"use client"

import { useState } from "react"
import { ChevronDown, Circle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Lesson } from "@/types/course.types"
import { lessonsApi } from "@/lib/api-service"
import { toast } from "sonner"

interface CourseContentSectionProps {
  title: string
  lessonsInSection: Lesson[]
  onLessonComplete: () => void
}

export function CourseContentSection({ title, lessonsInSection, onLessonComplete }: CourseContentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null)

  const completedCount = lessonsInSection.filter((l) => l.isCompleted).length
  const totalCount = lessonsInSection.length

  const handleMarkComplete = async (lessonId: string, isCompleted: boolean) => {
    if (isCompleted) {
      toast.info("Lesson already completed")
      return
    }

    setLoadingLessonId(lessonId)
    try {
      await lessonsApi.complete(lessonId)
      toast.success("Lesson marked as complete!")
      onLessonComplete()
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark lesson as complete")
    } finally {
      setLoadingLessonId(null)
    }
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden mb-4">
      {/* Section Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} lessons completed
          </p>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 text-muted-foreground transition-transform", isExpanded && "transform rotate-180")}
        />
      </button>

      {/* Lessons List */}
      {isExpanded && (
        <div className="border-t border-border">
          {lessonsInSection.map((lesson) => (
            <div
              key={lesson.id}
              className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-4 flex-1">
                <button
                  onClick={() => handleMarkComplete(lesson.id, lesson.isCompleted || false)}
                  disabled={loadingLessonId === lesson.id}
                  className="shrink-0"
                >
                  {lesson.isCompleted ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </button>

                <div className="flex-1">
                  <p className={cn("text-base", lesson.isCompleted && "line-through text-muted-foreground")}>
                    {lesson.order}. {lesson.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
