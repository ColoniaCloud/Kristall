import type { Producto } from '@/lib/catalogo'

/**
 * Precio de referencia por producto, publicado en la ficha y en el JSON-LD.
 *
 * Sale de la lista "Precios - Hoja 1" (KRISTALL GESTION), no de la planilla del
 * catálogo: su columna "Unidad" tiene otros valores y está a medio completar.
 * Si cambia la lista, se actualiza acá a mano.
 *
 * Google exige `offers` (o reseñas) en todo `Product`: un producto sin precio
 * acá no emite `Product` en el JSON-LD y en la página muestra "Próximamente en
 * stock" — ver `productJsonLd()` en lib/seo.ts.
 */
export const PRECIOS_VIGENTES_DESDE = '2026-10-14'

export interface Precio {
  ars: number
  usd: number
  /** Medida del rollo, tal como figura en la lista. */
  medida: string
}

const ROLLO_30 = '30 m × 1,52 m'
const ROLLO_15 = '15 m × 1,52 m'

const PRECIOS: Record<string, Precio> = {
  KLS05: { ars: 140000, usd: 90.44, medida: ROLLO_30 },
  KLS15: { ars: 140000, usd: 90.44, medida: ROLLO_30 },
  KRN05: { ars: 160000, usd: 103.36, medida: ROLLO_30 },
  KRN15: { ars: 160000, usd: 103.36, medida: ROLLO_30 },
  KRN50: { ars: 160000, usd: 103.36, medida: ROLLO_30 },
  KRE05: { ars: 270000, usd: 174.42, medida: ROLLO_30 },
  KRE15: { ars: 270000, usd: 174.42, medida: ROLLO_30 },
  KRB05: { ars: 360000, usd: 232.56, medida: ROLLO_30 },
  KRB15: { ars: 360000, usd: 232.56, medida: ROLLO_30 },
  KNCE05: { ars: 492000, usd: 317.83, medida: ROLLO_30 },
  KNCE15: { ars: 492000, usd: 317.83, medida: ROLLO_30 },
  'KS4-15': { ars: 624000, usd: 403.1, medida: ROLLO_30 },
  TPUKX: { ars: 1080000, usd: 697.67, medida: ROLLO_15 },
}

export function precioDe(p: Producto): Precio | null {
  return PRECIOS[p.codigo] ?? null
}

/** "$ 140.000" — siempre en formato argentino, la moneda es ARS en todos los idiomas. */
export function formatearArs(n: number): string {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
}
