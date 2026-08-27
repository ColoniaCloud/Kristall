import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import ProductCard from '@/components/product/ProductCard'
import ExteriorComingSoon from '@/components/sections/ExteriorComingSoon'
import { LINEAS, LINEA_SLUGS, getLinea, lineaDestacadaSrc, lineaLogoSrc, type Linea } from '@/lib/catalogo'
import { buildAlternates, productJsonLd, BASE } from '@/lib/seo'

export function generateStaticParams() {
  return LINEA_SLUGS.flatMap((slug) =>
    ['es', 'en', 'de'].map((locale) => ({ locale, linea: slug })),
  )
}

async function tagline(locale: string, linea: Linea): Promise<string> {
  const tm = await getTranslations({ locale, namespace: 'product_modal' })
  const categoria = tm(`categoria_${linea.categoria}`)
  return linea.garantiaAnios ? `${categoria} · ${tm('warranty_years', { n: linea.garantiaAnios })}` : categoria
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; linea: string }> }) {
  const { locale, linea: slug } = await params
  const linea = getLinea(slug)
  if (!linea) return {}
  const tp = await getTranslations({ locale, namespace: 'products' })
  const description = tp(linea.descKey)
  const title = `${linea.nombre} — ${await tagline(locale, linea)}`
  const image = `${BASE}${lineaDestacadaSrc(slug)}`
  return {
    title,
    description,
    alternates: buildAlternates(`/productos/lineas/${slug}`, locale),
    openGraph: {
      title: `${title} | Kristall Film`,
      description,
      url: `https://kristallfilm.com/${locale}/productos/lineas/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: `${linea.nombre} — Kristall Film` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Kristall Film`,
      description,
      images: [image],
    },
  }
}

interface PageProps {
  params: Promise<{ locale: string; linea: string }>
}

export default async function LineaPage({ params }: PageProps) {
  const { locale, linea: slug } = await params
  const linea = getLinea(slug)
  if (!linea) notFound()

  const tp = await getTranslations({ locale, namespace: 'products' })
  const productos = linea.productos
  const linTagline = await tagline(locale, linea)
  const nichoLabel = tp(linea.nicho === 'autos' ? 'nicho_autos' : 'nicho_arquitectura')
  const otrasLineas = LINEAS.filter((l) => l.nicho === linea.nicho && l.slug !== slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: tp('breadcrumb_home'), item: `${BASE}/${locale}` },
          { '@type': 'ListItem', position: 2, name: tp('label'), item: `${BASE}/${locale}/productos` },
          { '@type': 'ListItem', position: 3, name: nichoLabel, item: `${BASE}/${locale}/productos/${linea.nicho}` },
          { '@type': 'ListItem', position: 4, name: linea.nombre, item: `${BASE}/${locale}/productos/lineas/${slug}` },
        ],
      },
      ...productos.map((p) => productJsonLd(p, linea, locale)),
    ],
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">

      {/* HERO */}
      <section className="relative h-[420px] overflow-hidden">
        <Image src={lineaDestacadaSrc(slug)} alt={linea.nombre} fill className="object-cover object-center" priority sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />

        <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-10 max-w-[1160px] mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/productos" className="text-[12px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
              {tp('label')}
            </Link>
            <span className="text-white/25 text-[12px]">/</span>
            <Link href={`/productos/${linea.nicho}`} className="text-[12px] text-white/40 hover:text-white/70 transition-colors uppercase tracking-widest">
              {nichoLabel}
            </Link>
            <span className="text-white/25 text-[12px]">/</span>
            <span className="text-[12px] text-white/60 uppercase tracking-widest">{linea.nombre}</span>
          </div>

          <div className="relative w-32 h-16 md:w-56 md:h-28 mb-4">
            <Image src={lineaLogoSrc(slug)} alt={linea.nombre} fill className="object-contain object-left brightness-0 invert" sizes="(max-width: 768px) 128px, 224px" />
          </div>

          <h1 className="text-2xl md:text-4xl font-medium text-white mb-2 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
            {tp('line_prefix')} {linea.nombre}
            {linea.tecnologia && (
              <span className="block md:inline md:ml-2 text-white/50 font-normal text-sm md:text-lg">— {linea.tecnologia}</span>
            )}
          </h1>

          <p className="text-[12px] uppercase tracking-[0.15em] text-white/45 mb-2 font-medium">{linTagline}</p>
          <p className="text-base md:text-lg text-white max-w-[480px] leading-relaxed">{tp(linea.descKey)}</p>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="px-4 md:px-10 py-10 md:py-12 max-w-[1160px] mx-auto">
        <div className="flex justify-between items-baseline mb-8">
          <div>
            <p className="section-label mb-1">
              {tp(productos.length === 1 ? 'product_count_one' : 'product_count', { n: productos.length })}
            </p>
            <h2 className="text-2xl font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>
              {tp('products_heading')}
            </h2>
          </div>
          <Link href="/productos" className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors">
            ← {tp('view_all_lines')}
          </Link>
        </div>

        {productos.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-sm text-[#9A9A9A]">{tp('empty_products')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {productos.map((p) => (
              <ProductCard key={p.codigo} producto={p} />
            ))}
          </div>
        )}
      </section>

      {/* Otras líneas del mismo nicho */}
      {otrasLineas.length > 0 && (
        <section className="pb-16">
          <p className="section-label mb-5 px-4 md:px-10 max-w-[1160px] mx-auto">
            {tp('other_lines')}
          </p>
          <div className="flex md:flex-wrap md:max-w-[1160px] md:mx-auto md:px-10 gap-3 overflow-x-auto md:overflow-x-visible px-4 pb-2 md:pb-0 scrollbar-none snap-x snap-mandatory md:snap-none">
            {otrasLineas.map((l) => (
              <Link
                key={l.slug}
                href={`/productos/lineas/${l.slug}`}
                className="flex-shrink-0 md:flex-shrink flex items-center gap-3 bg-white border border-[#E4E4E2] rounded-lg px-4 py-2.5 text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all shadow-[0_1px_3px_rgba(0,0,0,0.04)] snap-start"
              >
                <div className="relative w-[60px] h-[30px]">
                  <Image src={lineaLogoSrc(l.slug)} alt={l.nombre} fill className="object-contain object-left" sizes="60px" />
                </div>
                <span className="font-medium text-xs">{l.nombre}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {linea.nicho === 'arquitectura' && <ExteriorComingSoon />}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
