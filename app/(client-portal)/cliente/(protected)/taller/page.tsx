import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CalendarClock, Wrench, Plus, Users, CalendarDays, ClipboardList, Settings, Inbox } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getWorkshopSummary, getAgenda, listBookings } from '@/lib/client-portal/workshop'
import { Button } from '@/components/ui/button'
import WorkOrderStatusBadge from '@/components/client-portal/taller/WorkOrderStatusBadge'
import { formatHora, formatMoney, describirAsset, toDateInput } from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Mi Taller' }

/**
 * La pantalla que el instalador abre a la mañana: qué hay hoy y qué está en el
 * taller ahora. Nada más — el resto está a un toque de distancia.
 */
export default async function TallerPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const hoy = new Date()
  const desde = new Date(hoy)
  desde.setHours(0, 0, 0, 0)
  const hasta = new Date(desde)
  hasta.setHours(23, 59, 59, 999)

  const [summary, agendaHoy, pedidosPendientes] = await Promise.all([
    loadPortalData(() => getWorkshopSummary(session.contactId)),
    loadPortalData(() => getAgenda(session.contactId, desde.toISOString(), hasta.toISOString())),
    // Solo los pendientes: acá interesa el contador, no la lista.
    loadPortalData(() => listBookings(session.contactId, true)),
  ])

  const enProceso = agendaHoy.filter((t) => t.status === 'EN_PROCESO')
  const pendientes = agendaHoy.filter((t) => t.status !== 'EN_PROCESO')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Mi Taller</h1>
        <Button asChild size="lg">
          <Link href="/cliente/taller/ordenes/nueva">
            <Plus className="size-5" />
            Nueva orden
          </Link>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tarjeta titulo="Turnos de hoy" valor={String(summary.hoy.turnos)} icono={CalendarClock} />
        <Tarjeta titulo="En el taller ahora" valor={String(summary.hoy.enProceso)} icono={Wrench} />
        <Tarjeta titulo="Terminadas este mes" valor={String(summary.periodo.terminadas)} icono={ClipboardList} />
        <Tarjeta
          titulo="Por cobrar del mes"
          valor={formatMoney(summary.periodo.porCobrar)}
          icono={Users}
        />
      </div>

      <Seccion titulo="En el taller ahora" vacio="No hay ningún trabajo en proceso.">
        {enProceso.map((t) => (
          <FilaTurno key={t.id} turno={t} />
        ))}
      </Seccion>

      <Seccion titulo="Turnos de hoy" vacio="No tenés turnos para hoy.">
        {pendientes.map((t) => (
          <FilaTurno key={t.id} turno={t} />
        ))}
      </Seccion>

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/cliente/taller/agenda">
            <CalendarDays className="size-4" />
            Ver la agenda
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cliente/taller/ordenes">
            <ClipboardList className="size-4" />
            Todas las órdenes
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cliente/taller/clientes">
            <Users className="size-4" />
            Mis clientes
          </Link>
        </Button>
        <Button asChild variant={pedidosPendientes.length > 0 ? 'default' : 'outline'}>
          <Link href="/cliente/taller/turnos">
            <Inbox className="size-4" />
            Pedidos de turno
            {/* El contador solo cuando hay algo esperando: un cero permanente
                deja de significar nada y se vuelve invisible. */}
            {pedidosPendientes.length > 0 && (
              <span className="ml-1 rounded-full bg-background/20 px-1.5 text-xs font-semibold">
                {pedidosPendientes.length}
              </span>
            )}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cliente/taller/configuracion">
            <Settings className="size-4" />
            Configuración
          </Link>
        </Button>
      </div>
    </div>
  )
}

function Tarjeta({
  titulo,
  valor,
  icono: Icono,
}: {
  titulo: string
  valor: string
  icono: typeof CalendarClock
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
      <Icono className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="truncate text-sm text-muted-foreground">{titulo}</p>
        <p className="text-xl font-semibold tabular-nums">{valor}</p>
      </div>
    </div>
  )
}

function Seccion({
  titulo,
  vacio,
  children,
}: {
  titulo: string
  vacio: string
  children: React.ReactNode[]
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-heading text-lg font-semibold">{titulo}</h2>
      {children.length === 0 ? (
        <p className="text-sm text-muted-foreground">{vacio}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
          {children}
        </ul>
      )}
    </section>
  )
}

function FilaTurno({
  turno,
}: {
  turno: {
    id: string
    orderNumber: number
    status: 'PRESUPUESTADA' | 'AGENDADA' | 'EN_PROCESO' | 'TERMINADA' | 'ENTREGADA' | 'CANCELADA'
    scheduledAt: string
    workshopClient: { name: string; phone: string | null }
    asset: { type: 'VEHICLE' | 'WINDOW' | 'BUILDING' | 'OTHER'; identifier: string | null; brand: string | null; model: string | null } | null
  }
}) {
  return (
    <li>
      <Link
        href={`/cliente/taller/ordenes/${turno.id}`}
        className="flex items-center gap-4 bg-card p-4 transition-colors hover:bg-muted"
      >
        <span className="w-14 shrink-0 text-lg font-semibold tabular-nums">
          {formatHora(turno.scheduledAt)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium">{turno.workshopClient.name}</span>
          <span className="block truncate text-sm text-muted-foreground">
            {describirAsset(turno.asset)}
          </span>
        </span>
        <WorkOrderStatusBadge status={turno.status} className="hidden shrink-0 sm:inline-flex" />
        <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
          #{turno.orderNumber}
        </span>
      </Link>
    </li>
  )
}
