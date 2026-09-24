import type { AccountEntry } from './api'

/**
 * Los totales de la cuenta corriente, agrupados mes a mes.
 *
 * ─── Por qué el corte de mes va en hora argentina ──────────────────────────
 *
 * Un pago del 31 a las 22:00 es de ese mes para quien lo hizo; en UTC caería
 * en el siguiente. Es además la misma zona con la que `formatDate` dibuja la
 * tabla de movimientos, así que el renglón y el total del mes coinciden.
 *
 * ─── Por qué se calcula en el servidor ─────────────────────────────────────
 *
 * El resultado viaja ya resuelto al componente cliente. Si cada lado lo
 * calculara por su cuenta, el servidor (UTC en Hostinger) y el navegador
 * podrían caer en meses distintos y React marcaría un error de hidratación.
 */

const ZONA = 'America/Argentina/Buenos_Aires'

/** `en-CA` formatea 'YYYY-MM', que es justo la clave ordenable que queremos. */
const CLAVE_MES = new Intl.DateTimeFormat('en-CA', {
  timeZone: ZONA,
  year: 'numeric',
  month: '2-digit',
})

const NOMBRE_LARGO = new Intl.DateTimeFormat('es-AR', { month: 'long', timeZone: 'UTC' })
const NOMBRE_CORTO = new Intl.DateTimeFormat('es-AR', { month: 'short', timeZone: 'UTC' })

export interface TotalMensual {
  /** Clave ordenable, 'YYYY-MM'. */
  mes: string
  /** Lo comprado: los débitos del mes (ventas, y ajustes que van en contra). */
  comprado: number
  /** Lo pagado: los créditos del mes. */
  pagado: number
}

/** Qué mide cada card. Las claves son las de `TotalMensual`, a propósito. */
export type MetricaMensual = 'comprado' | 'pagado'

/** El mes al que pertenece un movimiento, en hora argentina. */
export function mesDe(iso: string): string {
  return CLAVE_MES.format(new Date(iso))
}

/** El mes corriente según el reloj de Argentina. */
export function mesActual(): string {
  return CLAVE_MES.format(new Date())
}

/** Los totales mes a mes, del más viejo al más nuevo. Los meses sin un solo
 *  movimiento no aparecen: quien los consulte recibe cero, que es lo cierto. */
export function totalesPorMes(entries: readonly AccountEntry[]): TotalMensual[] {
  const porMes = new Map<string, TotalMensual>()

  for (const e of entries) {
    const mes = mesDe(e.date)
    const acumulado = porMes.get(mes) ?? { mes, comprado: 0, pagado: 0 }
    acumulado.comprado += e.debit
    acumulado.pagado += e.credit
    porMes.set(mes, acumulado)
  }

  return [...porMes.values()]
    .map((t) => ({ mes: t.mes, comprado: redondear(t.comprado), pagado: redondear(t.pagado) }))
    .sort((a, b) => a.mes.localeCompare(b.mes))
}

/** Corre un mes hacia adelante o hacia atrás. `sumarMeses('2026-01', -1)` → '2025-12'. */
export function sumarMeses(mes: string, delta: number): string {
  const [anio, numero] = mes.split('-').map(Number)
  const d = new Date(Date.UTC(anio, numero - 1 + delta, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/** El año de un mes, como número. */
export function anioDe(mes: string): number {
  return Number(mes.slice(0, 4))
}

/** Arma la clave de un mes a partir del año y el número de mes (1–12). */
export function claveMes(anio: number, numero: number): string {
  return `${anio}-${String(numero).padStart(2, '0')}`
}

/** 'YYYY-MM' → 'Septiembre 2026'. */
export function etiquetaMes(mes: string): string {
  return `${capitalizar(NOMBRE_LARGO.format(primerDia(mes)))} ${anioDe(mes)}`
}

/** 'YYYY-MM' → 'Sep'. Para la grilla del histórico, donde no entra el nombre entero. */
export function etiquetaMesCorto(mes: string): string {
  // Varios locales devuelven "sept." con punto; en una grilla apretada sobra.
  return capitalizar(NOMBRE_CORTO.format(primerDia(mes)).replace(/\.$/, ''))
}

function primerDia(mes: string): Date {
  const [anio, numero] = mes.split('-').map(Number)
  return new Date(Date.UTC(anio, numero - 1, 1))
}

function capitalizar(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Los centavos sueltos que deja sumar floats no son plata; el CRM redondea igual. */
function redondear(n: number): number {
  return Math.round(n * 100) / 100
}
