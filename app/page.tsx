"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import type { Role } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GraduationCap, BookOpen, Shield, ArrowRight } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"

const ROLE_CONFIG: {
  role: Role
  label: string
  description: string
  icon: typeof GraduationCap
  userId: string
  demoEmail: string
  color: string
}[] = [
  { role: "student", label: "Student", description: "Courses & timetable", icon: GraduationCap, userId: "s-1", demoEmail: "alex.j@student.greenfield.edu", color: "from-blue-500 to-blue-600" },
  { role: "teacher", label: "Teacher", description: "Manage schedules", icon: BookOpen, userId: "t-1", demoEmail: "s.mitchell@greenfield.edu", color: "from-purple-500 to-purple-600" },
  { role: "admin", label: "Admin", description: "Full management", icon: Shield, userId: "admin-1", demoEmail: "admin@greenfield.edu", color: "from-orange-500 to-orange-600" },
]

export default function Page() {
  const { user, isAuthenticated } = useAuth()

  if (isAuthenticated && user) {
    return <DashboardShell />
  }

  return <LoginPage />
}

function LoginPage() {
  const { login } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if (!selectedRole) return
    const config = ROLE_CONFIG.find((r) => r.role === selectedRole)
    if (config) {
      login(selectedRole, config.userId)
    }
  }

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    const config = ROLE_CONFIG.find((r) => r.role === role)
    if (config) {
      setEmail(config.demoEmail)
      setPassword("demo123")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Decorative grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,.1)_1px,transparent_1px)] bg-[size:14px_14px]" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        {/* Header */}
        <div className="mb-12 text-center max-w-2xl">
          <div className="mb-6 flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">SMAS</h1>
          </div>
          <p className="text-base text-slate-400 mb-2">University Timetable Management System</p>
          <p className="text-sm text-slate-500">Select your role below to access the dashboard</p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-2xl border-slate-700 bg-slate-800/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl text-white text-center">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400 text-center">Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Role Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ROLE_CONFIG.map(({ role, label, description, icon: Icon, color }) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleSelect(role)}
                  className={`group relative overflow-hidden rounded-xl border-2 p-6 text-center transition-all duration-300 ${
                    selectedRole === role
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-700 bg-slate-700/20 hover:border-slate-600 hover:bg-slate-700/30"
                  }`}
                >
                  {/* Background gradient on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                  />

                  <div className="relative space-y-3">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${color} transition-transform duration-300 group-hover:scale-110 ${
                        selectedRole === role ? "scale-110" : ""
                      }`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-semibold transition-colors ${selectedRole === role ? "text-blue-400" : "text-slate-200"}`}>
                        {label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{description}</p>
                    </div>
                  </div>

                  {selectedRole === role && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </div>

            {/* Login Form */}
            {selectedRole && (
              <div className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 pt-4 border-t border-slate-700">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@greenfield.edu"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-11 rounded-lg transition-all duration-300 gap-2"
                  size="lg"
                  onClick={handleLogin}
                >
                  Sign in as {ROLE_CONFIG.find((r) => r.role === selectedRole)?.label}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-center text-xs text-slate-500">
                  Demo credentials are pre-filled • No real account needed
                </p>
              </div>
            )}

            {/* Footer info when no role selected */}
            {!selectedRole && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                {ROLE_CONFIG.map(({ role, label }) => (
                  <div key={role} className="text-center text-xs">
                    <p className="text-slate-400 font-medium">{label}</p>
                    <p className="text-slate-600">Demo available</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-600">
          <p>This is a demo environment for testing the University Timetable Management System</p>
        </div>
      </div>
    </div>
  )
}
