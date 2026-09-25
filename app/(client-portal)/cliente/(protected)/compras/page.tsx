import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getContact } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import PurchasesTable from '@/components/client-portal/PurchasesTable'
import PaymentsTable from '@/components/client-portal/PaymentsTable'
import PageHeader from '@/components/client-portal/PageHeader'
import { formatCurrency } from '@/lib/format'

export const metadata: Metadata = { title: 'Compras' }

export default async function ComprasPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const contact = await loadPortalData(() => getContact(session.contactId))

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Compras"
        description="Todo lo que le compraste a Kristall y los pagos que ya registramos."
        action={
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Saldo pendiente</p>
            <p className="text-lg font-semibold tabular-nums">{formatCurrency(contact.balance)}</p>
          </div>
        }
      />
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
