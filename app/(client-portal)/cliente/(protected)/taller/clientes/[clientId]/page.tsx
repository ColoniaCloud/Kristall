import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Plus, Phone, Mail, Pencil } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getWorkshopClient, listWorkOrders } from '@/lib/client-portal/workshop'
import { CrmApiError } from '@/lib/crm/api'
import { Button } from '@/components/ui/button'
import WorkshopClientForm from '@/components/client-portal/taller/WorkshopClientForm'
import WorkshopAssetForm from '@/components/client-portal/taller/WorkshopAssetForm'
import WorkOrderStatusBadge from '@/components/client-portal/taller/WorkOrderStatusBadge'
import {
  describirAsset,
  formatDateTime,
  formatMoney,
  TIPO_LABEL,
  plural,
} from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Cliente' }

export default async function ClientePage({ params }: { params: Promise<{ clientId: string }> }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const { clientId } = await params
  const client = await loadPortalData(async () => {
    try {
      return await getWorkshopClient(session.contactId, clientId)
    } catch (err) {
      if (err instanceof CrmApiError && err.status === 404) notFound()
      throw err
    }
  })
  const orders = await loadPortalData(() => listWorkOrders(session.contactId, { clientId }))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/cliente/taller/clientes"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Mis clientes
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-heading text-2xl font-semibold">{client.name}</h1>
          <WorkshopClientForm
            client={client}
            trigger={
              <Button variant="outline" size="sm">
                <Pencil className="size-4" />
                Editar
              </Button>
            }
          />
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          {client.phone && (
            <a href={`tel:${client.phone}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Phone className="size-4" />
              {client.phone}
            </a>
          )}
          {client.email && (
            <a href={`mailto:${client.email}`} className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Mail className="size-4" />
              {client.email}
            </a>
          )}
        </div>
        {!client.email && (
          <p className="text-sm text-amber-700">
            Sin email no le vamos a poder mandar la garantía cuando termines un trabajo.
          </p>
        )}
        {client.notes && (
          <p className="whitespace-pre-line rounded-md bg-muted p-3 text-sm">{client.notes}</p>
        )}
      </div>

      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">Vehículos</h2>
          <WorkshopAssetForm
            clientId={client.id}
            trigger={
              <Button variant="outline" size="sm">
                <Plus className="size-4" />
                Agregar
              </Button>
            }
          />
        </div>
        {client.assets.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin vehículos cargados.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
            {client.assets.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card p-4">
                <span className="min-w-0 flex-1 basis-40 font-medium">{describirAsset(a)}</span>
                <span className="shrink-0 text-sm text-muted-foreground">{TIPO_LABEL[a.type]}</span>
                {a.year && (
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">{a.year}</span>
                )}
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {plural(a._count?.workOrders ?? 0, 'orden', 'órdenes')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Historial</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no le hiciste ningún trabajo.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/cliente/taller/ordenes/${o.id}`}
                  className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card p-4 transition-colors hover:bg-muted"
                >
                  <span className="w-12 shrink-0 font-semibold tabular-nums">#{o.orderNumber}</span>
                  <span className="min-w-0 flex-1 basis-40 truncate text-sm text-muted-foreground">
                    {describirAsset(o.asset)}
                  </span>
                  <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                    {o.finishedAt ? formatDateTime(o.finishedAt) : o.scheduledAt ? formatDateTime(o.scheduledAt) : '—'}
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
      </section>
    </div>
  )
}
