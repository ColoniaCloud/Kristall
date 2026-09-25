import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getAccount, getPaymentDeclarations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import AccountStatement from '@/components/client-portal/AccountStatement'
import RegisterPaymentDialog from '@/components/client-portal/RegisterPaymentDialog'
import PageHeader from '@/components/client-portal/PageHeader'

export const metadata: Metadata = { title: 'Cuenta corriente' }

export default async function CuentaPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const [account, declarations] = await Promise.all([
    loadPortalData(() => getAccount(session.contactId)),
    loadPortalData(() => getPaymentDeclarations(session.contactId)),
  ])
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Cuenta corriente"
        description="Tus compras, tus pagos y el saldo, movimiento por movimiento."
        action={
          account.pendingSales.length > 0 ? (
            <RegisterPaymentDialog pendingSales={account.pendingSales} />
          ) : undefined
        }
      />
      <AccountStatement account={account} declarations={declarations} />
    </div>
  )
}
