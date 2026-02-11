"use client"

import { useAuth } from "@/lib/auth-context"
import {
  getStudentById,
  getCourseById,
  getTeacherById,
  getClassroomById,
  getTimeSlotById,
  getDepartmentById,
  getScheduleForStudent,
  getNotificationsForUser,
  DAYS,
} from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, AlertTriangle } from "lucide-react"

export function StudentDashboard() {
  const { user } = useAuth()
  if (!user) return null

  const student = getStudentById(user.id)
  if (!student) return null

  const enrolledCourses = student.enrolledCourses.map((id) => getCourseById(id)).filter(Boolean)
  const schedule = getScheduleForStudent(user.id)
  const notifications = getNotificationsForUser("student", user.id).filter((n) => !n.read)

  // Get today's day name
  const today = DAYS[new Date().getDay() - 1] || "Monday"
  const todayClasses = schedule.filter((s) => s.day === today)
  const rescheduledClasses = schedule.filter((s) => s.isRescheduled)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back, {student.name.split(" ")[0]}
        </h1>
        <p className="text-sm text-muted-foreground">
          {getDepartmentById(student.departmentId)?.name} - Semester {student.semester}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{enrolledCourses.length}</p>
              <p className="text-xs text-muted-foreground">Enrolled Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <Calendar className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{todayClasses.length}</p>
              <p className="text-xs text-muted-foreground">Classes Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{rescheduledClasses.length}</p>
              <p className="text-xs text-muted-foreground">Rescheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Unread Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Classes ({today})</CardTitle>
            <CardDescription>Your schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((entry) => {
                  const course = getCourseById(entry.courseId)
                  const teacher = getTeacherById(entry.teacherId)
                  const classroom = getClassroomById(entry.classroomId)
                  const timeSlot = getTimeSlotById(entry.timeSlotId)
                  const dept = getDepartmentById(entry.departmentId)
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
                    >
                      <div
                        className="h-10 w-1 rounded-full"
                        style={{ backgroundColor: dept?.color }}
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{course?.name}</span>
                          {entry.isRescheduled && (
                            <Badge variant="outline" className="border-warning text-warning text-xs">
                              Rescheduled
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {teacher?.name} | {classroom?.name} | {timeSlot?.label}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">{course?.code}</Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrolled Courses</CardTitle>
            <CardDescription>Your current course load</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {enrolledCourses.map((course) => {
                if (!course) return null
                const dept = getDepartmentById(course.departmentId)
                const teacher = getTeacherById(course.teacherId)
                return (
                  <div key={course.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                    <div className="h-10 w-1 rounded-full" style={{ backgroundColor: dept?.color }} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{teacher?.name} | {course.credits} credits</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">{course.code}</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
