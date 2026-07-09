import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import ProductCard from '@/components/product/ProductCard'
import { LINES, LINE_ORDER, getLine, laminasByLine, laminaName, type Lamina } from '@/lib/catalogo'
import { buildAlternates, BASE } from '@/lib/seo'

export function generateStaticParams() {
  return LINE_ORDER.flatMap((slug) =>
    ['es', 'en', 'de'].map((locale) => ({ locale, categoria: slug })),
  )
}

async function tagline(locale: string, slug: string): Promise<string> {
  const line = getLine(slug)
  if (!line) return ''
  const tm = await getTranslations({ locale, namespace: 'product_modal' })
  const tier = tm(`tier_${line.tier}`)
  return line.warrantyYears ? `${tier} · ${tm('warranty_years', { n: line.warrantyYears })}` : tier
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; categoria: string }> }) {
  const { locale, categoria } = await params
  const line = getLine(categoria)
  if (!line) return {}
  const tp = await getTranslations({ locale, namespace: 'products' })
  const description = tp(line.descKey)
  const title = `${line.name} — ${await tagline(locale, categoria)}`
  return {
    title,
    description,
    alternates: buildAlternates(`/productos/categorias/${categoria}`, locale),
    openGraph: {
      title: `${title} | Kristall Film`,
      description,
      url: `https://kristallfilm.com/${locale}/productos/categorias/${categoria}`,
      images: [{ url: line.image, width: 1200, height: 630, alt: `${line.name} — Kristall Film` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Kristall Film`,
      description,
      images: [line.image],
    },
  }
}

function productLd(lamina: Lamina, line: NonNullable<ReturnType<typeof getLine>>) {
  const additionalProperty = [
    lamina.vlt != null && { '@type': 'PropertyValue', name: 'VLT', value: `${lamina.vlt}%` },
    lamina.irr != null && { '@type': 'PropertyValue', name: 'IR Rejection', value: `${lamina.irr}%` },
    lamina.uv != null && { '@type': 'PropertyValue', name: 'UV Rejection', value: `${lamina.uv}%` },
    line.warrantyYears != null && { '@type': 'PropertyValue', name: 'Warranty', value: `${line.warrantyYears} years` },
  ].filter(Boolean)

  return {
    '@type': 'Product',
    name: laminaName(lamina),
    sku: lamina.sku,
    brand: { '@type': 'Brand', name: 'Kristall Film' },
    category: line.name,
    ...(additionalProperty.length > 0 && { additionalProperty }),
  }
}

interface PageProps {
  params: Promise<{ locale: string; categoria: string }>
}

export default async function CategoriaPage({ params }: PageProps) {
  const { locale, categoria } = await params
  const line = getLine(categoria)
  if (!line) notFound()

  const tp = await getTranslations({ locale, namespace: 'products' })
  const products = laminasByLine(categoria)
  const lineTagline = await tagline(locale, categoria)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: tp('breadcrumb_home'), item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: tp('label'), item: `${BASE}/${locale}/productos` },
          { '@type': 'ListItem', position: 3, name: line.name, item: `${BASE}/${locale}/productos/categorias/${categoria}` },
        ],
      },
      ...products.map((p) => productLd(p, line)),
    ],
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden">
        <Image src={line.image} alt={line.name} fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-10 max-w-[1160px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/productos" className="text-[11px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
              {tp('label')}
            </Link>
            <span className="text-white/25 text-[11px]">/</span>
            <span className="text-[11px] text-white/60 uppercase tracking-widest">{line.name}</span>
          </div>

          <div className="relative w-32 h-16 md:w-56 md:h-28 mb-4">
            <Image src={line.logo} alt={line.name} fill className="object-contain object-left brightness-0 invert" sizes="(max-width: 768px) 128px, 224px" />
          </div>

          <h1 className="text-2xl md:text-4xl font-medium text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {tp('line_prefix')} {line.name}
            <span className="block md:inline md:ml-2 text-white/50 font-normal text-sm md:text-lg">— {line.technology}</span>
          </h1>

          <p className="text-[11px] uppercase tracking-[0.15em] text-white/45 mb-2 font-medium">{lineTagline}</p>
          <p className="text-base md:text-lg text-white max-w-[480px] leading-relaxed">{tp(line.descKey)}</p>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="px-4 md:px-10 py-10 md:py-12 max-w-[1160px] mx-auto">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <p className="section-label mb-1">
              {tp(products.length === 1 ? 'product_count_one' : 'product_count', { n: products.length })}
            </p>
            <h2 className="text-2xl font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>
              {tp('products_heading')}
            </h2>
          </div>
          <Link href="/productos" className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors">
            ← {tp('view_all_lines')}
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#9A9A9A]">{tp('empty_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <ProductCard key={p.sku} lamina={p} />
            ))}
          </div>
        )}
      </section>

      {/* Otras líneas */}
      <section className="pb-16">
        <p className="section-label mb-5 px-4 md:px-10 max-w-[1160px] mx-auto">
          {tp('other_lines')}
        </p>
        <div className="flex md:flex-wrap md:max-w-[1160px] md:mx-auto md:px-10 gap-3 overflow-x-auto md:overflow-x-visible px-4 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory md:snap-none">
          {LINES.filter((c) => c.slug !== categoria).map((c) => (
            <Link
              key={c.slug}
              href={`/productos/categorias/${c.slug}`}
              className="flex-shrink-0 md:flex-shrink flex items-center gap-3 bg-white border border-[#E4E4E2] rounded-lg px-4 py-2.5 text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] snap-start"
            >
              <div className="relative w-[60px] h-[30px]">
                <Image src={c.logo} alt={c.name} fill className="object-contain object-left" sizes="60px" />
              </div>
              <span className="font-medium text-xs">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
