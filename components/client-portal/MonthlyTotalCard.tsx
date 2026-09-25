'use client'

import { useMemo, useState } from 'react'
import { CalendarSearch, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/format'
import { cn } from '@/lib/utils'
import {
  anioDe,
  claveMes,
  etiquetaMes,
  etiquetaMesCorto,
  sumarMeses,
  type MetricaMensual,
  type TotalMensual,
} from '@/lib/client-portal/account-months'

/** Cuántos meses ofrece el select sin abrir el histórico: este y los dos previos. */
const MESES_A_MANO = 3

/**
 * Un total de la cuenta corriente acotado a un mes.
 *
 * El total de toda la vida no le dice nada al Cliente —crece y nunca baja—;
 * lo que quiere saber es cuánto lleva este mes y cómo viene contra los
 * anteriores. El select resuelve la comparación de todos los días (este mes y
 * los dos previos) y el histórico, el resto.
 *
 * Los montos llegan ya calculados desde el servidor (`account-months.ts`):
 * acá no se hace ninguna cuenta de fechas, solo se elige cuál mostrar.
 */
export default function MonthlyTotalCard({
  label,
  metrica,
  totales,
  mesActual,
  tone,
}: {
  /** Sin el mes: la pantalla lo agrega sola cuando corresponde. */
  label: string
  metrica: MetricaMensual
  /** Todos los meses con movimiento, del más viejo al más nuevo. */
  totales: readonly TotalMensual[]
  /** El mes corriente, calculado en el servidor para no discutir de zonas horarias. */
  mesActual: string
  tone?: 'good'
}) {
  const [mes, setMes] = useState(mesActual)
  const [historicoAbierto, setHistoricoAbierto] = useState(false)

  const porMes = useMemo(() => new Map(totales.map((t) => [t.mes, t])), [totales])
  const montoDe = (clave: string) => porMes.get(clave)?.[metrica] ?? 0

  /**
   * Los tres meses de siempre, más el elegido si vino del histórico — sin eso,
   * el select mostraría un valor que no está entre sus opciones y Radix lo
   * dibujaría vacío.
   */
  const opciones = useMemo(() => {
    const recientes = Array.from({ length: MESES_A_MANO }, (_, i) => sumarMeses(mesActual, -i))
    return recientes.includes(mes) ? recientes : [mes, ...recientes]
  }, [mes, mesActual])

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">
        {label}
        {mes === mesActual && ' este mes'}
      </p>
      <p
        className={cn(
          'text-xl font-semibold tabular-nums',
          tone === 'good' && 'text-success'
        )}
      >
        {formatCurrency(montoDe(mes))}
      </p>

      <div className="mt-3 flex flex-col items-start gap-2">
        <Select value={mes} onValueChange={setMes}>
          <SelectTrigger size="sm" className="w-full" aria-label={`Mes de ${label}`}>
            <SelectValue />
          </SelectTrigger>
          {/* crm-theme acá también: el desplegable se portala fuera del panel
              y sin esto saldría con los colores del sitio público. */}
          <SelectContent className="crm-theme">
            {opciones.map((m) => (
              <SelectItem key={m} value={m}>
                {etiquetaMes(m)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setHistoricoAbierto(true)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-current"
        >
          <CalendarSearch className="size-3.5" />
          Consultar histórico
        </button>
      </div>

      <HistoricoDialog
        abierto={historicoAbierto}
        onOpenChange={setHistoricoAbierto}
        label={label}
        mesSeleccionado={mes}
        mesActual={mesActual}
        totales={totales}
        montoDe={montoDe}
        onElegir={(m) => {
          setMes(m)
          setHistoricoAbierto(false)
        }}
      />
    </div>
  )
}

/**
 * El calendario de meses.
 *
 * Muestra los doce meses de un año con su monto ya resuelto, en vez de pedir
 * que se elija uno a ciegas y recién ahí revelar el número: la comparación
 * entre meses es justo lo que alguien viene a buscar acá.
 */
function HistoricoDialog({
  abierto,
  onOpenChange,
  label,
  mesSeleccionado,
  mesActual,
  totales,
  montoDe,
  onElegir,
}: {
  abierto: boolean
  onOpenChange: (v: boolean) => void
  label: string
  mesSeleccionado: string
  mesActual: string
  totales: readonly TotalMensual[]
  montoDe: (mes: string) => number
  onElegir: (mes: string) => void
}) {
  return (
    <Dialog open={abierto} onOpenChange={onOpenChange}>
      <DialogContent className="crm-theme">
        <DialogHeader>
          <DialogTitle>{label} — histórico</DialogTitle>
          <DialogDescription>
            Elegí un mes para verlo en el card. Los meses sin movimientos van en cero.
          </DialogDescription>
        </DialogHeader>
        {/* El cuerpo va aparte y no acá adentro porque Radix desmonta el
            contenido al cerrar: así el año que se está mirando arranca de nuevo
            desde el mes elegido en cada apertura, en vez de quedar pegado al
            que tenía la primera vez. */}
        <CalendarioDeMeses
          mesSeleccionado={mesSeleccionado}
          mesActual={mesActual}
          totales={totales}
          montoDe={montoDe}
          onElegir={onElegir}
        />
      </DialogContent>
    </Dialog>
  )
}

function CalendarioDeMeses({
  mesSeleccionado,
  mesActual,
  totales,
  montoDe,
  onElegir,
}: {
  mesSeleccionado: string
  mesActual: string
  totales: readonly TotalMensual[]
  montoDe: (mes: string) => number
  onElegir: (mes: string) => void
}) {
  const [anio, setAnio] = useState(() => anioDe(mesSeleccionado))

  // El rango navegable: desde el primer movimiento de la cuenta hasta hoy. Más
  // atrás no hay nada que ver, y más adelante todavía no pasó.
  const primerAnio = totales.length > 0 ? anioDe(totales[0].mes) : anioDe(mesActual)
  const ultimoAnio = anioDe(mesActual)

  const meses = Array.from({ length: 12 }, (_, i) => claveMes(anio, i + 1))

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setAnio((a) => a - 1)}
          disabled={anio <= primerAnio}
          aria-label="Año anterior"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="text-base font-medium tabular-nums">{anio}</span>
        <button
          type="button"
          onClick={() => setAnio((a) => a + 1)}
          disabled={anio >= ultimoAnio}
          aria-label="Año siguiente"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {meses.map((m) => {
          // Un mes que todavía no llegó no se puede consultar.
          const futuro = m > mesActual
          const elegido = m === mesSeleccionado
          const monto = montoDe(m)

          return (
            <button
              key={m}
              type="button"
              disabled={futuro}
              onClick={() => onElegir(m)}
              className={cn(
                'flex flex-col items-start gap-0.5 rounded-lg border p-2.5 text-left transition-colors',
                'disabled:pointer-events-none disabled:opacity-30',
                elegido
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary/50 hover:bg-muted'
              )}
            >
              <span className="text-xs text-muted-foreground">{etiquetaMesCorto(m)}</span>
              <span
                className={cn(
                  'text-sm font-medium tabular-nums',
                  monto === 0 && 'text-muted-foreground'
                )}
              >
                {formatCurrency(monto)}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}
