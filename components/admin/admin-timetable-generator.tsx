"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  CalendarDays,
  RefreshCw,
  Download,
} from "lucide-react"
import { toast } from "sonner"
import { courses, teachers, classrooms, departments, scheduleEntries } from "@/lib/data"

type GenerationStatus = "idle" | "generating" | "done" | "error"

interface GeneratedEntry {
  id: string
  courseId: string
  courseName: string
  courseCode: string
  teacherId: string
  teacherName: string
  classroomId: string
  classroomName: string
  day: string
  startTime: string
  endTime: string
  type: "Lecture" | "Lab" | "Tutorial"
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
const TIMES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

// Convert schedule entries to display format
const initialEntries: GeneratedEntry[] = scheduleEntries.map((entry, idx) => {
  const course = courses.find((c) => c.id === entry.courseId)
  const teacher = teachers.find((t) => t.id === entry.teacherId)
  const classroom = classrooms.find((r) => r.id === entry.classroomId)
  const timeSlot = TIMES[idx % TIMES.length]
  const nextTimeSlot = TIMES[(idx + 1) % TIMES.length]

  return {
    id: entry.id,
    courseId: entry.courseId,
    courseName: course?.name || "Unknown Course",
    courseCode: course?.code || "N/A",
    teacherId: entry.teacherId,
    teacherName: teacher?.name || "TBA",
    classroomId: entry.classroomId,
    classroomName: classroom?.name || "TBA",
    day: entry.day,
    startTime: timeSlot,
    endTime: nextTimeSlot,
    type: classroom?.type === "lab" ? "Lab" : classroom?.type === "seminar" ? "Tutorial" : "Lecture",
  }
})

export function AdminTimetableGenerator() {
  const [status, setStatus] = useState<GenerationStatus>("idle")
  const [selectedDept, setSelectedDept] = useState("all")
  const [avoidConflicts, setAvoidConflicts] = useState(true)
  const [optimizeRooms, setOptimizeRooms] = useState(true)
  const [respectPreferences, setRespectPreferences] = useState(true)
  const [generatedEntries, setGeneratedEntries] = useState<GeneratedEntry[]>(initialEntries)
  const [conflicts, setConflicts] = useState<string[]>([])

  function handleGenerate() {
    setStatus("generating")
    setConflicts([])

    // Simulated generation with a timeout
    setTimeout(() => {
      const newEntries = [...initialEntries]

      // Add more generated entries to fill the timetable
      const additionalEntries = courses
        .filter((c) => selectedDept === "all" || c.departmentId === selectedDept)
        .slice(0, 4)
        .map((course, idx) => {
          const teacher = teachers.find((t) => t.departmentIds.includes(course.departmentId))
          const room = classrooms[idx % classrooms.length]
          return {
            id: `gen-${Date.now()}-${idx}`,
            courseId: course.id,
            courseName: course.name,
            courseCode: course.code,
            teacherId: teacher?.id || "",
            teacherName: teacher?.name || "TBA",
            classroomId: room.id,
            classroomName: room.name,
            day: DAYS[idx % DAYS.length],
            startTime: TIMES[(idx * 2) % TIMES.length],
            endTime: TIMES[(idx * 2 + 1) % TIMES.length],
            type: room.type === "lab" ? ("Lab" as const) : room.type === "seminar" ? ("Tutorial" as const) : ("Lecture" as const),
          }
        })

      setGeneratedEntries([...newEntries, ...additionalEntries])
      setStatus("done")

      if (!avoidConflicts) {
        setConflicts([
          "Room 101 has overlapping classes on Tuesday 10:00-11:00",
          "Dr. Smith has concurrent assignments on Wednesday 14:00-15:00",
        ])
      }

      toast.success("Timetable generated successfully")
    }, 2500)
  }

  function handleReset() {
    setStatus("idle")
    setGeneratedEntries(initialEntries)
    setConflicts([])
  }

  const filteredEntries =
    selectedDept === "all"
      ? generatedEntries
      : generatedEntries.filter((e) => {
          const course = courses.find((c) => c.id === e.courseId)
          return course?.departmentId === selectedDept
        })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Timetable Generator</h1>
          <p className="text-sm text-muted-foreground">
            Automatically generate optimized schedules
          </p>
        </div>
        <div className="flex gap-2">
          {status === "done" && (
            <Button variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
          )}
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Generation Settings</CardTitle>
            <CardDescription>Configure parameters for timetable generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Avoid Conflicts</p>
                  <p className="text-xs text-muted-foreground">No room/teacher overlaps</p>
                </div>
                <Switch checked={avoidConflicts} onCheckedChange={setAvoidConflicts} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Optimize Rooms</p>
                  <p className="text-xs text-muted-foreground">Match room capacity to class size</p>
                </div>
                <Switch checked={optimizeRooms} onCheckedChange={setOptimizeRooms} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Teacher Preferences</p>
                  <p className="text-xs text-muted-foreground">Respect preferred time slots</p>
                </div>
                <Switch checked={respectPreferences} onCheckedChange={setRespectPreferences} />
              </div>
            </div>

            <Separator />

            <div className="rounded-lg bg-muted p-3">
              <p className="text-xs font-medium text-muted-foreground">Resources Available</p>
              <div className="mt-2 space-y-1 text-sm text-foreground">
                <div className="flex justify-between">
                  <span>Courses</span>
                  <span className="font-medium">{courses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Teachers</span>
                  <span className="font-medium">{teachers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Classrooms</span>
                  <span className="font-medium">{classrooms.length}</span>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleGenerate}
              disabled={status === "generating"}
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Timetable
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-primary" />
                Generated Schedule
              </CardTitle>
              {status === "done" && (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Generated
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {conflicts.length > 0 && (
              <div className="mb-4 rounded-lg border border-warning/30 bg-warning/10 p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  {conflicts.length} Conflict{conflicts.length > 1 ? "s" : ""} Detected
                </div>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {conflicts.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {status === "generating" && (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium text-foreground">Generating optimized timetable...</p>
                <p className="text-xs text-muted-foreground">
                  Resolving constraints and assigning slots
                </p>
              </div>
            )}

            {status === "idle" && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="mb-4 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No timetable generated yet</p>
                <p className="text-xs text-muted-foreground">
                  Configure settings and click &quot;Generate Timetable&quot;
                </p>
              </div>
            )}

            {(status === "done" || status === "error") && (
              <div className="overflow-x-auto">
                <div className="inline-grid min-w-[640px] grid-cols-6 gap-px rounded-lg bg-border">
                  <div className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground">
                    Time
                  </div>
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="bg-muted p-2 text-center text-xs font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  {TIMES.slice(0, 9).map((time) => (
                    <>
                      <div
                        key={`time-${time}`}
                        className="flex items-center justify-center bg-card p-2 text-xs text-muted-foreground"
                      >
                        {time}
                      </div>
                      {DAYS.map((day) => {
                        const entry = filteredEntries.find(
                          (e) => e.day === day && e.startTime === time
                        )
                        return (
                          <div
                            key={`${day}-${time}`}
                            className="flex min-h-[56px] items-center bg-card p-1"
                          >
                            {entry && (
                              <div
                                className={`w-full rounded p-1.5 text-xs ${
                                  entry.type === "Lab"
                                    ? "bg-success/10 text-success"
                                    : entry.type === "Tutorial"
                                      ? "bg-warning/10 text-warning"
                                      : "bg-primary/10 text-primary"
                                }`}
                              >
                                <p className="font-medium">{entry.courseCode}</p>
                                <p className="truncate opacity-80">{entry.classroomName}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
