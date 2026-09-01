import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Phone, Car } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listWorkshopClients } from '@/lib/client-portal/workshop'
import { Button } from '@/components/ui/button'
import WorkshopClientForm from '@/components/client-portal/taller/WorkshopClientForm'
import { plural } from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Mis clientes' }

export default async function ClientesPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const clients = await loadPortalData(() => listWorkshopClients(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Mis clientes</h1>
        <WorkshopClientForm
          trigger={
            <Button>
              <Plus className="size-4" />
              Nuevo cliente
            </Button>
          }
        />
      </div>

      {clients.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="font-medium">Todavía no tenés clientes cargados</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Son los clientes de tu taller: los autos que entran, no los de Kristall.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border">
          {clients.map((c) => (
            <li key={c.id}>
              <Link
                href={`/cliente/taller/clientes/${c.id}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-card p-4 transition-colors hover:bg-muted"
              >
                <span className="min-w-0 flex-1 basis-40 font-medium">{c.name}</span>
                {c.phone && (
                  <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                    <Phone className="size-3.5" />
                    {c.phone}
                  </span>
                )}
                <span className="inline-flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
                  <Car className="size-3.5" />
                  {c._count?.assets ?? 0}
                </span>
                <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
                  {plural(c._count?.workOrders ?? 0, 'orden', 'órdenes')}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
