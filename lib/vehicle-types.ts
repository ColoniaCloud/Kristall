/**
 * Tipos de vehículo, con su etiqueta y su icono.
 *
 * El slug es lo que se guarda en el CRM (`WarrantyInstallation.vehicleType`,
 * `WorkshopBooking.vehicleType`) y lo que valida su endpoint; el archivo es el
 * SVG de `public/iconos/vehiculos`. **Los tres tienen que moverse juntos**: sin
 * slug del lado del CRM la elección se rechaza, y sin archivo el desplegable
 * dibuja un hueco. Los espejos son `crm-polarizados/src/lib/vehicle-types.ts` y
 * `polarizar/lib/vehiculos.ts`.
 *
 * El orden es el de la calle, no alfabético: primero lo que un polarizador ve
 * todos los días y al final lo raro.
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
  { slug: 'PICKUP', label: 'Pickup', icon: '/iconos/vehiculos/Pickup.svg' },
  { slug: 'FURGON', label: 'Furgón', icon: '/iconos/vehiculos/Furgon.svg' },
  { slug: 'VAN_MINIBUS', label: 'Van / Minibús', icon: '/iconos/vehiculos/Van-Minibus.svg' },
  { slug: 'CAMION', label: 'Camión', icon: '/iconos/vehiculos/Camion Grande.svg' },
  { slug: 'COLECTIVO', label: 'Colectivo', icon: '/iconos/vehiculos/Colectivo.svg' },
  { slug: 'EMBARCACION', label: 'Yate / Embarcación', icon: '/iconos/vehiculos/Yate Grande.svg' },
]

/**
 * Slugs que ya no se ofrecen pero pueden estar guardados.
 *
 * Camión chico/grande y yate chico/grande se unificaron: la distinción no le
 * servía a nadie y obligaba a elegir entre dos dibujos casi iguales. **Las filas
 * viejas no se reescriben**, así que se traducen al mostrarlas — si no, un
 * pedido de hace un mes mostraría `CAMION_GRANDE` crudo.
 */
const LEGACY: Record<string, string> = {
  CAMION_CHICO: 'CAMION',
  CAMION_GRANDE: 'CAMION',
  YATE_CHICO: 'EMBARCACION',
  YATE_GRANDE: 'EMBARCACION',
}

const POR_SLUG = new Map(VEHICLE_TYPES.map((v) => [v.slug, v]))

/** `undefined` si el slug no está en la lista ni entre los viejos. */
export function vehicleType(slug: string | null | undefined): VehicleType | undefined {
  if (!slug) return undefined
  return POR_SLUG.get(LEGACY[slug] ?? slug)
}

/** La etiqueta, o el slug crudo si no lo conocemos. Nunca un hueco. */
export function vehicleLabel(slug: string | null | undefined): string | null {
  if (!slug) return null
  return vehicleType(slug)?.label ?? slug
}
