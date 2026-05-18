import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { getTranslations } from 'next-intl/server'
import { getCategoryImage, getCategoryLogo, getCategoryMeta } from '@/lib/categories'
import ProductActions from '@/components/product/ProductActions'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug, locale } = await params
  const t = await getTranslations({ locale, namespace: 'product_slug' })

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      slug: { equals: slug },
      active: { equals: true },
    },
    limit: 1,
  })

  interface ProductDoc {
    category: string
    name_es: string
    sku: string
    description_es?: string
    vlt?: number | null
    uv?: number | null
    irr?: number | null
    inStock?: boolean
  }

  const product = docs[0] as ProductDoc | undefined
  if (!product) notFound()

  const heroImage = getCategoryImage(product.category)
  const logoSrc = getCategoryLogo(product.category)
  const catMeta = getCategoryMeta(product.category)

  const specs = [
    { label: t('spec_vlt'), value: product.vlt != null ? `${product.vlt}%` : null },
    { label: t('spec_uv'), value: product.uv != null ? `${product.uv}%` : null },
    { label: t('spec_irr'), value: product.irr != null ? `${product.irr}%` : null },
    { label: t('spec_sku'), value: product.sku },
    { label: t('spec_availability'), value: product.inStock ? t('spec_in_stock') : t('spec_coming_soon') },
  ].filter(s => s.value !== null)

  return (
    <div className="min-h-screen bg-[#F2F2F0]">

      {/* Hero de categoría */}
      <section className="relative h-[360px] overflow-hidden">
        <Image
          src={heroImage}
          alt={catMeta?.name ?? product.category}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/15" />

        {/* Breadcrumb */}
        <div className="absolute top-6 left-0 right-0 z-10 px-10 max-w-[1160px] mx-auto">
          <nav className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/productos" className="hover:text-white transition-colors">{t('breadcrumb_products')}</Link>
            <span>/</span>
            <Link href={`/productos/categorias/${product.category}`} className="hover:text-white transition-colors uppercase">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-white/30">{product.sku}</span>
          </nav>
        </div>

        {/* Logo + nombre */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-10 pb-10 max-w-[1160px] mx-auto">
          <div className="relative w-20 h-10 mb-3">
            <Image
              src={logoSrc}
              alt={catMeta?.name ?? product.category}
              fill
              className="object-contain object-left brightness-0 invert"
              sizes="80px"
            />
          </div>
          <h1
            className="text-white font-medium max-w-[520px]"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 500,
              letterSpacing: '-0.02em',
            }}
          >
            {product.name_es}
          </h1>
        </div>
      </section>

      {/* Contenido */}
      <div className="px-10 py-10 max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Columna izquierda — Descripción + specs */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {product.description_es && (
              <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)]">
                <p className="section-label mb-3">{t('section_description')}</p>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">{product.description_es}</p>
              </div>
            )}

            {specs.length > 0 && (
              <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)]">
                <p className="section-label mb-4">{t('section_specs')}</p>
                <div className="flex flex-col divide-y divide-[#F2F2F0]">
                  {specs.map(s => (
                    <div key={s.label} className="flex items-center justify-between py-3">
                      <span className="text-xs text-[#5C5C5C]">{s.label}</span>
                      <span className="text-xs font-medium text-[#0A0A0A] tabular-nums">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {catMeta && (
              <div className="border border-[#E4E4E2] rounded-xl p-5 flex items-center justify-between bg-[#F2F2F0]">
                <div>
                  <p className="text-xs text-[#9A9A9A] mb-0.5">{t('line_label')}</p>
                  <p className="text-sm font-medium text-[#0A0A0A]">{catMeta.name}</p>
                </div>
                <Link
                  href={`/productos/categorias/${product.category}`}
                  className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] border border-[#E4E4E2] rounded-lg px-3 py-2 hover:border-[#0A0A0A] transition-all"
                >
                  {t('see_line')}
                </Link>
              </div>
            )}
          </div>

          {/* Columna derecha — Acciones */}
          <div className="lg:col-span-1">
            <ProductActions
              sku={product.sku}
              name={product.name_es}
              category={product.category}
              inStock={product.inStock}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
