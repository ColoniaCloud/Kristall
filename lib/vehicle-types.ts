/**
 * Tipos de vehículo, con su etiqueta y su icono.
 *
 * El slug es lo que se guarda en el CRM (`WarrantyInstallation.vehicleType`) y
 * lo que valida su endpoint; el archivo es el SVG que hay en
 * `public/iconos/vehiculos`. **Los tres tienen que moverse juntos**: sin slug
 * del lado del CRM la elección se rechaza, y sin archivo el desplegable dibuja
 * un hueco. La lista espejo vive en `crm-polarizados/src/lib/vehicle-types.ts`.
 *
 * El orden es el de la calle, no alfabético: primero lo que un polarizador ve
 * todos los días y al final lo raro, para que la elección habitual esté arriba
 * sin scrollear.
 */
export interface VehicleType {
  slug: string
  label: string
  icon: string
}

export const VEHICLE_TYPES: VehicleType[] = [
  { slug: 'SEDAN', label: 'Sedán', icon: '/iconos/vehiculos/Sedan.svg' },
  { slug: 'HATCHBACK', label: 'Hatchback', icon: '/iconos/vehiculos/Hatchback.svg' },
  { slug: 'SUV', label: 'SUV', icon: '/iconos/vehiculos/SUV.svg' },
  { slug: 'FURGON', label: 'Furgón', icon: '/iconos/vehiculos/Furgon.svg' },
  { slug: 'VAN_MINIBUS', label: 'Van / Minibús', icon: '/iconos/vehiculos/Van-Minibus.svg' },
  { slug: 'CAMION_CHICO', label: 'Camión chico', icon: '/iconos/vehiculos/Camion Chico.svg' },
  { slug: 'CAMION_GRANDE', label: 'Camión grande', icon: '/iconos/vehiculos/Camion Grande.svg' },
  { slug: 'COLECTIVO', label: 'Colectivo', icon: '/iconos/vehiculos/Colectivo.svg' },
  { slug: 'YATE_CHICO', label: 'Yate chico', icon: '/iconos/vehiculos/Yate Chico.svg' },
  { slug: 'YATE_GRANDE', label: 'Yate grande', icon: '/iconos/vehiculos/Yate Grande.svg' },
]

const POR_SLUG = new Map(VEHICLE_TYPES.map((v) => [v.slug, v]))

/** `undefined` si el slug no está en la lista — puede venir de una fila vieja. */
export function vehicleType(slug: string | null | undefined): VehicleType | undefined {
  return slug ? POR_SLUG.get(slug) : undefined
}

/** La etiqueta, o el slug crudo si no lo conocemos. Nunca un hueco. */
export function vehicleLabel(slug: string | null | undefined): string | null {
  if (!slug) return null
  return POR_SLUG.get(slug)?.label ?? slug
}
