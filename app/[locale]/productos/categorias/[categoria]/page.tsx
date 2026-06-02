import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getCategoryMeta, CATEGORIES } from '@/lib/categories'
import ProductCard from '@/components/product/ProductCard'
import { Link } from '@/i18n/routing'
import type { Product } from '@/types/product'

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
    ['es', 'en', 'de'].map((locale) => ({ locale, categoria: cat.slug })),
  )
}

export async function generateMetadata({ params }: { params: Promise<{ categoria: string }> }) {
  const { categoria } = await params
  const meta = getCategoryMeta(categoria)
  if (!meta) return {}
  return {
    title: `${meta.name} — ${meta.tagline} | Kristall Film`,
    description: meta.description,
  }
}

interface PageProps {
  params: Promise<{ locale: string; categoria: string }>
}

export default async function CategoriaPage({ params }: PageProps) {
  const { locale, categoria } = await params
  const meta = getCategoryMeta(categoria)
  if (!meta) notFound()

  const rawProducts = await getProductsByCategory(categoria)
  const products = [...rawProducts].sort((a, b) => {
    if (a.vlt == null && b.vlt == null) return 0
    if (a.vlt == null) return 1
    if (b.vlt == null) return -1
    return (a.vlt as number) - (b.vlt as number)
  })

  return (
    <div className="min-h-screen bg-[#F2F2F0]">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden">
        <Image
          src={meta.image}
          alt={meta.name}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-10 max-w-[1160px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/productos" className="text-[11px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
              Productos
            </Link>
            <span className="text-white/25 text-[11px]">/</span>
            <span className="text-[11px] text-white/60 uppercase tracking-widest">{meta.name}</span>
          </div>

          <div className="relative w-32 h-16 md:w-56 md:h-28 mb-4">
            <Image
              src={meta.logo}
              alt={meta.name}
              fill
              className="object-contain object-left brightness-0 invert"
              sizes="(max-width: 768px) 128px, 224px"
            />
          </div>

          <p className="text-[11px] uppercase tracking-[0.15em] text-white/45 mb-2 font-medium">
            {meta.tagline}
          </p>

          <p className="text-sm text-white/60 max-w-[480px] leading-relaxed">
            {meta.description}
          </p>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="px-10 py-12 max-w-[1160px] mx-auto">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <p className="section-label mb-1">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </p>
            <h2
              className="text-2xl font-medium text-[#0A0A0A]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Línea {meta.name}
            </h2>
          </div>
          <Link
            href="/productos"
            className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
          >
            ← Ver todas las líneas
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#9A9A9A]">No hay productos disponibles en esta línea todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                name={(p[`name_${locale}` as keyof Product] as string) || p.name_es}
                category={p.category}
                description={''}
                vlt={p.vlt}
                uv={p.uv}
                irr={p.irr}
                sku={p.sku}
                inStock={p.inStock}
                slug={p.slug}
                badge={p.sku}
              />
            ))}
          </div>
        )}
      </section>

      {/* Otras categorías */}
      <section className="pb-16">
        <p className="section-label mb-5 px-10 max-w-[1160px] mx-auto">
          Otras líneas
        </p>
        {/* Carrusel en móvil, flex-wrap en desktop */}
        <div className="flex md:flex-wrap md:max-w-[1160px] md:mx-auto md:px-10 gap-3 overflow-x-auto md:overflow-x-visible px-10 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory md:snap-none">
          {CATEGORIES.filter(c => c.slug !== categoria).map(c => (
            <Link
              key={c.slug}
              href={`/productos/categorias/${c.slug}`}
              className="flex-shrink-0 md:flex-shrink flex items-center gap-3 bg-white border border-[#E4E4E2] rounded-lg px-4 py-2.5 text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] snap-start"
            >
              {/* Logo: w-15 h-7.5 en móvil (60×30), w-[60px] h-[30px] en desktop (150% de 40×20) */}
              <div className="relative w-[60px] h-[30px] md:w-[60px] md:h-[30px]">
                <Image src={c.logo} alt={c.name} fill className="object-contain object-left" sizes="60px" />
              </div>
              <span className="font-medium text-xs">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
