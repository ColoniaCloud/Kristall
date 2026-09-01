import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft, Phone, ShieldCheck } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getWorkOrder } from '@/lib/client-portal/workshop'
import { CrmApiError } from '@/lib/crm/api'
import WorkOrderStatusBadge from '@/components/client-portal/taller/WorkOrderStatusBadge'
import WorkOrderActions from '@/components/client-portal/taller/WorkOrderActions'
import WorkOrderPaymentForm from '@/components/client-portal/taller/WorkOrderPaymentForm'
import {
  formatMoney,
  formatDateTime,
  describirAsset,
  toNumber,
} from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Orden de trabajo' }

/**
 * La ficha de trabajo. Es la pantalla que se usa parado al lado del auto: por
 * eso los botones de estado van arriba de todo y son grandes, y el detalle
 * queda debajo para quien tenga tiempo de leerlo.
 */
export default async function OrdenPage({ params }: { params: Promise<{ orderId: string }> }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const { orderId } = await params
  const order = await loadPortalData(async () => {
    try {
      return await getWorkOrder(session.contactId, orderId)
    } catch (err) {
      // El CRM devuelve 404 tanto si la orden no existe como si es de otro
      // taller, y acá se trata igual: la página de "no encontrada".
      if (err instanceof CrmApiError && err.status === 404) notFound()
      throw err
    }
  })

  const cobrado = order.payments.reduce((s, p) => s + (toNumber(p.amount) ?? 0), 0)
  const total = toNumber(order.priceFinal) ?? toNumber(order.priceQuoted)
  const saldo = total === null ? null : total - cobrado

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/cliente/taller/ordenes"
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Órdenes
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-semibold">Orden #{order.orderNumber}</h1>
          <WorkOrderStatusBadge status={order.status} />
        </div>
      </div>

      <WorkOrderActions order={order} />

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Cliente y vehículo</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link
            href={`/cliente/taller/clientes/${order.workshopClient.id}`}
            className="font-medium underline-offset-4 hover:underline"
          >
            {order.workshopClient.name}
          </Link>
          {order.workshopClient.phone && (
            <a
              href={`tel:${order.workshopClient.phone}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <Phone className="size-4" />
              {order.workshopClient.phone}
            </a>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{describirAsset(order.asset)}</p>
        {!order.asset && (
          <p className="text-sm text-amber-700">
            Falta cargar el vehículo. Lo vas a necesitar para poder terminar la orden.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Trabajo</h2>
        {order.items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin líneas cargadas.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-border">
            {order.items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 py-2">
                <span className="min-w-0 flex-1 basis-40 font-medium">{i.description}</span>
                {i.roll && (
                  <span className="text-sm text-muted-foreground">
                    {i.product?.name ?? 'Lámina'} · {i.roll.fullRollCode}
                  </span>
                )}
                {toNumber(i.squareMetersUsed) !== null && (
                  <span className="text-sm tabular-nums text-muted-foreground">
                    {toNumber(i.squareMetersUsed)} m²
                  </span>
                )}
                <span className="text-sm font-medium tabular-nums">
                  {formatMoney(i.price, order.currency)}
                </span>
              </li>
            ))}
          </ul>
        )}
        {order.notes && (
          <p className="whitespace-pre-line rounded-md bg-muted p-3 text-sm">{order.notes}</p>
        )}
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-heading text-lg font-semibold">Cobros</h2>
          {order.status !== 'CANCELADA' && (
            <WorkOrderPaymentForm orderId={order.id} currency={order.currency} />
          )}
        </div>

        <dl className="grid grid-cols-3 gap-3 text-center">
          <Dato label="Presupuestado" valor={formatMoney(order.priceQuoted, order.currency)} />
          <Dato label="Final" valor={formatMoney(order.priceFinal, order.currency)} />
          <Dato
            label="Saldo"
            valor={saldo === null ? '—' : formatMoney(saldo, order.currency)}
            destacar={saldo !== null && saldo > 0}
          />
        </dl>

        {order.payments.length > 0 && (
          <ul className="flex flex-col divide-y divide-border text-sm">
            {order.payments.map((p) => (
              <li key={p.id} className="flex items-baseline justify-between gap-4 py-2">
                <span className="text-muted-foreground">
                  {formatDateTime(p.paidAt)}
                  {p.method ? ` · ${p.method}` : ''}
                </span>
                <span className="font-medium tabular-nums">{formatMoney(p.amount, p.currency)}</span>
              </li>
            ))}
          </ul>
        )}

        <p className="text-xs text-muted-foreground">
          Estos son los cobros de tu cliente. No tienen relación con tu cuenta corriente con
          Kristall.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Garantía</h2>
        {order.warrantyInstallation ? (
          <p className="inline-flex items-center gap-2 text-sm">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span className="font-medium">{order.warrantyInstallation.installationCode}</span>
            <span className="text-muted-foreground">
              {order.warrantyInstallation.expiresAt
                ? `vence el ${formatDateTime(order.warrantyInstallation.expiresAt)}`
                : ''}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Todavía no se generó la garantía de este trabajo.
          </p>
        )}
      </section>

      <p className="text-xs text-muted-foreground">
        Creada el {formatDateTime(order.createdAt)}
        {order.startedAt ? ` · empezada el ${formatDateTime(order.startedAt)}` : ''}
        {order.finishedAt ? ` · terminada el ${formatDateTime(order.finishedAt)}` : ''}
        {order.deliveredAt ? ` · entregada el ${formatDateTime(order.deliveredAt)}` : ''}
      </p>
    </div>
  )
}

function Dato({ label, valor, destacar }: { label: string; valor: string; destacar?: boolean }) {
  return (
    <div className="rounded-md bg-muted p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={destacar ? 'font-semibold tabular-nums text-amber-700' : 'font-semibold tabular-nums'}>
        {valor}
      </dd>
    </div>
  )
}
