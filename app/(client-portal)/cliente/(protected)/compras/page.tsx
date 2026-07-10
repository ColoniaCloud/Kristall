import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getContact } from '@/lib/client-portal/api'
import PurchasesTable from '@/components/client-portal/PurchasesTable'
import PaymentsTable from '@/components/client-portal/PaymentsTable'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = { title: 'Compras' }

export default async function ComprasPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const contact = await getContact(session.contactId)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Compras</h1>
        <p className="text-sm text-muted-foreground">
          Saldo pendiente: <span className="font-medium text-foreground">{formatCurrency(contact.balance)}</span>
        </p>
      </div>
      <div>
        <h2 className="mb-3 text-lg font-medium">Historial de compras</h2>
        <PurchasesTable purchases={contact.purchases} />
      </div>
      <div>
        <h2 className="mb-3 text-lg font-medium">Pagos registrados</h2>
        <PaymentsTable payments={contact.payments} />
      </div>
    </div>
  )
}
