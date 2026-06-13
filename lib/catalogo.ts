/**
 * Catálogo Kristall Film — fuente de verdad estática.
 *
 * Reemplaza a Payload para la exhibición de productos (la tienda online quedó
 * cancelada). Los datos provienen del catálogo PDF 2025
 * (/public/catalogo/kristall-catalogo-2025.pdf) y coinciden 1:1 con lo que
 * había cargado en la base.
 *
 * - Las DESCRIPCIONES por línea NO viven acá: se reutilizan a nivel de sección
 *   vía i18n (products.cat_*_desc) usando `descKey`.
 * - Las etiquetas de tier / garantía se traducen vía i18n (product_modal.*).
 */

export type LineSlug =
  | 'kaiser'
  | 'keramx'
  | 'karbon'
  | 'krypton'
  | 'klar'
  | 'klass'
  | 'ppf'
  | 'vitral'

export type TierKey =
  | 'estandar'
  | 'premium'
  | 'ultra'
  | 'seguridad'
  | 'proteccion'
  | 'arquitectura'

export interface SpecRow {
  /** Clave i18n bajo product_modal (ej. 'spec_thickness') */
  labelKey: string
  /** Valor universal (no se traduce): "7.5 mil", "1.52 × 15 m" */
  value: string
}

export interface LineMeta {
  slug: LineSlug
  /** Nombre de marca, ej. "KARBÖN" */
  name: string
  tier: TierKey
  /** Años de garantía. null = no aplica (VITRAL) */
  warrantyYears: number | null
  /** Término técnico de marca (no se traduce) */
  technology: string
  /** Foto de fondo de la card de lámina / modal (interior del vehículo). */
  image: string
  /** Foto "top" para la card de categoría del home (sin overlay fuerte). */
  heroImage: string
  /** Logo de la línea. */
  logo: string
  /** Clave i18n de la descripción de la línea (namespace products). */
  descKey: string
}

export interface Lamina {
  sku: string
  slug: string
  line: LineSlug
  /** Designación comercial, ej. "05", "50". null para PPF/VITRAL. */
  level: string | null
  /** Transmisión de luz visible (%). null = no aplica. */
  vlt: number | null
  /** Rechazo infrarrojo (%) — se muestra como "IR". */
  irr: number | null
  /** Bloqueo UV (%). */
  uv: number | null
  inStock: boolean
  /** Filas extra para productos sin VLT (PPF). */
  specRows?: SpecRow[]
}

/**
 * NOTA DE ASSETS: las fotos interiores definitivas viven en
 * /public/cat/interior/{slug}.jpg (una por línea, usadas de fondo bajo el
 * overlay de cada card). Los logos de línea en /public/cat/{NAME}.png.
 */
