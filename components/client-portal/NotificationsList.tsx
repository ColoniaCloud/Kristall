'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { Notification } from '@/lib/client-portal/api'

export default function NotificationsList({ initial }: { initial: Notification[] }) {
  const [notifications, setNotifications] = useState(initial)
  const [markingId, setMarkingId] = useState<string | null>(null)

  const markAsRead = async (id: string) => {
    setMarkingId(id)
    try {
      const res = await fetch(`/api/portal/notifications/${id}/read`, { method: 'PATCH' })
      if (!res.ok) throw new Error()
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    } catch {
      toast.error('No pudimos marcar la notificación como leída')
    } finally {
      setMarkingId(null)
    }
  }

  if (notifications.length === 0) {
    return <p className="text-sm text-muted-foreground">No tenés notificaciones.</p>
  }

  return (
    <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {notifications.map((n) => (
        <li key={n.id} className="flex items-start justify-between gap-4 p-4">
          <div>
            <p className={n.read ? 'text-sm text-muted-foreground' : 'text-sm font-medium'}>{n.title}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
            {/* El CRM manda el destino ya armado — p. ej. la cuota vencida que
                originó el aviso, con el ancla puesta en la cuenta corriente.
                Solo se siguen rutas internas: el link viene del CRM, pero un
                `//otro-sitio` o un `javascript:` no tiene por qué salir de acá. */}
            {n.link?.startsWith('/') && !n.link.startsWith('//') && (
              <Link
                href={n.link}
                className="mt-1 inline-block text-sm font-medium text-primary underline"
              >
                Ver detalle
              </Link>
            )}
            <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString('es-AR')}</p>
          </div>
          {!n.read && (
            <Button
              variant="outline"
              size="sm"
              disabled={markingId === n.id}
              onClick={() => markAsRead(n.id)}
              className="shrink-0"
            >
              <Check className="size-3.5" />
              Marcar leída
            </Button>
          )}
        </li>
      ))}
    </ul>
  )
}
