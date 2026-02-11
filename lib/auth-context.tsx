"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { Role } from "@/lib/data"

interface AuthUser {
  id: string
  name: string
  email: string
  role: Role
}

interface AuthContextType {
  user: AuthUser | null
  login: (role: Role, userId: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const DEMO_USERS: Record<string, AuthUser> = {
  "s-1": { id: "s-1", name: "Alex Johnson", email: "alex.j@student.greenfield.edu", role: "student" },
  "t-1": { id: "t-1", name: "Dr. Sarah Mitchell", email: "s.mitchell@greenfield.edu", role: "teacher" },
  "admin-1": { id: "admin-1", name: "Admin User", email: "admin@greenfield.edu", role: "admin" },
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = useCallback((role: Role, userId: string) => {
    const demoUser = DEMO_USERS[userId]
    if (demoUser) {
      setUser(demoUser)
    } else {
      setUser({ id: userId, name: "User", email: "user@greenfield.edu", role })
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
