export type CategorySlug = 'klass' | 'klar' | 'karbon' | 'keramx' | 'krypton' | 'kaiser' | 'ppf' | 'vitral'

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
    slug: 'klass',
    name: 'KLASS',
    tagline: 'Línea Estándar · 3 años de garantía',
    description: 'Klass es la línea estándar de Kristall. Ofrece un acabado Charcoal Black con construcción de 1 ply y 3 años de garantía. Disponible en múltiples niveles de transmisión de luz para cubrir las necesidades de estética vehicular.',
    image: '/cat/top-KLAR.jpg',
    logo: '/cat/KLASS.png',
  },
  {
    slug: 'klar',
    name: 'KLAR',
    tagline: 'Línea Estándar · 3 años de garantía',
    description: 'Klar presenta una construcción de 2 ply y ofrece una lámina con acabado consistente, con hasta un 99% de bloqueo UV y 3 años de garantía contra decoloración y burbujeo. Disponible en múltiples niveles de transmisión de luz, cubriendo la mayor parte de la demanda de estética vehicular.',
    image: '/cat/top-KLAR.jpg',
    logo: '/cat/KLAR.png',
  },
  {
    slug: 'karbon',
    name: 'KARBÖN',
    tagline: 'Nano Carbon · 5 años de garantía',
    description: 'KARBÖN es una línea premium con tecnología Nanocarbon, un producto de alto rendimiento térmico sin resignar estética, con construcción de 2 ply. Su estructura de carbono activo alcanza un 90% de rechazo infrarrojo y 99% de bloqueo UV, con 5 años de garantía.',
    image: '/cat/top-KARBON.jpg',
    logo: '/cat/KARBON.png',
  },
  {
    slug: 'keramx',
    name: 'KERAMX',
    tagline: 'Nano Ceramic · 10 años de garantía',
    description: 'Desarrollada con tecnología Nanoceramic y construcción de 2 ply, esta línea de la familia premium alcanza el 95% de rechazo infrarrojo y 99% de bloqueo UV, con 10 años de garantía. Su claridad óptica superior la posiciona como la opción de mayor valor para clientes que priorizan rendimiento.',
    image: '/cat/top-KERAMX.jpg',
    logo: '/cat/KERAMX.png',
  },
  {
    slug: 'krypton',
    name: 'KRYPTON',
    tagline: 'Security Film · 10 años de garantía',
    description: 'KRYPTON combina la tecnología Nano Ceramic de KERAMX con propiedades de seguridad estructural y construcción de 4 ply. Certificada para retención de fragmentos en caso de impacto, es la referencia indicada para clientes que requieren protección adicional sin sacrificar control solar.',
    image: '/cat/top-KRYPTON.jpg',
    logo: '/cat/KRYPTON.png',
  },
  {
    slug: 'kaiser',
    name: 'KAISER',
    tagline: 'Ultra Quality Film · 10 años de garantía',
    description: 'KAISER representa el techo técnico de nuestra marca. Desarrollada con tecnología Sputtering Ceramic y construcción de 2 ply, ofrece un nivel superior de claridad óptica y hasta un 99% de rechazo infrarrojo y 99% de bloqueo UV, respaldado con 10 años de garantía.',
    image: '/cat/top-KERAMX.jpg',
    logo: '/cat/KAISER.png',
  },
  {
    slug: 'ppf',
    name: 'PPF',
    tagline: 'Protección transparente para pintura · 15 años de garantía',
    description: 'El PPF de Kristall es un film de poliuretano termoplástico de alta performance diseñado para la protección de pintura en instalaciones automotrices profesionales. Invisible una vez aplicado, ofrece resistencia a impactos menores, rayones superficiales y agentes químicos. Incorpora tecnología self-healing de recuperación térmica.',
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
