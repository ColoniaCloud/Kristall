import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/seo'
import ProductsHero from '@/components/product/ProductsHero'
import ProductsClient from '@/components/product/ProductsClient'
import CatalogViewer from '@/components/sections/CatalogViewer'

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
    alternates: buildAlternates('/productos', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/productos` },
  }
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <ProductsHero />
      <CatalogViewer />
      <ProductsClient />
    </div>
  )
}
