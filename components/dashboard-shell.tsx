"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Bell,
  Users,
  Building2,
  Settings,
  Clock,
  BookPlus,
  CalendarClock,
  DoorOpen,
  Layers,
} from "lucide-react"
import { getNotificationsForUser } from "@/lib/data"

// Portal components
import { StudentDashboard } from "@/components/student/student-dashboard"
import { StudentEnrollment } from "@/components/student/student-enrollment"
import { StudentTimetable } from "@/components/student/student-timetable"
import { StudentNotifications } from "@/components/student/student-notifications"
import { TeacherDashboard } from "@/components/teacher/teacher-dashboard"
import { TeacherReschedule } from "@/components/teacher/teacher-reschedule"
import { TeacherTimetable } from "@/components/teacher/teacher-timetable"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminCourses } from "@/components/admin/admin-courses"
import { AdminStudents } from "@/components/admin/admin-students"
import { AdminTeachers } from "@/components/admin/admin-teachers"
import { AdminClassrooms } from "@/components/admin/admin-classrooms"
import { AdminDepartments } from "@/components/admin/admin-departments"
import { AdminConfigurations } from "@/components/admin/admin-configurations"
import { AdminTimetableGenerator } from "@/components/admin/admin-timetable-generator"

interface NavItem {
  id: string
  label: string
  icon: typeof LayoutDashboard
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  student: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "enrollment", label: "Enrollment", icon: BookPlus },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "notifications", label: "Notifications", icon: Bell },
  ],
  teacher: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "timetable", label: "Timetable", icon: Calendar },
    { id: "reschedule", label: "Reschedule", icon: CalendarClock },
  ],
  admin: [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: GraduationCap },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "classrooms", label: "Classrooms", icon: DoorOpen },
    { id: "departments", label: "Departments", icon: Building2 },
    { id: "configurations", label: "Configurations", icon: Settings },
    { id: "timetable-gen", label: "Generate Timetable", icon: Layers },
  ],
}

const ROLE_LABELS: Record<Role, string> = {
  student: "Student Portal",
  teacher: "Teacher Portal",
  admin: "Admin Portal",
}

export function DashboardShell() {
  const { user, logout } = useAuth()
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  const navItems = NAV_ITEMS[user.role]
  const unreadNotifications = getNotificationsForUser(user.role, user.id).filter((n) => !n.read).length

  const handleNavClick = (id: string) => {
    setActivePage(id)
    setMobileOpen(false)
  }

  const renderContent = () => {
    switch (user.role) {
      case "student":
        switch (activePage) {
          case "dashboard": return <StudentDashboard />
          case "enrollment": return <StudentEnrollment />
          case "timetable": return <StudentTimetable />
          case "notifications": return <StudentNotifications />
          default: return <StudentDashboard />
        }
      case "teacher":
        switch (activePage) {
          case "dashboard": return <TeacherDashboard />
          case "timetable": return <TeacherTimetable />
          case "reschedule": return <TeacherReschedule />
          default: return <TeacherDashboard />
        }
      case "admin":
        switch (activePage) {
          case "dashboard": return <AdminDashboard />
          case "courses": return <AdminCourses />
          case "students": return <AdminStudents />
          case "teachers": return <AdminTeachers />
          case "classrooms": return <AdminClassrooms />
          case "departments": return <AdminDepartments />
          case "configurations": return <AdminConfigurations />
          case "timetable-gen": return <AdminTimetableGenerator />
          default: return <AdminDashboard />
        }
      default:
        return null
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary">
          <BookOpen className="h-4 w-4 text-sidebar-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">SMAS</span>
            <span className="text-xs text-sidebar-foreground/60">{ROLE_LABELS[user.role]}</span>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activePage === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="flex-1 text-left">{item.label}</span>
                )}
                {!sidebarCollapsed && item.id === "notifications" && unreadNotifications > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 justify-center px-1 text-xs">
                    {unreadNotifications}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="border-t border-sidebar-border p-3">
        <div className={cn("flex items-center gap-3", sidebarCollapsed && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-accent-foreground">
            {user.name.split(" ").map((n) => n[0]).join("")}
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium text-sidebar-foreground">{user.name}</span>
              <span className="truncate text-xs text-sidebar-foreground/60">{user.email}</span>
            </div>
          )}
          {!sidebarCollapsed && (
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8 shrink-0 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden flex-col border-r border-border bg-sidebar transition-all duration-300 md:flex",
          sidebarCollapsed ? "w-16" : "w-60"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center gap-3 border-b border-border bg-card px-4">
          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 bg-sidebar p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          {/* Collapse toggle (desktop) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden h-8 w-8 md:flex"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            <span className="sr-only">Toggle sidebar</span>
          </Button>

          <div className="flex-1">
            <h2 className="text-sm font-semibold text-foreground capitalize">
              {navItems.find((n) => n.id === activePage)?.label ?? "Dashboard"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {user.role !== "student" ? null : (
              <Button variant="ghost" size="icon" className="relative" onClick={() => handleNavClick("notifications")}>
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                    {unreadNotifications}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            )}
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-muted-foreground">{user.name}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}
