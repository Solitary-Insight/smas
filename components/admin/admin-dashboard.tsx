"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  DoorOpen,
  CalendarDays,
  TrendingUp,
  Clock,
} from "lucide-react"
import { students, teachers, courses, classrooms, departments, scheduleEntries } from "@/lib/data"

const stats = [
  {
    label: "Students",
    value: students.length,
    icon: GraduationCap,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Teachers",
    value: teachers.length,
    icon: Users,
    color: "text-success",
    bg: "bg-success/10",
  },
  {
    label: "Courses",
    value: courses.length,
    icon: BookOpen,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    label: "Classrooms",
    value: classrooms.length,
    icon: DoorOpen,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
  {
    label: "Departments",
    value: departments.length,
    icon: Building2,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Scheduled Classes",
    value: scheduleEntries.length,
    icon: CalendarDays,
    color: "text-success",
    bg: "bg-success/10",
  },
]

const recentActivity = [
  { action: "New student enrolled", detail: "Emily Davis joined Computer Science", time: "2 hours ago" },
  { action: "Timetable updated", detail: "Monday schedule revised for Room 101", time: "4 hours ago" },
  { action: "Teacher added", detail: "Dr. Wilson joined Mathematics dept.", time: "1 day ago" },
  { action: "Course created", detail: "Advanced Machine Learning (CS-401)", time: "2 days ago" },
  { action: "Classroom reserved", detail: "Lab 201 reserved for practicals", time: "3 days ago" },
]

export function AdminDashboard() {
  const enrollmentRate = Math.round((students.length / (students.length + 5)) * 100)
  const roomUtilization = Math.round((scheduleEntries.length / (classrooms.length * 5)) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your university management system
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Enrollment Rate</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${enrollmentRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{enrollmentRate}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Room Utilization</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-success"
                    style={{ width: `${Math.min(roomUtilization, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground">{roomUtilization}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg. Class Size</span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(students.length / Math.max(courses.length, 1))} students
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Student-Teacher Ratio</span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(students.length / Math.max(teachers.length, 1))}:1
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Courses per Department</span>
              <span className="text-sm font-medium text-foreground">
                {Math.round(courses.length / Math.max(departments.length, 1))}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                  </div>
                  <Badge variant="secondary" className="flex-shrink-0 text-xs">
                    {activity.time}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4 text-primary" />
            Department Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept) => {
              const deptTeachers = teachers.filter((t) => t.department === dept.name).length
              const deptCourses = courses.filter((c) => c.department === dept.name).length
              return (
                <div
                  key={dept.id}
                  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {dept.code}
                    </Badge>
                  </div>
                  <p className="mb-1 text-sm font-medium text-foreground">{dept.name}</p>
                  <p className="mb-2 text-xs text-muted-foreground">{dept.headOfDepartment}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{deptTeachers} teachers</span>
                    <span>{deptCourses} courses</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
