import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listWorkOrders, type WorkOrderStatus } from '@/lib/client-portal/workshop'
import { Button } from '@/components/ui/button'
import WorkOrderStatusBadge, { ESTADO_LABEL } from '@/components/client-portal/taller/WorkOrderStatusBadge'
import { formatMoney, formatDateTime, describirAsset } from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Órdenes' }

const ESTADOS: WorkOrderStatus[] = [
  'PRESUPUESTADA',
  'AGENDADA',
  'EN_PROCESO',
  'TERMINADA',
  'ENTREGADA',
  'CANCELADA',
]

/**
 * El filtro vive en la URL, no en estado de cliente: se puede compartir, volver
 * atrás con el botón del navegador y recargar sin perderlo. Y como el filtrado
 * lo hace el CRM, no hay que traerse las 300 órdenes para mostrar 4.
 */
export default async function OrdenesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const { status } = await searchParams
  const filtro = ESTADOS.includes(status as WorkOrderStatus) ? (status as WorkOrderStatus) : undefined

  const orders = await loadPortalData(() => listWorkOrders(session.contactId, { status: filtro }))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Órdenes</h1>
        <Button asChild>
          <Link href="/cliente/taller/ordenes/nueva">
            <Plus className="size-4" />
            Nueva orden
          </Link>
        </Button>
      </div>

      <nav className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
        <FiltroChip href="/cliente/taller/ordenes" activo={!filtro} label="Todas" />
        {ESTADOS.map((e) => (
          <FiltroChip
            key={e}
            href={`/cliente/taller/ordenes?status=${e}`}
            activo={filtro === e}
            label={ESTADO_LABEL[e]}
          />
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {filtro ? 'No hay órdenes en ese estado.' : 'Todavía no cargaste ninguna orden.'}
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/cliente/taller/ordenes/${o.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card p-4 transition-colors hover:bg-muted"
              >
                <span className="w-12 shrink-0 font-semibold tabular-nums">#{o.orderNumber}</span>
                <span className="min-w-0 flex-1 basis-48">
                  <span className="block truncate font-medium">{o.workshopClient.name}</span>
                  <span className="block truncate text-sm text-muted-foreground">
                    {describirAsset(o.asset)}
                  </span>
                </span>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {o.scheduledAt ? formatDateTime(o.scheduledAt) : 'Sin turno'}
                </span>
                <span className="shrink-0 text-sm font-medium tabular-nums">
                  {formatMoney(o.priceFinal ?? o.priceQuoted, o.currency)}
                </span>
                <WorkOrderStatusBadge status={o.status} className="shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function FiltroChip({ href, activo, label }: { href: string; activo: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={activo ? 'page' : undefined}
      className={
        activo
          ? 'rounded-full border border-primary bg-primary px-3 py-1 text-sm font-medium text-primary-foreground'
          : 'rounded-full border border-border bg-card px-3 py-1 text-sm transition-colors hover:bg-muted'
      }
    >
      {label}
    </Link>
  )
}
