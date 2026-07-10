import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getContact } from '@/lib/client-portal/api'
import StatCards from '@/components/client-portal/StatCards'
import PurchasesTable from '@/components/client-portal/PurchasesTable'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const contact = await getContact(session.contactId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Hola, {contact.firstName}</h1>
        <p className="text-sm text-muted-foreground">{contact.company}</p>
      </div>
      <StatCards contact={contact} />
      <div>
        <h2 className="mb-3 text-lg font-medium">Compras recientes</h2>
        <PurchasesTable purchases={contact.purchases.slice(0, 5)} />
      </div>
    </div>
  )
}
