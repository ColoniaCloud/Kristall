import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listBookings } from '@/lib/client-portal/workshop'
import BookingsInbox from '@/components/client-portal/taller/BookingsInbox'
import PageHeader from '@/components/client-portal/PageHeader'
import Recorrido from '@/components/client-portal/Recorrido'

export const metadata: Metadata = { title: 'Pedidos de turno' }

export default async function TurnosPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const bookings = await loadPortalData(() => listBookings(session.contactId))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Recorrido pantalla="turnos" activo={Boolean(session.demo)} />
      <PageHeader
        title="Pedidos de turno"
        description="Lo que te piden desde tu página pública. Confirmalos y se convierten en órdenes agendadas."
      />
      <BookingsInbox bookings={bookings} />
    </div>
  )
}