export const LINES: LineMeta[] = [
  {
    slug: 'kaiser',
    name: 'KAISER',
    tier: 'ultra',
    warrantyYears: 10,
    technology: 'Sputtering Ceramic',
    image: '/cat/interior/kaiser.jpg',
    heroImage: '/cat/top-KERAMX.jpg',
    logo: '/cat/KAISER.png',
    descKey: 'cat_kaiser_desc',
  },
  {
    slug: 'krypton',
    name: 'KRYPTON',
    tier: 'seguridad',
    warrantyYears: 10,
    technology: 'Security Nano Ceramic',
    image: '/cat/interior/krypton.jpg',
    heroImage: '/cat/top-KRYPTON.jpg',
    logo: '/cat/KRYPTON.png',
    descKey: 'cat_krypton_desc',
  },
  {
    slug: 'keramx',
    name: 'KERAMX',
    tier: 'premium',
    warrantyYears: 10,
    technology: 'Nano Ceramic',
    image: '/cat/interior/keramx.jpg',
    heroImage: '/cat/top-KERAMX.jpg',
    logo: '/cat/KERAMX.png',
    descKey: 'cat_keramx_desc',
  },
  {
    slug: 'karbon',
    name: 'KARBÖN',
    tier: 'premium',
    warrantyYears: 5,
    technology: 'Nano Carbon',
    image: '/cat/interior/karbon.jpg',
    heroImage: '/cat/top-KARBON.jpg',
    logo: '/cat/KARBON.png',
    descKey: 'cat_karbon_desc',
  },
  {
    slug: 'klar',
    name: 'KLAR',
    tier: 'estandar',
    warrantyYears: 3,
    technology: 'Estándar 2-ply',
    image: '/cat/interior/klar.jpg',
    heroImage: '/cat/top-KLAR.jpg',
    logo: '/cat/KLAR.png',
    descKey: 'cat_polarizado_desc',
  },
  {
    slug: 'klass',
    name: 'KLASS',
    tier: 'estandar',
    warrantyYears: 3,
    technology: 'Estándar 1-ply',
    image: '/cat/interior/klass.jpg',
    heroImage: '/cat/top-KLAR.jpg',
    logo: '/cat/KLASS.png',
    descKey: 'cat_klass_desc',
  },
  {
    slug: 'ppf',
    name: 'PPF',
    tier: 'proteccion',
    warrantyYears: 15,
    technology: 'TPU Self-healing',
    image: '/cat/interior/ppf.jpg',
    heroImage: '/cat/top-PPF.jpg',
    logo: '/cat/PPF.png',
    descKey: 'cat_ppf_desc',
  },
  {
    slug: 'vitral',
    name: 'VITRAL',
    tier: 'arquitectura',
    warrantyYears: null,
    technology: 'Arquitectura',
    image: '/cat/interior/vitral.jpg',
    heroImage: '/cat/top-VITRAL.jpg',
    logo: '/cat/VITRAL.png',
    descKey: 'cat_vitral_desc',
  },
]

