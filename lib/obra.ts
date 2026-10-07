/**
 * Los datos de una obra: lo que en arquitectura ocupa el lugar que en
 * automotriz ocupan el tipo de vehículo y la patente.
 *
 * Espejo de `crm-polarizados/src/lib/obra.ts`. Si agregás un tipo de vidrio
 * acá sin agregarlo allá, el CRM lo rechaza; al revés, el desplegable no lo
 * ofrece. Sin nada del servidor a propósito: lo importan componentes de
 * cliente (ver la nota de `client-portal/product-category.ts`).
 *
 * Los campos solo aplican si el producto del rollo es de arquitectura. Eso lo
 * decide el CRM, no el formulario: si se mandan para un rollo de auto, se
 * descartan.
 */

export type GlassType = 'SIMPLE' | 'DVH' | 'LAMINADO' | 'TEMPLADO' | 'OTRO'
export type FilmSide = 'INTERIOR' | 'EXTERIOR'
export type BuildingUse = 'RESIDENTIAL' | 'COMMERCIAL'

export const GLASS_TYPE_LABELS: Record<GlassType, string> = {
  SIMPLE: 'Vidrio simple',
  DVH: 'DVH (doble vidriado)',
  LAMINADO: 'Laminado',
  TEMPLADO: 'Templado',
  OTRO: 'Otro',
}
export const FILM_SIDE_LABELS: Record<FilmSide, string> = { INTERIOR: 'Interior', EXTERIOR: 'Exterior' }
export const BUILDING_USE_LABELS: Record<BuildingUse, string> = {
  RESIDENTIAL: 'Residencial',
  COMMERCIAL: 'Comercial',
}

export const GLASS_TYPES = Object.keys(GLASS_TYPE_LABELS) as GlassType[]
export const FILM_SIDES = Object.keys(FILM_SIDE_LABELS) as FilmSide[]
export const BUILDING_USES = Object.keys(BUILDING_USE_LABELS) as BuildingUse[]

/**
 * Los datos de obra, tal como los devuelve el CRM. `areaM2` es número en las
 * respuestas de garantía e instalaciones; en Mi Taller llega como string
 * (Decimal, ver `Money`), por eso se acepta de las dos formas.
 */
export interface DatosObra {
  /**
   * En la API pública de garantías llega **recortada** (sin altura, piso ni
   * unidad): ese endpoint lo puede leer cualquiera que tenga el link. Completa
   * solo en el portal del taller.
   */
  siteAddress: string | null
  areaM2: number | string | null
  paneCount: number | null
  glassType: GlassType | null
  filmSide: FilmSide | null
  buildingUse: BuildingUse | null
}

/** «12,5 m² · 6 paños», o null si no hay ninguno de los dos. */
export function describirSuperficie(
  areaM2: number | string | null | undefined,
  paneCount: number | null | undefined
): string | null {
  const partes: string[] = []
  const m2 = areaM2 == null || areaM2 === '' ? null : Number(areaM2)
  if (m2 != null && !Number.isNaN(m2)) partes.push(`${m2.toLocaleString('es-AR', { maximumFractionDigits: 2 })} m²`)
  if (paneCount != null) partes.push(`${paneCount} ${paneCount === 1 ? 'paño' : 'paños'}`)
  return partes.length ? partes.join(' · ') : null
}

/**
 * Las filas de la ficha de una obra, en el orden en que se leen. Solo lo que
 * tiene dato: una ficha de guiones es peor que ninguna.
 */
export function filasDeObra(o: Partial<DatosObra>): [string, string][] {
  const filas: [string, string][] = []
  if (o.siteAddress) filas.push(['Dirección de la obra', o.siteAddress])
  const superficie = describirSuperficie(o.areaM2, o.paneCount)
  if (superficie) filas.push(['Superficie', superficie])
  if (o.glassType) filas.push(['Vidrio', GLASS_TYPE_LABELS[o.glassType]])
  if (o.filmSide) filas.push(['Lámina del lado', FILM_SIDE_LABELS[o.filmSide]])
  if (o.buildingUse) filas.push(['Uso', BUILDING_USE_LABELS[o.buildingUse]])
  return filas
}

/** «12,5 m²» con coma decimal. */
export function formatM2(n: number): string {
  return `${n.toLocaleString('es-AR', { maximumFractionDigits: 2 })} m²`
}
