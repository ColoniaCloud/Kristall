'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
}

const POLL_INTERVAL_MS = 60_000

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/portal/notifications')
      if (!res.ok) return
      setNotifications(await res.json())
    } catch {
      // silencioso: si falla el polling no debe romper el resto del panel
    }
  }, [])

  useEffect(() => {
    // Fetch inicial + polling: la única forma de sincronizar con notificaciones
    // del CRM externo, que no ofrece push/websockets (ver WARRANTY_API.md).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNotifications()
    const interval = setInterval(fetchNotifications, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="crm-theme w-80">
        <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">Sin notificaciones</p>
        ) : (
          notifications.slice(0, 5).map((n) => (
            <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 whitespace-normal">
              <span className={n.read ? 'text-sm text-muted-foreground' : 'text-sm font-medium'}>{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.message}</span>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/cliente/notificaciones">Ver todas</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
