export type CategorySlug = 'klar' | 'karbon' | 'keramx' | 'krypton' | 'ppf' | 'vitral'

export interface CategoryMeta {
  slug: CategorySlug
  name: string
  tagline: string
  description: string
  image: string
  logo: string
}

export const CATEGORIES: CategoryMeta[] = [
  {
    slug: 'klar',
    name: 'KLAR',
    tagline: 'Línea Premium',
    description: 'Láminas de la línea premium con máximo oscurecimiento y alto bloqueo UV. La elección clásica para polarizado vehicular profesional.',
    image: '/cat/top-KLAR.jpg',
    logo: '/cat/KLAR.png',
  },
  {
    slug: 'karbon',
    name: 'KARBÖN',
    tagline: 'Nano Carbon',
    description: 'Tecnología Nano Carbon con rechazo infrarrojo del 90%. Control térmico superior para el más exigente confort a bordo.',
    image: '/cat/top-KARBON.jpg',
    logo: '/cat/KARBON.png',
  },
  {
    slug: 'keramx',
    name: 'KERAMX',
    tagline: 'Nano Ceramic',
    description: 'La línea de mayor performance técnica. Tecnología Nano Ceramic con hasta 95% de rechazo infrarrojo y máxima claridad óptica.',
    image: '/cat/top-KERAMX.jpg',
    logo: '/cat/KERAMX.png',
  },
  {
    slug: 'krypton',
    name: 'KRYPTON',
    tagline: 'Seguridad Nano Ceramic',
    description: 'Láminas de seguridad con tecnología Nano Ceramic. Retención de fragmentos en impacto con máximo rendimiento térmico.',
    image: '/cat/top-KRYPTON.jpg',
    logo: '/cat/KRYPTON.png',
  },
  {
    slug: 'ppf',
    name: 'PPF',
    tagline: 'Paint Protection Film',
    description: 'Protección invisible de pintura contra impactos, rayones y agentes químicos. Film de poliuretano termoplástico de alta performance.',
    image: '/cat/top-PPF.jpg',
    logo: '/cat/PPF.png',
  },
  {
    slug: 'vitral',
    name: 'VITRAL',
    tagline: 'Arquitectura',
    description: 'Láminas para arquitectura y uso residencial/comercial. Control solar de precisión alemana para vidriados de alta gama.',
    image: '/cat/top-VITRAL.jpg',
    logo: '/cat/VITRAL.png',
  },
]

export const getCategoryMeta = (slug: string): CategoryMeta | undefined =>
  CATEGORIES.find(c => c.slug === slug)

export const getCategoryImage = (slug: string): string =>
  getCategoryMeta(slug)?.image ?? '/cat/top-KLAR.jpg'

export const getCategoryLogo = (slug: string): string =>
  getCategoryMeta(slug)?.logo ?? '/cat/KLAR.png'
