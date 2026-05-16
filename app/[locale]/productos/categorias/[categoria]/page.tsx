import { notFound } from 'next/navigation'
import ProductCard from '@/components/product/ProductCard'
import { Link } from '@/i18n/routing'
import type { Product } from '@/types/product'
import { CATEGORIES, CATEGORY_LABEL, CATEGORY_DESCRIPTION } from '@/types/product'

export const revalidate = 0
export const dynamic = 'force-dynamic'

async function getProductsByCategory(categoria: string): Promise<Product[]> {
  try {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(
      `${base}/api/products?where[active][equals]=true&where[category][equals]=${categoria}&limit=100&depth=0`,
      { cache: 'no-store' },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}

export async function generateStaticParams() {
  return CATEGORIES.flatMap((cat) =>
    ['es', 'en', 'de'].map((locale) => ({ locale, categoria: cat.value })),
  )
}

interface PageProps {
  params: Promise<{ locale: string; categoria: string }>
}

export default async function CategoriaPage({ params }: PageProps) {
  const { locale, categoria } = await params
  const label = CATEGORY_LABEL[categoria]
  if (!label) notFound()

  const description = CATEGORY_DESCRIPTION[categoria]
  const products = await getProductsByCategory(categoria)

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <nav className="text-xs text-[#9A9A9A] mb-8 flex items-center gap-1.5">
        <Link href="/productos" className="hover:text-[#0A0A0A] transition-colors">
          Catálogo
        </Link>
        <span>/</span>
        <span className="text-[#0A0A0A]">{label}</span>
      </nav>

      <div className="mb-10">
        <h1
          className="text-4xl font-black tracking-tight text-[#0A0A0A] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {label}
        </h1>
        <p className="text-[#5C5C5C] text-sm max-w-xl">{description}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-[#9A9A9A] text-sm py-20 text-center">
          Sin productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              name={(p[`name_${locale}` as keyof Product] as string) || p.name_es}
              category={p.category}
              vlt={p.vlt}
              uv={p.uv}
              irr={p.irr}
              sku={p.sku}
              inStock={p.inStock}
              slug={p.slug}
              locale={locale}
            />
          ))}
        </div>
      )}
    </section>
  )
}
