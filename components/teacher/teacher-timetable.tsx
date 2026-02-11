"use client"

import { useAuth } from "@/lib/auth-context"
import {
  getScheduleForTeacher,
  getCourseById,
  getClassroomById,
  getTimeSlotById,
  getDepartmentById,
  timeSlots,
  breaks,
  students,
  DAYS,
} from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function TeacherTimetable() {
  const { user } = useAuth()
  if (!user) return null

  const schedule = getScheduleForTeacher(user.id)
  const todayName = DAYS[new Date().getDay() - 1] || "Monday"

  const getEntryForSlot = (day: string, tsId: string) => {
    return schedule.find((s) => s.day === day && s.timeSlotId === tsId)
  }

  const isBreakSlot = (day: string, tsId: string) => {
    const ts = getTimeSlotById(tsId)
    if (!ts) return false
    return breaks.some((b) => {
      if (b.day !== "all" && b.day !== day) return false
      return ts.startTime >= b.startTime && ts.startTime < b.endTime
    })
  }

  const getBreakName = (day: string, tsId: string) => {
    const ts = getTimeSlotById(tsId)
    if (!ts) return null
    const br = breaks.find((b) => {
      if (b.day !== "all" && b.day !== day) return false
      return ts.startTime >= b.startTime && ts.startTime < b.endTime
    })
    return br?.name ?? null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">My Timetable</h1>
        <p className="text-sm text-muted-foreground">Your weekly teaching schedule</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Week View</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <TooltipProvider delayDuration={200}>
            <div className="min-w-[700px]">
              <div className="grid grid-cols-6 gap-px border-b border-border bg-border">
                <div className="bg-card p-3 text-xs font-semibold text-muted-foreground">Time</div>
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className={cn(
                      "bg-card p-3 text-center text-xs font-semibold",
                      day === todayName ? "text-primary" : "text-foreground"
                    )}
                  >
                    {day}
                    {day === todayName && (
                      <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </div>
                ))}
              </div>

              {timeSlots.map((ts) => (
                <div key={ts.id} className="grid grid-cols-6 gap-px border-b border-border bg-border last:border-b-0">
                  <div className="bg-card p-3 text-xs text-muted-foreground">{ts.label}</div>
                  {DAYS.map((day) => {
                    const entry = getEntryForSlot(day, ts.id)
                    const isBr = isBreakSlot(day, ts.id)
                    const breakName = getBreakName(day, ts.id)

                    if (isBr) {
                      return (
                        <div key={`${day}-${ts.id}`} className="flex items-center justify-center bg-muted p-2">
                          <span className="text-xs text-muted-foreground italic">{breakName}</span>
                        </div>
                      )
                    }

                    if (!entry) {
                      return (
                        <div key={`${day}-${ts.id}`} className={cn("bg-card p-2", day === todayName && "bg-primary/[0.02]")} />
                      )
                    }

                    const course = getCourseById(entry.courseId)
                    const classroom = getClassroomById(entry.classroomId)
                    const dept = getDepartmentById(entry.departmentId)
                    const enrolledCount = students.filter((s) => s.enrolledCourses.includes(entry.courseId)).length

                    return (
                      <Tooltip key={`${day}-${ts.id}`}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "cursor-pointer rounded-sm border-l-[3px] p-2 transition-all hover:shadow-md",
                              entry.isRescheduled ? "border-l-warning bg-warning/10" : "bg-card hover:bg-accent/30"
                            )}
                            style={{ borderLeftColor: entry.isRescheduled ? undefined : dept?.color }}
                          >
                            <p className="text-xs font-medium text-foreground leading-tight">{course?.code}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{classroom?.name}</p>
                            <p className="text-[10px] text-muted-foreground leading-tight">{enrolledCount} students</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">{course?.name}</p>
                            <p className="text-xs">Room: {classroom?.name}</p>
                            <p className="text-xs">Students: {enrolledCount}</p>
                            <p className="text-xs">Time: {ts.label}</p>
                            <p className="text-xs">Dept: {dept?.name}</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  )
}
