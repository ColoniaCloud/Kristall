import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, CalendarClock } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { getContact, getAccount } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import StatCards from '@/components/client-portal/StatCards'
import PurchasesTable from '@/components/client-portal/PurchasesTable'
import { formatCurrency, formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const [contact, account] = await Promise.all([
    loadPortalData(() => getContact(session.contactId)),
    loadPortalData(() => getAccount(session.contactId)),
  ])

  const { overdueAmount, nextDueDate } = account.summary

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Hola, {contact.firstName}</h1>
        {/* `company` es null para los clientes sin razón social; sin esto el
            renglón quedaba vacío debajo del saludo. */}
        {contact.company && <p className="text-sm text-muted-foreground">{contact.company}</p>}
      </div>

      {/* Lo primero que tiene que ver es si hay algo vencido. */}
      {overdueAmount > 0 ? (
        <Link
          href="/cliente/cuenta"
          className="flex items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4 transition-colors hover:bg-destructive/15"
        >
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium">Tenés {formatCurrency(overdueAmount)} en cuotas vencidas</p>
            <p className="text-sm text-muted-foreground">Mirá el detalle en tu cuenta corriente.</p>
          </div>
        </Link>
      ) : (
        nextDueDate && (
          <Link
            href="/cliente/cuenta"
            className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
          >
            <CalendarClock className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Tu próxima cuota vence el {formatDate(nextDueDate)}</p>
              <p className="text-sm text-muted-foreground">Mirá el detalle en tu cuenta corriente.</p>
            </div>
          </Link>
        )
      )}

      <StatCards contact={contact} />

      <div>
        <h2 className="mb-3 text-lg font-medium">Compras recientes</h2>
        <PurchasesTable purchases={contact.purchases.slice(0, 5)} />
      </div>
    </div>
  )
}
