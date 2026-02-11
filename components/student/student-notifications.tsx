"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getNotificationsForUser } from "@/lib/data"
import type { Notification } from "@/lib/data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, CheckCircle2, Info, XCircle, Bell, CheckCheck } from "lucide-react"

const TYPE_CONFIG: Record<Notification["type"], { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "text-primary" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  success: { icon: CheckCircle2, className: "text-success" },
  error: { icon: XCircle, className: "text-destructive" },
}

export function StudentNotifications() {
  const { user } = useAuth()
  const rawNotifications = user ? getNotificationsForUser("student", user.id) : []
  const [notifications, setNotifications] = useState(rawNotifications)

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-sm text-muted-foreground">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllRead}>
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" />
            All Notifications
          </CardTitle>
          <CardDescription>{notifications.length} total notifications</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications.</p>
          ) : (
            <div className="space-y-2">
              {notifications
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((n) => {
                  const config = TYPE_CONFIG[n.type]
                  const Icon = config.icon
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => markRead(n.id)}
                      className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-colors hover:bg-accent/30 ${
                        n.read ? "border-border bg-card" : "border-primary/20 bg-primary/[0.03]"
                      }`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${config.className}`} />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          {!n.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{n.message}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {new Date(n.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs ${
                          n.type === "error" ? "border-destructive text-destructive" :
                          n.type === "warning" ? "border-warning text-warning" :
                          n.type === "success" ? "border-success text-success" :
                          "border-primary text-primary"
                        }`}
                      >
                        {n.type}
                      </Badge>
                    </button>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
