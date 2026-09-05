import { Home, Building2, Store, Building, HelpCircle, type LucideIcon } from 'lucide-react'

/**
 * El vocabulario de arquitectura: qué inmueble es y para qué quiere la lámina.
 *
 * Es el equivalente de `vehicle-types.ts` del otro lado del negocio. Un pedido
 * de automotriz se describe con «SUV, patente AB123CD»; uno de arquitectura con
 * «una casa, doce vidrios, control solar» — no hay forma de meter lo segundo en
 * los campos de lo primero sin que quede una ficha llena de guiones.
 *
 * **Los espejos son `crm-polarizados/src/lib/property-types.ts` y
 * `polarizar/lib/inmuebles.ts`.** El slug es lo que se guarda y lo que valida el
 * endpoint del CRM: si agregás una opción acá sin agregarla allá, el CRM la
 * rechaza.
 *
 * A diferencia de los vehículos, los íconos no son SVG propios sino de lucide:
 * un inmueble no tiene una silueta reconocible como la tiene un vehículo, y
 * dibujar cinco casas parecidas no ayudaría a elegir. Acá el texto manda y el
 * ícono solo ancla la vista.
 */
export interface PropertyType {
  slug: string
  label: string
  icon: LucideIcon
}

export const PROPERTY_TYPES: PropertyType[] = [
  { slug: 'CASA', label: 'Casa', icon: Home },
  { slug: 'OFICINA', label: 'Oficina', icon: Building2 },
  { slug: 'LOCAL', label: 'Local comercial', icon: Store },
  { slug: 'EDIFICIO', label: 'Edificio', icon: Building },
  { slug: 'OTRO', label: 'Otro', icon: HelpCircle },
]

/**
 * Para qué quiere la lámina.
 *
 * No es una curiosidad comercial: cambia qué producto se presupuesta. Una lámina
 * de seguridad y una decorativa no se parecen ni en función ni en precio, y
 * enterarse recién en la visita es un viaje perdido.
 */
export const PROPERTY_GOALS = [
  { slug: 'CONTROL_SOLAR', label: 'Control solar' },
  { slug: 'PRIVACIDAD', label: 'Privacidad' },
  { slug: 'SEGURIDAD', label: 'Seguridad' },
  { slug: 'DECORATIVO', label: 'Decorativo' },
]

export const TIME_WINDOWS = [
  { slug: 'MANANA', label: 'Por la mañana' },
  { slug: 'TARDE', label: 'Por la tarde' },
]

const POR_SLUG = new Map(PROPERTY_TYPES.map((p) => [p.slug, p]))

export function propertyType(slug: string | null | undefined): PropertyType | undefined {
  if (!slug) return undefined
  return POR_SLUG.get(slug)
}

/** La etiqueta, o el slug crudo si no lo conocemos. Nunca un hueco. */
export function propertyLabel(slug: string | null | undefined): string | null {
  if (!slug) return null
  return POR_SLUG.get(slug)?.label ?? slug
}

export function goalLabel(slug: string | null | undefined): string | null {
  if (!slug) return null
  return PROPERTY_GOALS.find((g) => g.slug === slug)?.label ?? slug
}

/** «por la mañana» / «por la tarde», en minúscula para meterlo en una frase. */
export function timeWindowLabel(slug: string | null | undefined): string | null {
  if (!slug) return null
  const t = TIME_WINDOWS.find((w) => w.slug === slug)
  return t ? t.label.toLowerCase() : slug
}