export const LAMINAS: Lamina[] = [
  // ─── KAISER (Ultra · Sputtering Ceramic · 10 años) ───
  { sku: 'KSNC10', slug: 'ksnc10', line: 'kaiser', level: '10', vlt: 10, irr: 99, uv: 99, inStock: true },
  { sku: 'KSNC20', slug: 'ksnc20', line: 'kaiser', level: '20', vlt: 20, irr: 99, uv: 99, inStock: true },
  { sku: 'KSNC40', slug: 'ksnc40', line: 'kaiser', level: '40', vlt: 38, irr: 98, uv: 99, inStock: true },
  { sku: 'KSNC70', slug: 'ksnc70', line: 'kaiser', level: '70', vlt: 70, irr: 98, uv: 99, inStock: true },

  // ─── KERAMX (Premium · Nano Ceramic · 10 años) ───
  { sku: 'KNCE05', slug: 'knce05', line: 'keramx', level: '05', vlt: 5, irr: 95, uv: 99, inStock: true },
  { sku: 'KNCE15', slug: 'knce15', line: 'keramx', level: '15', vlt: 15, irr: 95, uv: 99, inStock: true },
  { sku: 'KNCE35', slug: 'knce35', line: 'keramx', level: '35', vlt: 35, irr: 95, uv: 99, inStock: true },
  { sku: 'KNCE50', slug: 'knce50', line: 'keramx', level: '50', vlt: 50, irr: 95, uv: 99, inStock: true },
  { sku: 'KNCE75', slug: 'knce75', line: 'keramx', level: '75', vlt: 75, irr: 95, uv: 99, inStock: true },

  // ─── KARBÖN (Premium · Nano Carbon · 5 años) ───
  { sku: 'KNCA05', slug: 'knca05', line: 'karbon', level: '05', vlt: 5, irr: 90, uv: 99, inStock: true },
  { sku: 'KNCA15', slug: 'knca15', line: 'karbon', level: '15', vlt: 15, irr: 90, uv: 99, inStock: true },
  { sku: 'KNCA35', slug: 'knca35', line: 'karbon', level: '35', vlt: 35, irr: 90, uv: 99, inStock: true },
  { sku: 'KNCA80', slug: 'knca80', line: 'karbon', level: '80', vlt: 80, irr: 80, uv: 99, inStock: true },

  // ─── KRYPTON (Seguridad · Security Nano Ceramic · 10 años) ───
  { sku: 'KS405', slug: 'ks405', line: 'krypton', level: '05', vlt: 5, irr: 95, uv: 99, inStock: true },
  { sku: 'KS415', slug: 'ks415', line: 'krypton', level: '15', vlt: 15, irr: 95, uv: 99, inStock: true },
  { sku: 'KS435', slug: 'ks435', line: 'krypton', level: '35', vlt: 35, irr: 95, uv: 99, inStock: true },
  { sku: 'KS450', slug: 'ks450', line: 'krypton', level: '50', vlt: 50, irr: 95, uv: 99, inStock: true },
  { sku: 'KS475', slug: 'ks475', line: 'krypton', level: '75', vlt: 71, irr: 95, uv: 99, inStock: true },

  // ─── KLAR (Estándar 2-ply · 3 años) ───
  { sku: 'KPRO05', slug: 'kpro05', line: 'klar', level: '05', vlt: 5, irr: 73, uv: 99, inStock: true },
  { sku: 'KPRO15', slug: 'kpro15', line: 'klar', level: '15', vlt: 15, irr: 58, uv: 92, inStock: true },
  { sku: 'KPRO30', slug: 'kpro30', line: 'klar', level: '30', vlt: 30, irr: 46, uv: 81, inStock: true },
  { sku: 'KPRO50', slug: 'kpro50', line: 'klar', level: '50', vlt: 46, irr: 20, uv: 56, inStock: true },

  // ─── KLASS (Estándar 1-ply · 3 años) ───
  { sku: 'KSTD05', slug: 'kstd05', line: 'klass', level: '05', vlt: 5, irr: 20, uv: 99, inStock: true },
  { sku: 'KSTD20', slug: 'kstd20', line: 'klass', level: '20', vlt: 20, irr: 20, uv: 92, inStock: true },
  { sku: 'KSTD35', slug: 'kstd35', line: 'klass', level: '35', vlt: 35, irr: 20, uv: 81, inStock: true },

  // ─── PPF (Protección · TPU Self-healing · 15 años) ───
  {
    sku: 'TPUKX',
    slug: 'tpukx',
    line: 'ppf',
    level: null,
    vlt: null,
    irr: null,
    uv: null,
    inStock: true,
    specRows: [
      { labelKey: 'spec_thickness', value: '7.5 mil' },
      { labelKey: 'spec_roll', value: '1.52 × 15 m' },
    ],
  },

  // ─── VITRAL (Arquitectura · próximamente) ───
  { sku: 'VITRAL01', slug: 'vitral01', line: 'vitral', level: null, vlt: null, irr: null, uv: null, inStock: false },
]

/** Orden de secciones en /productos (premium primero). */
export const LINE_ORDER: LineSlug[] = LINES.map((l) => l.slug)

const LINE_BY_SLUG: Record<string, LineMeta> = Object.fromEntries(
  LINES.map((l) => [l.slug, l]),
)

export const getLine = (slug: string): LineMeta | undefined => LINE_BY_SLUG[slug]

export const laminasByLine = (slug: string): Lamina[] =>
  LAMINAS.filter((l) => l.line === slug)

/** Una lámina representativa por línea (la primera = menor VLT). Para el home. */
export const representativeByLine = (slug: string): Lamina | undefined =>
  LAMINAS.find((l) => l.line === slug)

/** Nombre comercial de la lámina, ej. "KLAR 05". */
export const laminaName = (l: Lamina): string => {
  const line = getLine(l.line)
  const base = line?.name ?? l.line.toUpperCase()
  return l.level ? `${base} ${l.level}` : base
}

/**
 * Opacidad del overlay negro sobre la foto, derivada del VLT.
 * A menor VLT (más polarizado) → overlay más oscuro.
 * Rango acotado a [0.15, 0.85] para que la imagen siempre se lea.
 * Productos sin VLT (PPF/VITRAL) → overlay tenue fijo.
 */
export const overlayOpacity = (vlt: number | null): number => {
  if (vlt == null) return 0.35
  const raw = ((100 - vlt) / 100) * 0.9
  return Math.round(Math.min(0.85, Math.max(0.15, raw)) * 100) / 100
}
