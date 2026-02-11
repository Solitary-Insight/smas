"use client"

import { useState } from "react"
import {
  courses as initialCourses,
  teachers,
  departments,
  getCourseById,
  getTeacherById,
  getDepartmentById,
  type Course,
} from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

export function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [search, setSearch] = useState("")
  const [deptFilter, setDeptFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formCode, setFormCode] = useState("")
  const [formDept, setFormDept] = useState("")
  const [formSemester, setFormSemester] = useState("1")
  const [formCredits, setFormCredits] = useState("3")
  const [formTeacher, setFormTeacher] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPrereqs, setFormPrereqs] = useState<string[]>([])

  const filtered = courses.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === "all" || c.departmentId === deptFilter
    return matchesSearch && matchesDept
  })

  const resetForm = () => {
    setFormName("")
    setFormCode("")
    setFormDept("")
    setFormSemester("1")
    setFormCredits("3")
    setFormTeacher("")
    setFormDescription("")
    setFormPrereqs([])
    setEditing(null)
  }

  const openAdd = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (course: Course) => {
    setEditing(course)
    setFormName(course.name)
    setFormCode(course.code)
    setFormDept(course.departmentId)
    setFormSemester(String(course.semester))
    setFormCredits(String(course.credits))
    setFormTeacher(course.teacherId)
    setFormDescription(course.description)
    setFormPrereqs(course.prerequisites)
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formName || !formCode || !formDept || !formTeacher) {
      toast.error("Please fill all required fields.")
      return
    }
    if (editing) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editing.id
            ? { ...c, name: formName, code: formCode, departmentId: formDept, semester: Number(formSemester), credits: Number(formCredits), teacherId: formTeacher, description: formDescription, prerequisites: formPrereqs }
            : c
        )
      )
      toast.success("Course updated successfully.")
    } else {
      const newCourse: Course = {
        id: `c-${Date.now()}`,
        name: formName,
        code: formCode,
        departmentId: formDept,
        semester: Number(formSemester),
        credits: Number(formCredits),
        teacherId: formTeacher,
        description: formDescription,
        prerequisites: formPrereqs,
      }
      setCourses((prev) => [...prev, newCourse])
      toast.success("Course added successfully.")
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id))
    toast.success("Course deleted.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Courses Management</h1>
          <p className="text-sm text-muted-foreground">{courses.length} total courses</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Department</TableHead>
                  <TableHead className="hidden sm:table-cell">Teacher</TableHead>
                  <TableHead className="hidden lg:table-cell">Sem</TableHead>
                  <TableHead className="hidden lg:table-cell">Credits</TableHead>
                  <TableHead className="hidden xl:table-cell">Prerequisites</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((course) => {
                  const dept = getDepartmentById(course.departmentId)
                  const teacher = getTeacherById(course.teacherId)
                  return (
                    <TableRow key={course.id} className="hover:bg-accent/30">
                      <TableCell>
                        <Badge variant="secondary" className="font-mono text-xs">{course.code}</Badge>
                      </TableCell>
                      <TableCell className="font-medium text-foreground">{course.name}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" style={{ borderColor: dept?.color, color: dept?.color }}>{dept?.code}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{teacher?.name}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{course.semester}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{course.credits}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {course.prerequisites.map((pId) => (
                            <Badge key={pId} variant="secondary" className="text-xs">{getCourseById(pId)?.code}</Badge>
                          ))}
                          {course.prerequisites.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(course)}>
                            <Pencil className="h-3.5 w-3.5" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(course.id)}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Course" : "Add New Course"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the course details below." : "Fill in the details to create a new course."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Course Name *</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Data Structures" />
              </div>
              <div className="space-y-2">
                <Label>Course Code *</Label>
                <Input value={formCode} onChange={(e) => setFormCode(e.target.value)} placeholder="e.g. CS201" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={formDept} onValueChange={setFormDept}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Teacher *</Label>
                <Select value={formTeacher} onValueChange={setFormTeacher}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Semester</Label>
                <Select value={formSemester} onValueChange={setFormSemester}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Credits</Label>
                <Select value={formCredits} onValueChange={setFormCredits}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((c) => <SelectItem key={c} value={String(c)}>{c} credits</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Course description..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Course"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
