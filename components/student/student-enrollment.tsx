"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  courses,
  getStudentById,
  getCourseById,
  getTeacherById,
  getDepartmentById,
  checkPrerequisites,
} from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, CheckCircle2, XCircle, BookOpen, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { departments } from "@/lib/data"

export function StudentEnrollment() {
  const { user } = useAuth()
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState<string>("all")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => {
    const student = user ? getStudentById(user.id) : null
    return student?.enrolledCourses ?? []
  })

  if (!user) return null
  const student = getStudentById(user.id)
  if (!student) return null

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === "all" || c.departmentId === deptFilter
    return matchesSearch && matchesDept
  })

  const courseDetail = selectedCourse ? getCourseById(selectedCourse) : null
  const prereqCheck = selectedCourse ? checkPrerequisites(user.id, selectedCourse) : null

  const handleEnroll = (courseId: string) => {
    const check = checkPrerequisites(user.id, courseId)
    if (!check.met) {
      toast.error("Prerequisites not met", {
        description: `Missing: ${check.missing.map((id) => getCourseById(id)?.code).join(", ")}`,
      })
      return
    }
    if (enrolledIds.includes(courseId)) {
      toast.info("Already enrolled in this course.")
      return
    }
    setEnrolledIds((prev) => [...prev, courseId])
    toast.success("Enrolled successfully!", {
      description: `You have been enrolled in ${getCourseById(courseId)?.name}.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Course Enrollment</h1>
        <p className="text-sm text-muted-foreground">Browse and enroll in available courses</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Available Courses</CardTitle>
              <CardDescription>{filteredCourses.length} courses found</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredCourses.map((course) => {
              const dept = getDepartmentById(course.departmentId)
              const teacher = getTeacherById(course.teacherId)
              const isEnrolled = enrolledIds.includes(course.id)
              const prereqs = checkPrerequisites(user.id, course.id)
              const isCompleted = student.completedCourses.includes(course.id)
              return (
                <div
                  key={course.id}
                  className="flex flex-col gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-accent/30 sm:flex-row sm:items-center"
                >
                  <div className="h-full w-1 self-stretch rounded-full hidden sm:block" style={{ backgroundColor: dept?.color }} />
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        className="text-sm font-medium text-foreground hover:text-primary hover:underline"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        {course.name}
                      </button>
                      <Badge variant="secondary" className="text-xs">{course.code}</Badge>
                      <Badge variant="outline" className="text-xs" style={{ borderColor: dept?.color, color: dept?.color }}>
                        {dept?.code}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {teacher?.name} | Semester {course.semester} | {course.credits} credits
                    </p>
                    {course.prerequisites.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        <span className="text-xs text-muted-foreground">Prerequisites:</span>
                        {course.prerequisites.map((pId) => {
                          const pc = getCourseById(pId)
                          const completed = student.completedCourses.includes(pId)
                          return (
                            <Badge
                              key={pId}
                              variant={completed ? "default" : "destructive"}
                              className="text-xs"
                            >
                              {completed ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                              {pc?.code}
                            </Badge>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0">
                    {isCompleted ? (
                      <Badge className="bg-success text-success-foreground">Completed</Badge>
                    ) : isEnrolled ? (
                      <Badge className="bg-primary text-primary-foreground">Enrolled</Badge>
                    ) : (
                      <Button
                        size="sm"
                        disabled={!prereqs.met}
                        onClick={() => handleEnroll(course.id)}
                      >
                        {prereqs.met ? "Enroll" : "Prerequisites Required"}
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Course Detail Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-md">
          {courseDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {courseDetail.name}
                </DialogTitle>
                <DialogDescription>{courseDetail.code} | {courseDetail.credits} credits</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{courseDetail.description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Department</p>
                    <p className="text-muted-foreground">{getDepartmentById(courseDetail.departmentId)?.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Semester</p>
                    <p className="text-muted-foreground">{courseDetail.semester}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Teacher</p>
                    <p className="text-muted-foreground">{getTeacherById(courseDetail.teacherId)?.name}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Credits</p>
                    <p className="text-muted-foreground">{courseDetail.credits}</p>
                  </div>
                </div>
                {courseDetail.prerequisites.length > 0 && (
                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Prerequisites</p>
                    <div className="flex flex-wrap gap-2">
                      {courseDetail.prerequisites.map((pId) => {
                        const pc = getCourseById(pId)
                        const met = student.completedCourses.includes(pId)
                        return (
                          <Badge key={pId} variant={met ? "default" : "destructive"}>
                            {met ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                            {pc?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )}
                {prereqCheck && !prereqCheck.met && (
                  <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
                    <div>
                      <p className="text-sm font-medium text-destructive">Cannot enroll</p>
                      <p className="text-xs text-muted-foreground">
                        Missing: {prereqCheck.missing.map((id) => getCourseById(id)?.code).join(", ")}
                      </p>
                    </div>
                  </div>
                )}
                <Button
                  className="w-full"
                  disabled={!prereqCheck?.met || enrolledIds.includes(courseDetail.id)}
                  onClick={() => {
                    handleEnroll(courseDetail.id)
                    setSelectedCourse(null)
                  }}
                >
                  {enrolledIds.includes(courseDetail.id) ? "Already Enrolled" : prereqCheck?.met ? "Enroll Now" : "Prerequisites Not Met"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
