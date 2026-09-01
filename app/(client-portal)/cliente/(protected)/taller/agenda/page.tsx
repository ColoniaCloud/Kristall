import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getAgenda } from '@/lib/client-portal/workshop'
import { Button } from '@/components/ui/button'
import WorkOrderStatusBadge from '@/components/client-portal/taller/WorkOrderStatusBadge'
import { formatHora, describirAsset, toDateInput } from '@/lib/client-portal/taller-format'

export const metadata: Metadata = { title: 'Agenda' }

/**
 * Agenda semanal.
 *
 * La semana se navega por URL (`?semana=YYYY-MM-DD`) y no con estado de
 * cliente: así el instalador puede compartir o marcar una semana concreta, y la
 * pantalla funciona sin JavaScript. Arrastrar para reagendar (que el plan
 * menciona) queda para cuando esto se use de verdad — reagendar con un toque en
 * un teléfono no es arrastrar.
 */
export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ semana?: string }>
}) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const { semana } = await searchParams
  const base = semana && !Number.isNaN(new Date(semana).getTime()) ? new Date(semana) : new Date()

  // Lunes de la semana que se está mirando. getDay() da 0 para domingo.
  const lunes = new Date(base)
  lunes.setHours(0, 0, 0, 0)
  lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7))
  const domingo = new Date(lunes)
  domingo.setDate(domingo.getDate() + 6)
  domingo.setHours(23, 59, 59, 999)

  const turnos = await loadPortalData(() =>
    getAgenda(session.contactId, lunes.toISOString(), domingo.toISOString())
  )

  const dias = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(d.getDate() + i)
    return d
  })

  const anterior = new Date(lunes)
  anterior.setDate(anterior.getDate() - 7)
  const siguiente = new Date(lunes)
  siguiente.setDate(siguiente.getDate() + 7)

  const hoyISO = toDateInput(new Date())

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold">Agenda</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="icon" aria-label="Semana anterior">
            <Link href={`/cliente/taller/agenda?semana=${toDateInput(anterior)}`}>
              <ChevronLeft className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/cliente/taller/agenda">Hoy</Link>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="Semana siguiente">
            <Link href={`/cliente/taller/agenda?semana=${toDateInput(siguiente)}`}>
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {dias.map((dia) => {
          const clave = toDateInput(dia)
          const delDia = turnos.filter((t) => toDateInput(new Date(t.scheduledAt)) === clave)
          const esHoy = clave === hoyISO
          return (
            <section
              key={clave}
              className={
                esHoy
                  ? 'overflow-hidden rounded-lg border-2 border-primary/40 bg-card'
                  : 'overflow-hidden rounded-lg border border-border bg-card'
              }
            >
              <header className="flex items-baseline justify-between border-b border-border px-4 py-2">
                <h2 className="font-medium capitalize">
                  {new Intl.DateTimeFormat('es-AR', { weekday: 'long', day: 'numeric', month: 'short' }).format(dia)}
                </h2>
                {esHoy && <span className="text-xs font-medium text-primary">Hoy</span>}
              </header>
              {delDia.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">Sin turnos</p>
              ) : (
                <ul className="divide-y divide-border">
                  {delDia.map((t) => (
                    <li key={t.id}>
                      <Link
                        href={`/cliente/taller/ordenes/${t.id}`}
                        className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <span className="w-12 shrink-0 font-semibold tabular-nums">
                          {formatHora(t.scheduledAt)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium">{t.workshopClient.name}</span>
                          <span className="block truncate text-sm text-muted-foreground">
                            {describirAsset(t.asset)}
                          </span>
                        </span>
                        <WorkOrderStatusBadge status={t.status} className="hidden shrink-0 sm:inline-flex" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
