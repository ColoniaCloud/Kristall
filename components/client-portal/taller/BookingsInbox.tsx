'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, X, Phone, Mail, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDateTime, formatFecha, toDatetimeLocal } from '@/lib/client-portal/taller-format'
import { vehicleLabel } from '@/lib/vehicle-types'
import { propertyLabel, goalLabel, timeWindowLabel } from '@/lib/property-types'
import type { Booking } from '@/lib/client-portal/workshop'

/**
 * La bandeja de pedidos de turno.
 *
 * Un pedido **no es** una orden de trabajo: entró desde la página pública y
 * todavía no ocupa lugar en la agenda. Confirmarlo es lo que lo convierte en
 * orden agendada, con su cliente y su vehículo.
 *
 * Al confirmar se puede correr el horario. Es lo que pasa de verdad: el cliente
 * pide «el jueves a las 9» y el taller lo acomoda a las 10 sin llamar a nadie.
 * El pedido guarda lo que se pidió; la orden, lo que se acordó.
 */

const ETIQUETA: Record<Booking['status'], string> = {
  PENDIENTE: 'Sin responder',
  CONFIRMADA: 'Confirmado',
  RECHAZADA: 'Rechazado',
  CANCELADA: 'Lo canceló el cliente',
}

const COLOR: Record<Booking['status'], string> = {
  PENDIENTE: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  CONFIRMADA: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  RECHAZADA: 'bg-muted text-muted-foreground',
  CANCELADA: 'bg-muted text-muted-foreground',
}

/**
 * A wa.me le tenés que mandar el número con código de país, sin signos. El
 * formulario público solo pide "WhatsApp" pero la gente lo tipea como marca
 * (con 0 y 15 adelante, con espacios, con guiones): mismo criterio que
 * `normalizeWa` del lado del CRM (`src/lib/notifications.ts`).
 */
function numeroWa(raw: string): string {
  const d = raw.replace(/\D/g, '')
  if (!d) return d
  if (d.startsWith('54')) return d
  if (d.startsWith('0')) return '54' + d.slice(1)
  if (d.length <= 10) return '54' + d
  return d
}

