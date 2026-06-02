import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import ProductsHero from '@/components/product/ProductsHero'
import ProductsClient, { type ProductItem } from '@/components/product/ProductsClient'
import CatalogViewer from '@/components/sections/CatalogViewer'

export const revalidate = 3600

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Productos', description: 'Explorá nuestro catálogo completo de láminas automotrices, arquitectónicas y PPF.' },
  en: { title: 'Products', description: 'Browse our full catalog of automotive, architectural and PPF window films.' },
  de: { title: 'Produkte', description: 'Durchstöbern Sie unser vollständiges Sortiment an Automobil-, Architektur- und Lackschutzfolien.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `/${locale}/productos` },
  }
}

export default async function ProductsPage() {
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 100,
  })

  const sorted = (products as unknown as ProductItem[]).sort((a, b) => {
    if (a.vlt == null && b.vlt == null) return 0
    if (a.vlt == null) return 1
    if (b.vlt == null) return -1
    return a.vlt - b.vlt
  })

  const serialized = sorted.map((p) => ({
    id: p.id,
    name_es: p.name_es,
    category: p.category,
    description_es: p.description_es || '',
    vlt: p.vlt ?? null,
    uv: p.uv ?? null,
    irr: p.irr ?? null,
    sku: p.sku,
    inStock: p.inStock,
    slug: p.slug,
  }))

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <ProductsHero />
      <CatalogViewer />
      <ProductsClient products={serialized} />
    </div>
  )
}
