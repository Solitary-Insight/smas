"use client"

import { useState } from "react"
import { classrooms as initialClassrooms, type Classroom } from "@/lib/data"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

const TYPE_COLORS: Record<string, string> = {
  lecture: "bg-primary/10 text-primary",
  lab: "bg-success/10 text-success",
  seminar: "bg-warning/10 text-warning",
}

export function AdminClassrooms() {
  const [rooms, setRooms] = useState<Classroom[]>(initialClassrooms)
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Classroom | null>(null)

  const [formName, setFormName] = useState("")
  const [formBuilding, setFormBuilding] = useState("")
  const [formCapacity, setFormCapacity] = useState("50")
  const [formType, setFormType] = useState<Classroom["type"]>("lecture")
  const [formEquipment, setFormEquipment] = useState("")

  const filtered = rooms.filter(
    (r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.building.toLowerCase().includes(search.toLowerCase())
  )

  const resetForm = () => {
    setFormName(""); setFormBuilding(""); setFormCapacity("50"); setFormType("lecture"); setFormEquipment(""); setEditing(null)
  }

  const openAdd = () => { resetForm(); setDialogOpen(true) }

  const openEdit = (room: Classroom) => {
    setEditing(room)
    setFormName(room.name)
    setFormBuilding(room.building)
    setFormCapacity(String(room.capacity))
    setFormType(room.type)
    setFormEquipment(room.equipment.join(", "))
    setDialogOpen(true)
  }

  const handleSave = () => {
    if (!formName || !formBuilding) {
      toast.error("Please fill all required fields.")
      return
    }
    const equipArr = formEquipment.split(",").map((e) => e.trim()).filter(Boolean)
    if (editing) {
      setRooms((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name: formName, building: formBuilding, capacity: Number(formCapacity), type: formType, equipment: equipArr }
            : r
        )
      )
      toast.success("Classroom updated.")
    } else {
      const newRoom: Classroom = {
        id: `cr-${Date.now()}`,
        name: formName,
        building: formBuilding,
        capacity: Number(formCapacity),
        type: formType,
        equipment: equipArr,
      }
      setRooms((prev) => [...prev, newRoom])
      toast.success("Classroom added.")
    }
    setDialogOpen(false)
    resetForm()
  }

  const handleDelete = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id))
    toast.success("Classroom deleted.")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Classrooms Management</h1>
          <p className="text-sm text-muted-foreground">{rooms.length} total classrooms</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Classroom
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search classrooms..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Building</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="hidden sm:table-cell">Capacity</TableHead>
                  <TableHead className="hidden md:table-cell">Equipment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((room) => (
                  <TableRow key={room.id} className="hover:bg-accent/30">
                    <TableCell className="font-medium text-foreground">{room.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{room.building}</TableCell>
                    <TableCell>
                      <Badge className={`capitalize text-xs ${TYPE_COLORS[room.type]}`}>{room.type}</Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{room.capacity}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {room.equipment.map((e) => (
                          <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(room)}>
                          <Pencil className="h-3.5 w-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(room.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Classroom" : "Add New Classroom"}</DialogTitle>
            <DialogDescription>{editing ? "Update classroom details." : "Add a new classroom."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Room Name *</Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="e.g. Hall A101" />
              </div>
              <div className="space-y-2">
                <Label>Building *</Label>
                <Input value={formBuilding} onChange={(e) => setFormBuilding(e.target.value)} placeholder="e.g. Main Building" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formType} onValueChange={(v) => setFormType(v as Classroom["type"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecture">Lecture</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="seminar">Seminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Capacity</Label>
                <Input type="number" value={formCapacity} onChange={(e) => setFormCapacity(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Equipment (comma-separated)</Label>
              <Input value={formEquipment} onChange={(e) => setFormEquipment(e.target.value)} placeholder="Projector, Whiteboard" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? "Save Changes" : "Add Classroom"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
