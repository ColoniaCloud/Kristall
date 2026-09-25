import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AlertTriangle, CalendarClock, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getContact, getAccount, getNotifications } from '@/lib/client-portal/api'
import { getWorkshopSummary } from '@/lib/client-portal/workshop'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listAds } from '@/lib/client-portal/ads'
import StatCards from '@/components/client-portal/StatCards'
import PurchasesTable from '@/components/client-portal/PurchasesTable'
import RegisterPaymentDialog from '@/components/client-portal/RegisterPaymentDialog'
import PageHeader from '@/components/client-portal/PageHeader'
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
        {/* `company` es null para los clientes sin razón social — PageHeader
            omite el renglón en vez de dejarlo vacío debajo del saludo. */}
        <PageHeader
          title={`Hola, ${contact.firstName}`}
          description={contact.company}
          action={
            account.pendingSales.length > 0 ? (
              <RegisterPaymentDialog pendingSales={account.pendingSales} />
            ) : undefined
          }
        />

        {/* Lo primero que tiene que ver es si hay algo vencido.

            El aviso lleva la acción adentro, y no solo un link al detalle: el
            momento en que alguien piensa «tengo que pagar esto» es cuando lee
            cuánto debe, no cuando llega a la cabecera de otra pantalla. El
            botón de arriba sigue estando; este es la misma puerta abierta
            donde aparece la necesidad. */}
        {overdueAmount > 0 ? (
          <div className="flex flex-wrap items-start gap-3 rounded-lg border border-destructive/40 bg-destructive/10 p-4">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">Tenés {formatCurrency(overdueAmount)} en cuotas vencidas</p>
              <Link
                href="/cliente/cuenta"
                className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
              >
                Mirá el detalle en tu cuenta corriente
              </Link>
            </div>
            {account.pendingSales.length > 0 && (
              <RegisterPaymentDialog
                pendingSales={account.pendingSales}
                trigger={
                  <Button size="sm" className="shrink-0">
                    <Wallet className="size-4" />
                    Registrar un pago
                  </Button>
                }
              />
            )}
          </div>
        ) : (
          nextDueDate && (
            /* Amarillo, un escalón por debajo del rojo de "vencido": esto es un
               aviso de algo que viene, no un problema que ya pasó. El fondo va
               semitransparente para que el color se lea sobre el panel oscuro
               sin convertirse en un bloque macizo. */
            <div className="flex flex-wrap items-start gap-3 rounded-lg border border-warning/40 bg-warning/10 p-4">
              <CalendarClock className="mt-0.5 size-5 shrink-0 text-warning" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-warning">
                  Tu próxima cuota vence el {formatDate(nextDueDate)}
                </p>
                <Link
                  href="/cliente/cuenta"
                  className="text-sm text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
                >
                  Mirá el detalle en tu cuenta corriente
                </Link>
              </div>
              {account.pendingSales.length > 0 && (
                <RegisterPaymentDialog
                  pendingSales={account.pendingSales}
                  trigger={
                    <Button size="sm" className="shrink-0">
                      <Wallet className="size-4" />
                      Registrar un pago
                    </Button>
                  }
                />
              )}
            </div>
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
          <h2 className="mb-3 font-heading text-lg font-semibold">Compras recientes</h2>
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
