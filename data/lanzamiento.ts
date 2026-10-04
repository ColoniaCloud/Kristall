/**
 * Lanzamiento Línea Automotriz — datos de /catalogo-propuesta.
 *
 * Copiado a mano de "Lista de precios — Línea Automotriz" (PDF del 29/09/2026).
 * No sale de `catalogo.json` a propósito: la planilla no tiene precios, y Kryon
 * todavía no está cargado ahí. Si cambia un precio o una ficha, se cambia acá
 * Y en el PDF — no hay nada que los sincronice (ver CATALOGO-PROPUESTA.md, D3).
 *
 * Precios finales por rollo (lo que paga el taller; no se les suma IVA).
 */

export type Categoria = 'standard' | 'premium'

export type Variante = {
  sku: string
  /** Transmisión de luz visible, en %. `null` en PPF (es transparente). */
  vlt: number | null
  /** Rechazo infrarrojo, en %. */
  ir: number | null
  /** Protección UV, en %. */
  uv: number | null
}

export type Linea = {
  slug: string
  nombre: string
  tecnologia: string
  categoria: Categoria
  descripcion: string
  espesor: string
  /** Medida del rollo en metros (ancho × largo). */
  rollo: { ancho: number; largo: number }
  garantiaAnios: number
  /** Precio final de lanzamiento por rollo, en pesos. */
  precio: number
  variantes: Variante[]
  foto: string
  logo: string
  /** Rasgos extra que no entran en la tabla (PPF). */
  rasgos?: string[]
}

/** Fin del día 1/12/2026 en Argentina. Pasada esta fecha la página oculta los precios. */
export const VIGENTE_HASTA = new Date('2026-12-01T23:59:59-03:00')

