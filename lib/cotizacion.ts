/**
 * Cotización del dólar oficial (Banco Nación, punta vendedora) para mostrar el
 * equivalente en pesos de una lista en dólares.
 *
 * Fuente: dolarapi.com, que replica el oficial del BNA. Se pide desde el
 * servidor y Next la cachea una hora: el navegador nunca llama a la API.
 * Si la API no responde devuelve `null` y la página muestra solo los dólares —
 * mejor sin pesos que con un valor viejo que nadie avisó que lo es.
 */

const URL_DOLAR_OFICIAL = 'https://dolarapi.com/v1/dolares/oficial'

export type Cotizacion = {
  /** Pesos por dólar (venta). */
  venta: number
  /** Día de la cotización, ya formateado para mostrar ("4/11"). */
  fecha: string
}

export async function getCotizacionOficial(): Promise<Cotizacion | null> {
  try {
    const res = await fetch(URL_DOLAR_OFICIAL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    const json = (await res.json()) as { venta?: unknown; fechaActualizacion?: unknown }
    const venta = Number(json.venta)
    // Un valor absurdo (0, negativo, NaN) es una API rota, no una cotización.
    if (!Number.isFinite(venta) || venta <= 0) return null
    const actualizada = new Date(String(json.fechaActualizacion))
    const fecha = Number.isNaN(actualizada.getTime())
      ? new Date()
      : actualizada
    return {
      venta,
      fecha: fecha.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'numeric',
        timeZone: 'America/Argentina/Buenos_Aires',
      }),
    }
  } catch {
    return null
  }
}

/** `$211.950`. A mano por la misma razón que `formatPrecio`: el ICU del runtime puede diferir. */
export function formatPesos(n: number): string {
  return '$' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
