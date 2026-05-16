export type ProductLocale = 'es' | 'en' | 'de'

export interface Product {
  id: string
  name_es: string
  name_en: string
  name_de: string
  sku: string
  slug: string
  category: string
  vlt: number | null
  uv: number | null
  irr: number | null
  inStock: boolean
  active: boolean
  description_es?: { root?: unknown } | null
  description_en?: { root?: unknown } | null
  description_de?: { root?: unknown } | null
  images?: Array<{
    image?: { url?: string; alt?: string } | null
    alt?: string
  }>
  specifications?: Array<{ key?: string; value?: string }>
  variants?: Array<{ name?: string; sku?: string; price?: number }>
  seo_title?: string | null
  seo_description?: string | null
}

export const CATEGORIES: Array<{ value: string; label: string; description: string }> = [
  {
    value: 'klar',
    label: 'KLAR',
    description: 'Línea premium de polarizado vehicular con alta transmitancia y bloqueo UV.',
  },
  {
    value: 'karbon',
    label: 'KARBÖN',
    description: 'Tecnología Nano Carbon para máximo rendimiento térmico sin interferencia de señal.',
  },
  {
    value: 'keramx',
    label: 'KERAMX',
    description: 'Nano Ceramic de alto rendimiento: 95% de rechazo infrarrojo con máxima durabilidad.',
  },
  {
    value: 'krypton',
    label: 'KRYPTON',
    description: 'Lámina de seguridad Nano Ceramic con retención de fragmentos en impacto.',
  },
  {
    value: 'ppf',
    label: 'PPF',
    description: 'Paint Protection Film de poliuretano termoplástico para protección invisible de pintura.',
  },
  {
    value: 'vitral',
    label: 'VITRAL',
    description: 'Láminas para arquitectura residencial y comercial. Próximamente disponible.',
  },
]

export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.label]),
)

export const CATEGORY_DESCRIPTION: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c.description]),
)
