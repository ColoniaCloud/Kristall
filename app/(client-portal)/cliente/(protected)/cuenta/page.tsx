import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getAccount, getPaymentDeclarations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import AccountStatement from '@/components/client-portal/AccountStatement'
import RegisterPaymentDialog from '@/components/client-portal/RegisterPaymentDialog'

export const metadata: Metadata = { title: 'Cuenta corriente' }

export default async function CuentaPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const [account, declarations] = await Promise.all([
    loadPortalData(() => getAccount(session.contactId)),
    loadPortalData(() => getPaymentDeclarations(session.contactId)),
  ])
  const planesConSaldo = account.plans.filter((p) => p.status === 'ACTIVE')

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Cuenta corriente</h1>
          <p className="text-sm text-muted-foreground">
            Tus compras, tus pagos y el saldo, movimiento por movimiento.
          </p>
        </div>
        {planesConSaldo.length > 0 && <RegisterPaymentDialog plans={planesConSaldo} />}
      </div>
      <AccountStatement account={account} declarations={declarations} />
    </div>
  )
}
