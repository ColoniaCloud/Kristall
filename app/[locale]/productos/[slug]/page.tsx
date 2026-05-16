import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import type { Product } from '@/types/product'
import { CATEGORY_LABEL } from '@/types/product'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const PRODUCT_FIELD_LABELS: Record<string, Record<string, string>> = {
  es: {
    vlt: 'Transmisión de luz visible',
    uv: 'Bloqueo UV',
    irr: 'Rechazo infrarrojo',
    specs: 'Especificaciones técnicas',
    catalog: 'Catálogo',
    quote: 'Solicitar cotización',
    soon: 'Próximamente — consultá por preventas escribiéndonos a',
    contact: 'contacto',
  },
  en: {
    vlt: 'Visible light transmission',
    uv: 'UV blocking',
    irr: 'Infrared rejection',
    specs: 'Technical specifications',
    catalog: 'Catalog',
    quote: 'Request a quote',
    soon: 'Coming soon — contact us for pre-sales at',
    contact: 'contact',
  },
  de: {
    vlt: 'Lichtdurchlässigkeit',
    uv: 'UV-Blockierung',
    irr: 'Infrarotabweisung',
    specs: 'Technische Spezifikationen',
    catalog: 'Katalog',
    quote: 'Angebot anfragen',
    soon: 'Demnächst — kontaktieren Sie uns für Vorbestellungen unter',
    contact: 'Kontakt',
  },
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(
      `${base}/api/products?where[slug][equals]=${slug}&limit=1&depth=1`,
      { cache: 'no-store' },
    )
    if (!res.ok) return null
    const data = await res.json()
    return data.docs?.[0] ?? null
  } catch {
    return null
  }
}

export async function generateStaticParams() {
  try {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    const res = await fetch(`${base}/api/products?limit=100&depth=0`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.docs ?? []).flatMap((p: Product) =>
      ['es', 'en', 'de'].map((locale) => ({ locale, slug: p.slug })),
    )
  } catch {
    return []
  }
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  const name = product[`name_${locale}` as keyof Product] as string ?? product.name_es
  const description = product.seo_description ?? undefined
  return {
    title: product.seo_title ?? name,
    description,
    openGraph: { title: product.seo_title ?? name, description },
    alternates: {
      canonical: `/${locale}/productos/${slug}`,
      languages: {
        es: `/es/productos/${slug}`,
        en: `/en/productos/${slug}`,
        de: `/de/productos/${slug}`,
      },
    },
  }
}

export default async function ProductoDetailPage({ params }: PageProps) {
  const { locale, slug } = await params

  // Si el slug coincide con una categoría, redirigir a /productos/categorias/{slug}
  if (CATEGORY_LABEL[slug]) {
    redirect(`/${locale}/productos/categorias/${slug}`)
  }

  const product = await getProduct(slug)
  if (!product) notFound()

  const t = PRODUCT_FIELD_LABELS[locale] ?? PRODUCT_FIELD_LABELS.es
  const name = (product[`name_${locale}` as keyof Product] as string) || product.name_es
  const firstImage = product.images?.[0]?.image
  const imageUrl = firstImage && typeof firstImage === 'object' && 'url' in firstImage
    ? (firstImage as { url?: string }).url
    : null

  return (
    <section className="px-6 py-16 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#9A9A9A] mb-8 flex items-center gap-1.5">
        <Link href="/productos" className="hover:text-[#0A0A0A] transition-colors">
          {t.catalog}
        </Link>
        <span>/</span>
        <span className="text-[#0A0A0A]">{product.sku}</span>
      </nav>

      {/* Out of stock banner */}
      {!product.inStock && (
        <div className="mb-8 px-4 py-3 rounded-[var(--r)] bg-[#F2F2F0] border border-[#E4E4E2] text-sm text-[#5C5C5C]">
          {t.soon}{' '}
          <Link href="/contacto" className="underline text-[#0A0A0A]">
            {t.contact}
          </Link>
          .
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-12">
        {/* Left */}
        <div>
          {/* Product image */}
          {imageUrl && (
            <div className="relative w-full aspect-video rounded-[var(--r)] overflow-hidden mb-6 bg-[#F2F2F0]">
              <Image
                src={imageUrl}
                alt={product.images?.[0]?.alt ?? name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}

          <p className="text-xs font-medium tracking-widest text-[#9A9A9A] uppercase mb-2">
            {CATEGORY_LABEL[product.category] ?? product.category}
          </p>
          <h1
            className="text-3xl font-black text-[#0A0A0A] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {name}
          </h1>
          <p className="text-xs text-[#9A9A9A] mb-6">SKU: {product.sku}</p>

          <Link
            href={`/contacto?producto=${product.sku}` as `/contacto?producto=${string}`}
            className="inline-block bg-[#0A0A0A] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#2a2a2a] transition-colors"
          >
            {t.quote}
          </Link>
        </div>

        {/* Right — specs */}
        <div>
          {(product.vlt !== null || product.uv !== null || product.irr !== null) && (
            <div className="mb-8">
              <h2 className="text-xs font-medium tracking-widest uppercase text-[#9A9A9A] mb-4">
                {t.specs}
              </h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E4E4E2]">
                  {product.vlt !== null && (
                    <tr>
                      <td className="py-3 text-[#5C5C5C]">{t.vlt}</td>
                      <td className="py-3 text-right font-semibold text-[#0A0A0A]">
                        {product.vlt}%
                      </td>
                    </tr>
                  )}
                  {product.uv !== null && (
                    <tr>
                      <td className="py-3 text-[#5C5C5C]">{t.uv}</td>
                      <td className="py-3 text-right font-semibold text-[#0A0A0A]">
                        {product.uv}%
                      </td>
                    </tr>
                  )}
                  {product.irr !== null && (
                    <tr>
                      <td className="py-3 text-[#5C5C5C]">{t.irr}</td>
                      <td className="py-3 text-right font-semibold text-[#0A0A0A]">
                        {product.irr}%
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Extra specifications from CMS */}
          {product.specifications && product.specifications.length > 0 && (
            <div>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-[#E4E4E2]">
                  {product.specifications.map((spec, i) =>
                    spec.key ? (
                      <tr key={i}>
                        <td className="py-3 text-[#5C5C5C]">{spec.key}</td>
                        <td className="py-3 text-right font-semibold text-[#0A0A0A]">
                          {spec.value ?? '—'}
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
