import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import {
  listWorkshopClients,
  listWorkshopAssets,
  getWorkshopStock,
  type WorkshopAsset,
} from '@/lib/client-portal/workshop'
import WorkOrderForm from '@/components/client-portal/taller/WorkOrderForm'

export const metadata: Metadata = { title: 'Nueva orden' }

export default async function NuevaOrdenPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const [clients, rolls] = await Promise.all([
    loadPortalData(() => listWorkshopClients(session.contactId)),
    loadPortalData(() => getWorkshopStock(session.contactId)),
  ])

  // Los vehículos de todos los clientes, precargados. Son pocos por taller y
  // así el select de vehículo responde al instante al elegir el cliente, sin
  // una espera en el medio del alta. Si algún taller llega a tener cientos de
  // clientes, esto pasa a pedirse al cambiar el select.
  const listas = await Promise.all(
    clients.map((c) => loadPortalData(() => listWorkshopAssets(session.contactId, c.id)))
  )
  const assetsByClient: Record<string, WorkshopAsset[]> = {}
  clients.forEach((c, i) => {
    assetsByClient[c.id] = listas[i]
  })

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Nueva orden</h1>
      <WorkOrderForm clients={clients} assetsByClient={assetsByClient} rolls={rolls} />
    </div>
  )
}