/** Glifo oficial de WhatsApp — mismo path que `SocialIcons`/`WhatsAppFloatingButton`. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

export default function BookingsInbox({ bookings }: { bookings: Booking[] }) {
  const pendientes = bookings.filter((b) => b.status === 'PENDIENTE')
  const resueltos = bookings.filter((b) => b.status !== 'PENDIENTE')

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">
          Sin responder {pendientes.length > 0 && `(${pendientes.length})`}
        </h2>
        {pendientes.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No tenés pedidos esperando. Los que entren por tu página aparecen acá.
          </p>
        ) : (
          pendientes.map((b) => <Tarjeta key={b.id} booking={b} />)
        )}
      </section>

      {resueltos.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-lg font-semibold text-muted-foreground">
            Ya respondidos
          </h2>
          {resueltos.map((b) => (
            <Tarjeta key={b.id} booking={b} />
          ))}
        </section>
      )}
    </div>
  )
}

function Tarjeta({ booking: b }: { booking: Booking }) {
  const router = useRouter()
  const [cargando, setCargando] = useState<'confirmar' | 'rechazar' | null>(null)
  const [cuando, setCuando] = useState(toDatetimeLocal(b.preferredAt))
  const pendiente = b.status === 'PENDIENTE'
  const esArquitectura = b.category === 'ARCHITECTURAL'

  async function responder(accion: 'confirmar' | 'rechazar') {
    setCargando(accion)
    try {
      const res = await fetch(`/api/portal/workshop/bookings/${b.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accion,
          // Se manda con offset para que el CRM guarde el instante y no un texto.
          ...(accion === 'confirmar' && cuando
            ? { scheduledAt: new Date(cuando).toISOString() }
            : {}),
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos responder el pedido')
        return
      }
      toast.success(
        accion === 'confirmar'
          ? 'Turno confirmado. Ya está en tus órdenes.'
          : 'Pedido rechazado. Le avisamos al cliente.'
      )
      router.refresh()
    } catch {
      toast.error('Error de conexión. Probá de nuevo.')
    } finally {
      setCargando(null)
    }
  }

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium">{b.serviceName}</p>
          <p className="text-sm text-muted-foreground">
            {/* En arquitectura no se pidió una hora sino una franja, y la
                duración del servicio no es lo que dura una visita para medir.
                Mostrar «10:30 · 90 min» sería inventar un compromiso que el
                cliente nunca hizo. */}
            {esArquitectura && b.timeWindow
              ? `Pidió una visita el ${formatFecha(b.preferredAt)}, ${timeWindowLabel(b.timeWindow)}`
              : `Pidió ${formatDateTime(b.preferredAt)} · ${b.durationMinutes} min`}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${COLOR[b.status]}`}>
          {ETIQUETA[b.status]}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span className="font-medium">{b.clientName}</span>
        <a href={`tel:${b.clientPhone.replace(/\s/g, '')}`} className="inline-flex items-center gap-1 hover:underline">
          <Phone className="size-3.5" />
          {b.clientPhone}
        </a>
        {/* El formulario público pide específicamente el WhatsApp (no un
            teléfono cualquiera), así que siempre se puede armar este link:
            es la vía para que el taller le hable ante cualquier imprevisto. */}
        <a
          href={`https://wa.me/${numeroWa(b.clientPhone)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-2.5 py-1 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          <WhatsAppIcon className="size-3.5" />
          Chatear
        </a>
        {b.clientEmail && (
          <a href={`mailto:${b.clientEmail}`} className="inline-flex items-center gap-1 hover:underline">
            <Mail className="size-3.5" />
            {b.clientEmail}
          </a>
        )}
        {/* Cada rubro muestra lo suyo, mirando `category` y no si el campo está
            lleno: los campos del otro rubro llegan siempre en null, y decidir por
            ellos haría que un pedido incompleto se dibuje como si fuera del otro
            tipo. */}
        {esArquitectura ? (
          <>
            {propertyLabel(b.propertyType) && (
              <span className="text-muted-foreground">{propertyLabel(b.propertyType)}</span>
            )}
            {b.glassCount !== null && (
              <span className="text-muted-foreground">
                {b.glassCount} {b.glassCount === 1 ? 'vidrio' : 'vidrios'}
              </span>
            )}
            {b.approxM2 !== null && (
              <span className="text-muted-foreground tabular-nums">{Number(b.approxM2)} m²</span>
            )}
            {goalLabel(b.goal) && (
              <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                {goalLabel(b.goal)}
              </span>
            )}
          </>
        ) : (
          <>
            {vehicleLabel(b.vehicleType) && (
              <span className="text-muted-foreground">{vehicleLabel(b.vehicleType)}</span>
            )}
            {b.plate && <span className="font-medium tabular-nums">{b.plate}</span>}
          </>
        )}
        {/* Que ya tenga lamina cambia el trabajo: sacar la vieja puede duplicar
            el tiempo. Se destaca porque decide si el turno entra o no. */}
        {b.alreadyTinted === true && (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
            {esArquitectura ? 'Ya tiene lámina puesta' : 'Ya está polarizado'}
          </span>
        )}
      </div>

      {/* La dirección va en su propia línea y con ícono, no mezclada entre los
          datos de arriba: es lo único sin lo cual la visita no se puede hacer,
          y es lo que el instalador va a copiar al mapa. */}
      {esArquitectura && b.siteAddress && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.siteAddress)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-1.5 text-sm hover:underline"
        >
          <MapPin className="size-3.5 shrink-0 text-muted-foreground" />
          {b.siteAddress}
        </a>
      )}

      {b.photoMimeType && (
        // eslint-disable-next-line @next/next/no-img-element
        <a href={`/api/portal/workshop/bookings/${b.id}/foto`} target="_blank" rel="noreferrer">
          <img
            src={`/api/portal/workshop/bookings/${b.id}/foto`}
            alt={esArquitectura ? 'Foto que mandó el cliente' : 'Foto del vehículo que mandó el cliente'}
            className="h-40 w-full rounded-md border border-border object-cover sm:w-64"
          />
        </a>
      )}

      {b.notes && (
        <p className="rounded-md bg-muted/50 p-2.5 text-sm text-muted-foreground">{b.notes}</p>
      )}

      {pendiente && (
        <div
          data-tour="confirmar-turno"
          className="flex flex-wrap items-end gap-3 border-t border-border pt-3"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`cuando-${b.id}`} className="text-xs">
              Confirmar para
            </Label>
            <Input
              id={`cuando-${b.id}`}
              type="datetime-local"
              value={cuando}
              onChange={(e) => setCuando(e.target.value)}
              className="w-auto"
            />
          </div>
          <Button
            size="sm"
            disabled={cargando !== null}
            onClick={() => responder('confirmar')}
            className="bg-sky-500 text-white hover:bg-sky-600"
          >
            {cargando === 'confirmar' ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Check className="size-3.5" />
            )}
            Confirmar
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={cargando !== null}
            onClick={() => responder('rechazar')}
          >
            {cargando === 'rechazar' ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <X className="size-3.5" />
            )}
            Rechazar
          </Button>
        </div>
      )}
    </article>
  )
}
