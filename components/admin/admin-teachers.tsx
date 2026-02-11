"use client"

import { useState } from "react"
import {
  teachers as initialTeachers,
  departments,
  getDepartmentById,
  getScheduleForTeacher,
  type Teacher,
  DAYS,
} from "@/lib/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function AdminTeachers() {
  const [teacherList, setTeacherList] = useState<Teacher[]>(initialTeachers)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Teacher | null>(null)

  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formDepts, setFormDepts] = useState<string[]>([])
  const [formPriorityDays, setFormPriorityDays] = useState<string[]>([])
  const [formTimeStart, setFormTimeStart] = useState("09:00")
  const [formTimeEnd, setFormTimeEnd] = useState("15:00")

  const filtered = teacherList.filter(
    (t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.email.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setFormName("")
    setFormEmail("")
    setFormDepts([])
    setFormPriorityDays([])
    setFormTimeStart("09:00")
    setFormTimeEnd("15:00")
    setEditing(null)
  }

  const openAdd = () => { resetForm(); setDialogOpen(true) }

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher)
    setFormName(teacher.name)
    setFormEmail(teacher.email)
    setFormDepts(teacher.departmentIds)
    setFormPriorityDays(teacher.priorityDays)
    setFormTimeStart(teacher.priorityTimeStart)
    setFormTimeEnd(teacher.priorityTimeEnd)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formName || !formEmail || formDepts.length === 0) {
      toast.error("Please fill all required fields.")
      return
    }
    if (editing) {
      setTeacherList((prev) =>
        prev.map((t) =>
          t.id === editing.id
            ? { ...t, name: formName, email: formEmail, departmentIds: formDepts, priorityDays: formPriorityDays, priorityTimeStart: formTimeStart, priorityTimeEnd: formTimeEnd }
            : t
        )
      )
      toast.success("Teacher updated.")
    } else {
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        name: formName,
        email: formEmail,
        departmentIds: formDepts,
        priorityDays: formPriorityDays,
        priorityTimeStart: formTimeStart,
        priorityTimeEnd: formTimeEnd,
      }
      setTeacherList((prev) => [...prev, newTeacher])
      toast.success("Teacher added.")
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setTeacherList((prev) => prev.filter((t) => t.id !== id))
    toast.success("Teacher deleted.")
  }

  const toggleDept = (deptId: string) => {
    setFormDepts((prev) => prev.includes(deptId) ? prev.filter((d) => d !== deptId) : [...prev, deptId])
  }

  const toggleDay = (day: string) => {
    setFormPriorityDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Teachers Management</h1>
          <p className="text-sm text-muted-foreground">{teacherList.length} total teachers</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Departments</TableHead>
                  <TableHead className="hidden md:table-cell">Priority Days</TableHead>
                  <TableHead className="hidden lg:table-cell">Classes/Week</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((teacher) => {
                  const classCount = getScheduleForTeacher(teacher.id).length
                  return (
                    <TableRow key={teacher.id} className="hover:bg-accent/30">
                      <TableCell className="font-medium text-foreground">{teacher.name}</TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{teacher.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {teacher.departmentIds.map((dId) => {
                            const dept = getDepartmentById(dId)
                            return (
                              <Badge key={dId} variant="outline" style={{ borderColor: dept?.color, color: dept?.color }} className="text-xs">
                                {dept?.code}
                              </Badge>
                            )
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                        {teacher.priorityDays.join(", ")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{classCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(teacher)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(teacher.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
            <DialogDescription>{editing ? "Update teacher details." : "Add a new teacher to the system."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Full name" />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="Email" type="email" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Departments *</Label>
              <div className="flex flex-wrap gap-3">
                {departments.map((d) => (
                  <label key={d.id} className="flex items-center gap-2">
                    <Checkbox checked={formDepts.includes(d.id)} onCheckedChange={() => toggleDept(d.id)} />
                    <span className="text-sm">{d.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Priority Days</Label>
              <div className="flex flex-wrap gap-3">
                {DAYS.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <Checkbox checked={formPriorityDays.includes(day)} onCheckedChange={() => toggleDay(day)} />
                    <span className="text-sm">{day}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority Start Time</Label>
                <Input type="time" value={formTimeStart} onChange={(e) => setFormTimeStart(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Priority End Time</Label>
                <Input type="time" value={formTimeEnd} onChange={(e) => setFormTimeEnd(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Teacher"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
