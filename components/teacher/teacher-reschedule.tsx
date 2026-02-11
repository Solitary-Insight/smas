"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  getScheduleForTeacher,
  getCourseById,
  getClassroomById,
  getTimeSlotById,
  getDepartmentById,
  rescheduleRequests as initialRequests,
  timeSlots,
  DAYS,
  type RescheduleRequest,
} from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarClock, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { toast } from "sonner"

export function TeacherReschedule() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<RescheduleRequest[]>(
    initialRequests.filter((r) => r.teacherId === user?.id)
  )
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null)
  const [requestedDay, setRequestedDay] = useState("")
  const [requestedSlot, setRequestedSlot] = useState("")
  const [reason, setReason] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (!user) return null

  const schedule = getScheduleForTeacher(user.id)

  const handleSubmitRequest = () => {
    if (!selectedEntry || !requestedDay || !requestedSlot || !reason.trim()) {
      toast.error("Please fill all fields.")
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      const newRequest: RescheduleRequest = {
        id: `rr-${Date.now()}`,
        teacherId: user.id,
        scheduleEntryId: selectedEntry,
        requestedDay,
        requestedTimeSlotId: requestedSlot,
        reason,
        status: "pending",
        timestamp: new Date().toISOString(),
      }
      setRequests((prev) => [...prev, newRequest])
      setSelectedEntry(null)
      setRequestedDay("")
      setRequestedSlot("")
      setReason("")
      setSubmitting(false)
      toast.success("Reschedule request submitted!", {
        description: "The admin will review your request.",
      })
    }, 1000)
  }

  const STATUS_STYLES: Record<string, string> = {
    pending: "border-warning text-warning",
    approved: "border-success text-success",
    rejected: "border-destructive text-destructive",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Reschedule Classes</h1>
        <p className="text-sm text-muted-foreground">Request to reschedule your classes</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Current classes that can be rescheduled */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your Classes</CardTitle>
            <CardDescription>Select a class to request rescheduling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {schedule.map((entry) => {
                const course = getCourseById(entry.courseId)
                const classroom = getClassroomById(entry.classroomId)
                const timeSlot = getTimeSlotById(entry.timeSlotId)
                const dept = getDepartmentById(entry.departmentId)
                const hasRequest = requests.some((r) => r.scheduleEntryId === entry.id && r.status === "pending")
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/30"
                  >
                    <div className="h-10 w-1 rounded-full" style={{ backgroundColor: dept?.color }} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium text-foreground">{course?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.day} | {timeSlot?.label} | {classroom?.name}
                      </p>
                    </div>
                    {hasRequest ? (
                      <Badge variant="outline" className="border-warning text-warning text-xs">
                        <Clock className="mr-1 h-3 w-3" />
                        Pending
                      </Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => setSelectedEntry(entry.id)}>
                        <CalendarClock className="mr-1 h-3 w-3" />
                        Reschedule
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Request History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Request History</CardTitle>
            <CardDescription>Your reschedule requests</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground">No reschedule requests yet.</p>
            ) : (
              <div className="space-y-3">
                {requests
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .map((req) => {
                    const entry = schedule.find((s) => s.id === req.scheduleEntryId)
                    const course = entry ? getCourseById(entry.courseId) : null
                    const newSlot = getTimeSlotById(req.requestedTimeSlotId)
                    return (
                      <div key={req.id} className="rounded-lg border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground">{course?.name ?? "Unknown"}</p>
                          <Badge variant="outline" className={`text-xs ${STATUS_STYLES[req.status]}`}>
                            {req.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                            {req.status === "approved" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                            {req.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Move to {req.requestedDay}, {newSlot?.label}
                        </p>
                        <p className="text-xs text-muted-foreground italic">
                          {`"`}{req.reason}{`"`}
                        </p>
                        <p className="text-xs text-muted-foreground/60">
                          {new Date(req.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    )
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Reschedule</DialogTitle>
            <DialogDescription>
              {selectedEntry && (() => {
                const entry = schedule.find((s) => s.id === selectedEntry)
                const course = entry ? getCourseById(entry.courseId) : null
                return `Reschedule ${course?.name} (${entry?.day}, ${getTimeSlotById(entry?.timeSlotId ?? "")?.label})`
              })()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Day</Label>
              <Select value={requestedDay} onValueChange={setRequestedDay}>
                <SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger>
                <SelectContent>
                  {DAYS.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New Time Slot</Label>
              <Select value={requestedSlot} onValueChange={setRequestedSlot}>
                <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                <SelectContent>
                  {timeSlots.map((ts) => (
                    <SelectItem key={ts.id} value={ts.id}>{ts.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                placeholder="Explain why you need to reschedule..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedEntry(null)}>Cancel</Button>
            <Button onClick={handleSubmitRequest} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
