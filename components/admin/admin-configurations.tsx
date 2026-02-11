"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Settings, Clock, Calendar, Bell, Shield, Save } from "lucide-react"
import { toast } from "sonner"

export function AdminConfigurations() {
  const [config, setConfig] = useState({
    semesterName: "Fall 2026",
    startDate: "2026-09-01",
    endDate: "2026-12-15",
    maxCredits: "21",
    minCredits: "12",
    slotDuration: "60",
    breakDuration: "15",
    dayStart: "08:00",
    dayEnd: "18:00",
    allowConflicts: false,
    autoNotify: true,
    requireApproval: true,
    maxClassSize: "40",
    enrollmentOpen: true,
    weekStart: "monday",
  })

  function handleSave() {
    toast.success("Configuration saved successfully")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurations</h1>
          <p className="text-sm text-muted-foreground">
            System settings and timetable parameters
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Semester Settings
            </CardTitle>
            <CardDescription>Configure the current academic semester</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="semester-name">Semester Name</Label>
              <Input
                id="semester-name"
                value={config.semesterName}
                onChange={(e) => setConfig({ ...config, semesterName: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={config.startDate}
                  onChange={(e) => setConfig({ ...config, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={config.endDate}
                  onChange={(e) => setConfig({ ...config, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="week-start">Week Starts On</Label>
              <Select
                value={config.weekStart}
                onValueChange={(v) => setConfig({ ...config, weekStart: v })}
              >
                <SelectTrigger id="week-start">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Time Slot Settings
            </CardTitle>
            <CardDescription>Define class scheduling parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slot-duration">Slot Duration (min)</Label>
                <Input
                  id="slot-duration"
                  type="number"
                  value={config.slotDuration}
                  onChange={(e) => setConfig({ ...config, slotDuration: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="break-duration">Break Duration (min)</Label>
                <Input
                  id="break-duration"
                  type="number"
                  value={config.breakDuration}
                  onChange={(e) => setConfig({ ...config, breakDuration: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="day-start">Day Starts</Label>
                <Input
                  id="day-start"
                  type="time"
                  value={config.dayStart}
                  onChange={(e) => setConfig({ ...config, dayStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="day-end">Day Ends</Label>
                <Input
                  id="day-end"
                  type="time"
                  value={config.dayEnd}
                  onChange={(e) => setConfig({ ...config, dayEnd: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="h-4 w-4 text-primary" />
              Enrollment Settings
            </CardTitle>
            <CardDescription>Student enrollment parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="max-credits">Max Credits per Semester</Label>
                <Input
                  id="max-credits"
                  type="number"
                  value={config.maxCredits}
                  onChange={(e) => setConfig({ ...config, maxCredits: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min-credits">Min Credits per Semester</Label>
                <Input
                  id="min-credits"
                  type="number"
                  value={config.minCredits}
                  onChange={(e) => setConfig({ ...config, minCredits: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-class-size">Max Class Size</Label>
              <Input
                id="max-class-size"
                type="number"
                value={config.maxClassSize}
                onChange={(e) => setConfig({ ...config, maxClassSize: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              System Preferences
            </CardTitle>
            <CardDescription>Toggle system behaviors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Allow Schedule Conflicts</p>
                <p className="text-xs text-muted-foreground">
                  Allow overlapping classes in the same room
                </p>
              </div>
              <Switch
                checked={config.allowConflicts}
                onCheckedChange={(v) => setConfig({ ...config, allowConflicts: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Auto Notifications</p>
                <p className="text-xs text-muted-foreground">
                  Send email notifications for schedule changes
                </p>
              </div>
              <Switch
                checked={config.autoNotify}
                onCheckedChange={(v) => setConfig({ ...config, autoNotify: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Require Enrollment Approval</p>
                <p className="text-xs text-muted-foreground">
                  Admins must approve student enrollments
                </p>
              </div>
              <Switch
                checked={config.requireApproval}
                onCheckedChange={(v) => setConfig({ ...config, requireApproval: v })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Enrollment Open</p>
                <p className="text-xs text-muted-foreground">
                  Students can currently enroll in courses
                </p>
              </div>
              <Switch
                checked={config.enrollmentOpen}
                onCheckedChange={(v) => setConfig({ ...config, enrollmentOpen: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4 text-primary" />
            Notification Templates
          </CardTitle>
          <CardDescription>Customize notification messages sent to users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Schedule Change Notification</Label>
            <Input
              defaultValue="Your class {course} has been rescheduled to {newTime} in {room}."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Enrollment Confirmation</Label>
            <Input
              defaultValue="You have been enrolled in {course} for the {semester} semester."
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label>Class Cancellation</Label>
            <Input
              defaultValue="Your class {course} on {date} has been cancelled."
              className="text-sm"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
