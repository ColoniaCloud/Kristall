import type { Currency, Money, WorkshopAsset } from '@/lib/client-portal/workshop'

/**
 * Formateo para las pantallas del taller.
 *
 * Aparte de `lib/format.ts` porque aquel `formatCurrency` fuerza ARS, y las OT
 * tienen su propia moneda. Un precio en dólares mostrado con `$` argentino es
 * un error que nadie nota hasta que alguien cobra de menos.
 */

/** Los `Decimal` de Prisma llegan como string. Nunca asumir que ya es número. */
export function toNumber(v: Money | number | undefined): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export function formatMoney(v: Money | number | undefined, currency: Currency = 'ARS'): string {
  const n = toNumber(v)
  if (n === null) return '—'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  // Con año, aunque sea de dos cifras. Sin él, una orden del año pasado se lee
  // como si fuera de esta semana, y el ahorro son tres caracteres.
  //
  // hour12: false a propósito. Un taller escribe "16:00", no "04:00 p. m.", y
  // el am/pm además ocupa el doble de ancho en una fila apretada de teléfono.
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/**
 * Solo la fecha, con el año entero. Para vencimientos.
 *
 * Existe aparte porque un vencimiento a un año mostrado como "1/9, 19:39" se
 * lee como "vence hoy": el año es justamente el dato que importa, y la hora no
 * significa nada en una garantía.
 */
export function formatFecha(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

export function formatHora(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso))
}

/** `2026-09-03T14:00` — el formato que pide un `<input type="datetime-local">`. */
export function toDatetimeLocal(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

/** `YYYY-MM-DD` en hora local. `toISOString()` no sirve: convierte a UTC y a la
 *  madrugada te cambia el día. */
export function toDateInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

const TIPO_LABEL: Record<WorkshopAsset['type'], string> = {
  VEHICLE: 'Vehículo',
  WINDOW: 'Ventana',
  BUILDING: 'Edificio',
  OTHER: 'Otro',
}

/**
 * Cómo se nombra un vehículo en pantalla: "Toyota Corolla · AB 123 CD".
 *
 * Cae al tipo cuando no hay ni marca ni patente, para que nunca quede una
 * celda vacía — un renglón en blanco al lado de un turno se lee como un error
 * de la app, no como "faltan datos".
 */
export function describirAsset(asset: {
  type: WorkshopAsset['type']
  identifier: string | null
  brand: string | null
  model: string | null
} | null, rubro: RubroDelTaller = 'auto'): string {
  if (!asset) return `Sin ${PALABRAS_ACTIVO[rubro].singular}`
  const marca = [asset.brand, asset.model].filter(Boolean).join(' ')
  const partes = [marca, asset.identifier].filter(Boolean)
  return partes.length > 0 ? partes.join(' · ') : TIPO_LABEL[asset.type]
}

export { TIPO_LABEL }

/**
 * "1 orden" / "2 órdenes". Trivial, pero un "1 órdenes" en la pantalla que el
 * instalador mira todos los días es de esas cosas que hacen que un sistema se
 * sienta descuidado.
 */
export function plural(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`
}

/**
 * Cuánto cubre la garantía de una instalación, en las palabras del mostrador.
 *
 * El CRM la guarda en meses porque hay productos de 18; el instalador la dice
 * en años. Se muestran años cuando la cuenta es exacta y meses cuando no, en
 * vez de redondear: "1,5 años" no se lo dice nadie a un cliente.
 *
 * Los dos casos sin garantía se distinguen a propósito. Un producto sin
 * `warrantyConfig` nunca fue configurado —es la trampa del orden de O-6, y el
 * rollo no va a poder generar garantías—; uno con la config apagada es una
 * decisión tomada. Para el instalador el resultado es el mismo, pero para quien
 * tenga que arreglarlo no.
 */
export function formatGarantia(
  config: { installWarrantyMonths: number; warrantyEnabled: boolean } | null
): string {
  if (!config) return 'Sin configurar'
  if (!config.warrantyEnabled) return 'Sin garantía'
  const meses = config.installWarrantyMonths
  if (meses <= 0) return 'Sin garantía'
  if (meses % 12 === 0) return plural(meses / 12, 'año', 'años')
  return plural(meses, 'mes', 'meses')
}

// ─── Vehículo, obra o las dos ────────────────────────────────────────────────

/** Sobre qué trabaja el taller. Decide si la pantalla dice «vehículo» u «obra». */
export type RubroDelTaller = 'auto' | 'obra' | 'ambos'

/**
 * El rubro del taller, para nombrar las cosas.
 *
 * **Primero manda lo que compró**, después la configuración. Un taller que
 * nunca abrió la configuración de Mi Taller figura como automotriz por defecto
 * (`doesAutomotive` arranca en true en el CRM), y a uno que solo compra
 * láminas de arquitectura le aparecía «Vehículo» en el alta de una orden. Sus
 * rollos dicen la verdad sin que tenga que configurar nada. Sin stock, se usa
 * la configuración; sin configuración tampoco, automotriz, como siempre.
 */
export function rubroDelTaller(
  rolls: { product: { category: string } }[],
  settings?: { doesAutomotive: boolean; doesArchitectural: boolean } | null
): RubroDelTaller {
  const obra = rolls.some((r) => r.product.category === 'ARCHITECTURAL')
  const auto = rolls.some((r) => r.product.category !== 'ARCHITECTURAL')
  if (obra || auto) return obra && auto ? 'ambos' : obra ? 'obra' : 'auto'
  if (settings?.doesArchitectural) return settings.doesAutomotive ? 'ambos' : 'obra'
  return 'auto'
}

/** Las palabras de cada rubro. `Singular`/`Plural` con mayúscula, para títulos. */
export const PALABRAS_ACTIVO: Record<
  RubroDelTaller,
  { singular: string; plural: string; Singular: string; Plural: string; elegir: string; ninguno: string }
> = {
  auto: {
    singular: 'vehículo',
    plural: 'vehículos',
    Singular: 'Vehículo',
    Plural: 'Vehículos',
    elegir: 'Elegí un vehículo',
    ninguno: 'Este cliente no tiene vehículos cargados',
  },
  obra: {
    singular: 'obra',
    plural: 'obras',
    Singular: 'Obra',
    Plural: 'Obras',
    elegir: 'Elegí una obra',
    ninguno: 'Este cliente no tiene obras cargadas',
  },
  ambos: {
    singular: 'vehículo u obra',
    plural: 'vehículos y obras',
    Singular: 'Vehículo u obra',
    Plural: 'Vehículos y obras',
    elegir: 'Elegí un vehículo u obra',
    ninguno: 'Este cliente no tiene vehículos ni obras cargados',
  },
}
