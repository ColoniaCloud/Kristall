import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, CalendarClock } from 'lucide-react'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getContact, getAccount, getNotifications } from '@/lib/client-portal/api'
import { getWorkshopSummary } from '@/lib/client-portal/workshop'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listAds } from '@/lib/client-portal/ads'
import StatCards from '@/components/client-portal/StatCards'
import PurchasesTable from '@/components/client-portal/PurchasesTable'
import RegisterPaymentDialog from '@/components/client-portal/RegisterPaymentDialog'
import AdRotator from '@/components/client-portal/AdRotator'
import { formatCurrency, formatDate } from '@/lib/format'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const level = levelOf(session)

  const [contact, account, summary, notificaciones, adsDesktop, adsMobile] = await Promise.all([
    loadPortalData(() => getContact(session.contactId)),
    loadPortalData(() => getAccount(session.contactId)),
    // Solo INSTALLER tiene taller: a un BASIC el CRM le contestaría 403.
    level === 'INSTALLER' ? opcional(() => getWorkshopSummary(session.contactId)) : null,
    opcional(() => getNotifications(session.contactId)),
    listAds('desktop/dashboard'),
    listAds('mobile/dashboard'),
  ])

  const { overdueAmount, nextDueDate } = account.summary

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[3fr_1fr]">
      <div className="flex min-w-0 flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold">Hola, {contact.firstName}</h1>
            {/* `company` es null para los clientes sin razón social; sin esto el
                renglón quedaba vacío debajo del saludo. */}
            {contact.company && <p className="text-sm text-muted-foreground">{contact.company}</p>}
          </div>
          {account.pendingSales.length > 0 && <RegisterPaymentDialog pendingSales={account.pendingSales} />}
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
            /* Amarillo, un escalón por debajo del rojo de "vencido": esto es un
               aviso de algo que viene, no un problema que ya pasó. El fondo va
               semitransparente para que el color se lea sobre el panel oscuro
               sin convertirse en un bloque macizo. */
            <Link
              href="/cliente/cuenta"
              className="flex items-start gap-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-4 transition-colors hover:bg-amber-400/20"
            >
              <CalendarClock className="mt-0.5 size-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-medium text-amber-100">
                  Tu próxima cuota vence el {formatDate(nextDueDate)}
                </p>
                <p className="text-sm text-amber-200/70">Mirá el detalle en tu cuenta corriente.</p>
              </div>
            </Link>
          )
        )}

        <StatCards
          contact={contact}
          turnosHoy={summary ? summary.hoy.turnos : null}
          notificacionesSinLeer={
            notificaciones ? notificaciones.filter((n) => !n.read).length : null
          }
        />

        <div>
          <h2 className="mb-3 text-lg font-medium">Compras recientes</h2>
          <PurchasesTable purchases={contact.purchases.slice(0, 5)} />
        </div>
      </div>

      {/* Publicidad interna. Dos tandas distintas porque son dos piezas de
          diseño distintas: un rascacielos para la columna de escritorio y un
          bloque ancho para el pie del celular. Cada una se muestra en su ancho
          y nada más — nunca las dos a la vez. */}
      {adsDesktop.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-8">
            <AdRotator
              ads={adsDesktop}
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="max-h-[calc(100vh-7rem)]"
            />
          </div>
        </aside>
      )}

      {adsMobile.length > 0 && (
        <aside className="lg:hidden">
          <AdRotator ads={adsMobile} sizes="100vw" />
        </aside>
      )}
    </div>
  )
}

/**
 * Para los datos de adorno del dashboard: si el CRM no contesta, el card no se
 * dibuja y la pantalla sigue en pie.
 *
 * No pasa por `loadPortalData` a propósito. Aquel cierra la sesión ante un 403,
 * y un 403 del resumen del taller —un instalador al que todavía no le crearon
 * el taller, por ejemplo— no es motivo para echar a nadie del panel. El 403 que
 * sí importa, el de acceso revocado, lo levantan getContact y getAccount, que
 * siguen envueltos.
 */
async function opcional<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load()
  } catch (err) {
    console.error('[dashboard] dato opcional no disponible', err)
    return null
  }
}
