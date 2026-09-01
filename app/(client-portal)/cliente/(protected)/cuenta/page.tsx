import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getAccount } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import AccountStatement from '@/components/client-portal/AccountStatement'

export const metadata: Metadata = { title: 'Cuenta corriente' }

export default async function CuentaPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const account = await loadPortalData(() => getAccount(session.contactId))

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Cuenta corriente</h1>
        <p className="text-sm text-muted-foreground">
          Tus compras, tus pagos y el saldo, movimiento por movimiento.
        </p>
      </div>
      <AccountStatement account={account} />
    </div>
  )
}