export const LINEAS: Linea[] = [
  {
    slug: 'klass',
    nombre: 'Klass',
    tecnologia: 'Dyed',
    categoria: 'standard',
    descripcion:
      'Control solar funcional y construcción de 1 ply para aplicaciones profesionales. Confiabilidad y rendimiento.',
    espesor: '1 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 3,
    precio: 140_000,
    variantes: [
      { sku: 'KLS05', vlt: 5, ir: 20, uv: 99 },
      { sku: 'KLS15', vlt: 15, ir: 20, uv: 92 },
    ],
    foto: '/Productos/destacadas/klass.png',
    logo: '/Productos/logo-linea/klass.svg',
  },
  {
    slug: 'kron',
    nombre: 'Kron',
    tecnologia: 'Dyed',
    categoria: 'standard',
    descripcion:
      'Excelente visibilidad y múltiples niveles de transmisión en construcción de 1 ply. Una solución versátil que equilibra confort, estética y claridad.',
    espesor: '1 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 3,
    precio: 160_000,
    variantes: [
      { sku: 'KRN05', vlt: 5, ir: 11, uv: 99 },
      { sku: 'KRN15', vlt: 15, ir: 11, uv: 99 },
      { sku: 'KRN50', vlt: 50, ir: 11, uv: 99 },
    ],
    foto: '/Productos/destacadas/kron.png',
    logo: '/Productos/logo-linea/kron.svg',
  },
  {
    slug: 'kryon',
    nombre: 'Kryon',
    tecnologia: 'Nanocarbon',
    categoria: 'standard',
    descripcion:
      'Tecnología nanocarbon con construcción de 2 ply y alto rechazo infrarrojo. Confort térmico y protección superior, respaldados por 5 años de garantía.',
    espesor: '2 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 5,
    precio: 312_000,
    variantes: [
      { sku: 'KRY05', vlt: 5, ir: 90, uv: 99 },
      { sku: 'KRY15', vlt: 15, ir: 90, uv: 90 },
      { sku: 'KRY80', vlt: 80, ir: 80, uv: 99 },
    ],
    foto: '/Productos/destacadas/kryon.png',
    logo: '/Productos/logo-linea/kryon.svg',
  },
  {
    slug: 'kore',
    nombre: 'Kore',
    tecnologia: 'Dyed + Sputtering',
    categoria: 'premium',
    descripcion:
      'Tecnología premium Dyed más Sputtering de 2 ply con alta calidad óptica y terminación superior. Diseñada para ofrecer claridad, protección UV y rendimiento duradero.',
    espesor: '2 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 5,
    precio: 270_000,
    variantes: [
      { sku: 'KRE05', vlt: 5, ir: 25, uv: 99 },
      { sku: 'KRE15', vlt: 15, ir: 23, uv: 99 },
    ],
    foto: '/Productos/destacadas/kore.png',
    logo: '/Productos/logo-linea/kore.svg',
  },
  {
    slug: 'karbon',
    nombre: 'Karbon',
    tecnologia: 'Nanocarbon',
    categoria: 'premium',
    descripcion:
      'Tecnología de nanocarbono que combina alto rechazo térmico con excelente claridad óptica. Confort superior y gran visibilidad, sin interferencias en señales electrónicas.',
    espesor: '2 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 10,
    precio: 360_000,
    variantes: [
      { sku: 'KRB05', vlt: 5, ir: 86, uv: 99 },
      { sku: 'KRB15', vlt: 15, ir: 73, uv: 99 },
    ],
    foto: '/Productos/destacadas/karbon.png',
    logo: '/Productos/logo-linea/karbon.svg',
  },
  {
    slug: 'keramx',
    nombre: 'KeramX',
    tecnologia: 'Nanoceramic',
    categoria: 'premium',
    descripcion:
      'Tecnología nanocerámica de alto rendimiento con 95% de rechazo infrarrojo y excepcional claridad óptica. Confort térmico superior y máxima protección.',
    espesor: '2 ply',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 10,
    precio: 492_000,
    variantes: [
      { sku: 'KNCE05', vlt: 5, ir: 95, uv: 99 },
      { sku: 'KNCE15', vlt: 15, ir: 95, uv: 99 },
    ],
    foto: '/Productos/destacadas/keramx.png',
    logo: '/Productos/logo-linea/keramx.svg',
  },
  {
    slug: 'krypton',
    nombre: 'Krypton',
    tecnologia: 'Nanoceramic · Seguridad',
    categoria: 'premium',
    descripcion:
      'Seguridad y tecnología nanocerámica en una sola lámina. Refuerza el vidrio, ayuda a retener fragmentos ante impactos y aporta protección térmica superior.',
    espesor: '4 mil',
    rollo: { ancho: 1.52, largo: 30 },
    garantiaAnios: 10,
    precio: 624_000,
    variantes: [{ sku: 'KS4-15', vlt: 15, ir: 95, uv: 99 }],
    foto: '/Productos/destacadas/krypton.png',
    logo: '/Productos/logo-linea/krypton.svg',
  },
  {
    slug: 'ppf',
    nombre: 'PPF',
    tecnologia: 'TPU Self-healing',
    categoria: 'premium',
    descripcion:
      'Protección transparente de alto rendimiento que preserva la pintura frente a impactos, rayones y agentes externos. Tecnología de autorreparación térmica para mantener el acabado impecable por más tiempo.',
    espesor: '7.5 mil',
    rollo: { ancho: 1.52, largo: 15 },
    garantiaAnios: 15,
    precio: 1_080_000,
    variantes: [{ sku: 'TPUKX', vlt: null, ir: null, uv: null }],
    foto: '/Productos/destacadas/ppf.png',
    logo: '/Productos/logo-linea/ppf.svg',
    rasgos: ['Autorreparación térmica', 'TPU transparente', 'Protección de pintura'],
  },
]

export function preciosVigentes(ahora = new Date()): boolean {
  return ahora.getTime() <= VIGENTE_HASTA.getTime()
}

/** Días enteros que faltan para el fin de la vigencia (0 el último día). */
export function diasRestantes(ahora = new Date()): number {
  return Math.max(0, Math.floor((VIGENTE_HASTA.getTime() - ahora.getTime()) / 86_400_000))
}

export function formatPrecio(n: number): string {
  // A mano y no con toLocaleString: el separador depende del ICU del runtime, y
  // si servidor y navegador difieren, React avisa de un mismatch de hidratación.
  return '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
