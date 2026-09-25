import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getAccount, getPaymentDeclarations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import AccountStatement from '@/components/client-portal/AccountStatement'
import RegisterPaymentDialog from '@/components/client-portal/RegisterPaymentDialog'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'
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
    // pb en celular: deja lugar para la barra fija de abajo, que si no tapa el
    // último renglón de la tabla de pagos declarados.
    <div className="flex flex-col gap-8 pb-24 md:pb-0">
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

      {/* En celular el botón de la cabecera se va de pantalla apenas empezás a
          scrollear, y esta pantalla es larga: cuotas, movimientos y pagos
          declarados. La acción queda al alcance del pulgar todo el tiempo.
          Solo acá y solo cuando hay algo para pagar — no es navegación. */}
      {account.pendingSales.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <RegisterPaymentDialog
            pendingSales={account.pendingSales}
            trigger={
              <Button size="lg" className="h-12 w-full gap-2 text-base font-semibold">
                <Wallet className="size-5" />
                Registrar un pago
              </Button>
            }
          />
        </div>
      )}
    </div>
  )
}
