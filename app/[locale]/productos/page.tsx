import { Suspense } from 'react'
import ProductCard from '@/components/product/ProductCard'
import ProductFilter from '@/components/product/ProductFilter'
import type { Product } from '@/types/product'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const PAGE_SIZE = 24

async function getProducts(
  categoria?: string,
  page = 1,
): Promise<{ docs: Product[]; totalPages: number }> {
  try {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const where = categoria
      ? `where[active][equals]=true&where[category][equals]=${categoria}`
      : 'where[active][equals]=true'
    const res = await fetch(
      `${base}/api/products?${where}&limit=${PAGE_SIZE}&page=${page}&depth=0`,
      { cache: 'no-store' },
    )
    if (!res.ok) return { docs: [], totalPages: 1 }
    const data = await res.json()
    return { docs: data.docs ?? [], totalPages: data.totalPages ?? 1 }
  } catch {
    return { docs: [], totalPages: 1 }
  }
}

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ categoria?: string; page?: string }>
}

export default async function ProductosPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { categoria, page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const { docs: products, totalPages } = await getProducts(categoria, page)

  return (
    <section className="px-6 py-16 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1
          className="text-4xl font-black tracking-tight text-[#0A0A0A] mb-2"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Catálogo
        </h1>
        <p className="text-[#5C5C5C] text-sm">
          Láminas de alta performance para vehicular y arquitectura
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <ProductFilter />
        </Suspense>
      </div>

      {products.length === 0 ? (
        <p className="text-[#9A9A9A] text-sm py-20 text-center">Sin productos disponibles.</p>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const sp = new URLSearchParams()
            if (categoria) sp.set('categoria', categoria)
            if (p > 1) sp.set('page', String(p))
            const href = sp.toString() ? `?${sp.toString()}` : '?'
            return (
              <a
                key={p}
                href={href}
                className={`text-xs font-medium w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  p === page
                    ? 'bg-[#0A0A0A] text-white'
                    : 'border border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A]'
                }`}
              >
                {p}
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
