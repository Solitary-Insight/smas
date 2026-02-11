"use client"

import { useAuth } from "@/lib/auth-context"
import {
  getTeacherById,
  getScheduleForTeacher,
  getCourseById,
  getClassroomById,
  getTimeSlotById,
  getDepartmentById,
  getNotificationsForUser,
  students,
  rescheduleRequests,
  DAYS,
} from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Calendar, Clock, Users } from "lucide-react"

export function TeacherDashboard() {
  const { user } = useAuth()
  if (!user) return null

  const teacher = getTeacherById(user.id)
  if (!teacher) return null

  const schedule = getScheduleForTeacher(user.id)
  const todayName = DAYS[new Date().getDay() - 1] || "Monday"
  const todayClasses = schedule.filter((s) => s.day === todayName)
  const uniqueCourses = [...new Set(schedule.map((s) => s.courseId))]
  const pendingRequests = rescheduleRequests.filter((r) => r.teacherId === user.id && r.status === "pending")
  const notifications = getNotificationsForUser("teacher", user.id).filter((n) => !n.read)

  // Count total students across all taught courses
  const totalStudents = students.filter((s) =>
    s.enrolledCourses.some((cId) => uniqueCourses.includes(cId))
  ).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome, {teacher.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          {teacher.departmentIds.map((id) => getDepartmentById(id)?.name).join(", ")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{uniqueCourses.length}</p>
              <p className="text-xs text-muted-foreground">Courses Teaching</p>
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
              <p className="text-2xl font-bold text-foreground">{pendingRequests.length}</p>
              <p className="text-xs text-muted-foreground">Pending Reschedules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalStudents}</p>
              <p className="text-xs text-muted-foreground">Total Students</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Classes ({todayName})</CardTitle>
            <CardDescription>Your teaching schedule for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">No classes scheduled today.</p>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((entry) => {
                  const course = getCourseById(entry.courseId)
                  const classroom = getClassroomById(entry.classroomId)
                  const timeSlot = getTimeSlotById(entry.timeSlotId)
                  const dept = getDepartmentById(entry.departmentId)
                  const enrolledCount = students.filter((s) => s.enrolledCourses.includes(entry.courseId)).length
                  return (
                    <div key={entry.id} className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50">
                      <div className="h-10 w-1 rounded-full" style={{ backgroundColor: dept?.color }} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{course?.name}</span>
                          {entry.isRescheduled && (
                            <Badge variant="outline" className="border-warning text-warning text-xs">Rescheduled</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {classroom?.name} | {timeSlot?.label} | {enrolledCount} students
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

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Weekly Overview</CardTitle>
            <CardDescription>Classes across all departments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {DAYS.map((day) => {
                const dayClasses = schedule.filter((s) => s.day === day)
                return (
                  <div key={day} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className={`text-sm font-medium ${day === todayName ? "text-primary" : "text-foreground"}`}>
                      {day}
                      {day === todayName && <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{dayClasses.length} classes</span>
                      <div className="flex gap-1">
                        {dayClasses.map((c) => {
                          const dept = getDepartmentById(c.departmentId)
                          return (
                            <div key={c.id} className="h-2 w-2 rounded-full" style={{ backgroundColor: dept?.color }} />
                          )
                        })}
                      </div>
                    </div>
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
