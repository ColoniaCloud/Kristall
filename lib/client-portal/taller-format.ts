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
  // hour12: false a propósito. Un taller escribe "16:00", no "04:00 p. m.", y
  // el am/pm además ocupa el doble de ancho en una fila apretada de teléfono.
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
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
} | null): string {
  if (!asset) return 'Sin vehículo'
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
