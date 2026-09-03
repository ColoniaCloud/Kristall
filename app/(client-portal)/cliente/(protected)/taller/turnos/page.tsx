import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listBookings } from '@/lib/client-portal/workshop'
import BookingsInbox from '@/components/client-portal/taller/BookingsInbox'

export const metadata: Metadata = { title: 'Pedidos de turno' }

export default async function TurnosPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const bookings = await loadPortalData(() => listBookings(session.contactId))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Pedidos de turno</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Lo que te piden desde tu página pública. Confirmalos y se convierten en órdenes
          agendadas.
        </p>
      </div>
      <BookingsInbox bookings={bookings} />
    </div>
  )
}
