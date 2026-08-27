import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import ProductCard from '@/components/product/ProductCard'
import ProductDetail from '@/components/product/ProductDetail'
import ExteriorComingSoon from '@/components/sections/ExteriorComingSoon'
import StatsRow from '@/components/sections/StatsRow'
import { LINEAS, getLinea, getProductoBySlug, productoSlug, productoNombre } from '@/lib/catalogo'
import { buildAlternates, productJsonLd, resolveProductImage, BASE } from '@/lib/seo'

export function generateStaticParams() {
  return LINEAS.flatMap((linea) =>
    linea.productos.flatMap((p) =>
      ['es', 'en', 'de'].map((locale) => ({ locale, linea: linea.slug, producto: productoSlug(p) })),
    ),
  )
}

interface RouteParams {
  locale: string
  linea: string
  producto: string
}

/** Resuelve y valida el par línea/producto de la URL — el producto tiene que existir y pertenecer a esa línea. */
function resolveRoute(lineaSlug: string, productoParam: string) {
  const linea = getLinea(lineaSlug)
  const producto = getProductoBySlug(productoParam)
  if (!linea || !producto || producto.lineaSlug !== lineaSlug) return null
  return { linea, producto }
}

export async function generateMetadata({ params }: { params: Promise<RouteParams> }) {
  const { locale, linea: slug, producto: productoParam } = await params
  const resolved = resolveRoute(slug, productoParam)
  if (!resolved) return {}
  const { linea, producto } = resolved

  const tp = await getTranslations({ locale, namespace: 'products' })
  const tm = await getTranslations({ locale, namespace: 'product_modal' })
  const nombre = productoNombre(producto)
  const title = `${nombre} — ${linea.nombre}`
  const specBits = [
    producto.vlt != null && `VLT ${producto.vlt}%`,
    producto.garantiaAnios != null && tm('warranty_years', { n: producto.garantiaAnios }),
  ].filter((v): v is string => Boolean(v))
  const description = specBits.length > 0 ? `${tp(linea.descKey)} ${specBits.join(' · ')}.` : tp(linea.descKey)
  const image = `${BASE}${resolveProductImage(producto)}`
  const route = `/productos/lineas/${slug}/${productoParam}`

  return {
    title,
    description,
    alternates: buildAlternates(route, locale),
    openGraph: {
      title: `${title} | Kristall Film`,
      description,
      url: `${BASE}/${locale}${route}`,
      images: [{ url: image, width: 1200, height: 630, alt: `${nombre} — Kristall Film` }],
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
  params: Promise<RouteParams>
}

export default async function ProductoPage({ params }: PageProps) {
  const { locale, linea: slug, producto: productoParam } = await params
  const resolved = resolveRoute(slug, productoParam)
  if (!resolved) notFound()
  const { linea, producto } = resolved

  const tp = await getTranslations({ locale, namespace: 'products' })
  const nichoLabel = tp(linea.nicho === 'autos' ? 'nicho_autos' : 'nicho_arquitectura')
  const nombre = productoNombre(producto)
  const otrosProductos = linea.productos.filter((p) => p.codigo !== producto.codigo)

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
          { '@type': 'ListItem', position: 5, name: nombre, item: `${BASE}/${locale}/productos/lineas/${slug}/${productoParam}` },
        ],
      },
      productJsonLd(producto, linea, locale),
    ],
  }

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <section className="px-4 md:px-10 pt-28 pb-4 max-w-[1160px] mx-auto">
        <nav className="flex items-center gap-2 flex-wrap mb-6">
          <Link href="/productos" className="text-[12px] text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors uppercase tracking-widest">
            {tp('label')}
          </Link>
          <span className="text-[#D0D0CE] text-[12px]">/</span>
          <Link href={`/productos/${linea.nicho}`} className="text-[12px] text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors uppercase tracking-widest">
            {nichoLabel}
          </Link>
          <span className="text-[#D0D0CE] text-[12px]">/</span>
          <Link href={`/productos/lineas/${slug}`} className="text-[12px] text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors uppercase tracking-widest">
            {linea.nombre}
          </Link>
          <span className="text-[#D0D0CE] text-[12px]">/</span>
          <span className="text-[12px] text-[#5C5C5C] uppercase tracking-widest">{nombre}</span>
        </nav>

        <h1 className="text-2xl md:text-4xl font-medium text-[#0A0A0A] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          {nombre}
        </h1>
        <p className="text-sm text-[#5C5C5C] max-w-[560px] leading-relaxed">{tp(linea.descKey)}</p>
      </section>

      <section className="px-4 md:px-10 py-8 max-w-[1160px] mx-auto">
        <ProductDetail producto={producto} />
      </section>

      {otrosProductos.length > 0 && (
        <section className="pb-16 px-4 md:px-10 max-w-[1160px] mx-auto">
          <p className="section-label mb-5">{tp('other_products_in_line')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otrosProductos.map((p) => (
              <ProductCard key={p.codigo} producto={p} />
            ))}
          </div>
        </section>
      )}

      {linea.nicho === 'arquitectura' && <ExteriorComingSoon />}

      <StatsRow />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  )
}
