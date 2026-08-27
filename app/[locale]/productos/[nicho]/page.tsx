import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/routing'
import CategoryCard from '@/components/product/CategoryCard'
import ExteriorComingSoon from '@/components/sections/ExteriorComingSoon'
import { NICHOS, lineasPorNicho, type Nicho } from '@/lib/catalogo'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'

export function generateStaticParams() {
  return NICHOS.flatMap((nicho) =>
    ['es', 'en', 'de'].map((locale) => ({ locale, nicho })),
  )
}

const isNicho = (v: string): v is Nicho => (NICHOS as string[]).includes(v)

export async function generateMetadata({ params }: { params: Promise<{ locale: string; nicho: string }> }) {
  const { locale, nicho } = await params
  if (!isNicho(nicho)) return {}
  const tp = await getTranslations({ locale, namespace: 'products' })
  const title = tp(`nicho_${nicho}`)
  const description = tp(`nicho_${nicho}_desc`)
  return {
    title,
    description,
    alternates: buildAlternates(`/productos/${nicho}`, locale),
    openGraph: {
      title: `${title} | Kristall Film`,
      description,
      url: `https://kristallfilm.com/${locale}/productos/${nicho}`,
      images: [DEFAULT_OG_IMAGE],
    },
  }
}

interface PageProps {
  params: Promise<{ locale: string; nicho: string }>
}

export default async function NichoPage({ params }: PageProps) {
  const { locale, nicho } = await params
  if (!isNicho(nicho)) notFound()

  const tp = await getTranslations({ locale, namespace: 'products' })
  const lineas = lineasPorNicho(nicho)

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <section className="px-4 md:px-10 pt-28 pb-10 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/productos" className="text-[12px] text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors uppercase tracking-widest">
            {tp('label')}
          </Link>
          <span className="text-[#D0D0CE] text-[12px]">/</span>
          <span className="text-[12px] text-[#5C5C5C] uppercase tracking-widest">{tp(`nicho_${nicho}`)}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
          {tp(`nicho_${nicho}`)}
        </h1>
        <p className="text-base text-[#5C5C5C] max-w-[560px] leading-relaxed">{tp(`nicho_${nicho}_desc`)}</p>
      </section>

      <section className="px-4 md:px-10 pb-16 max-w-[1160px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {lineas.map((linea) => (
            <div key={linea.slug} className="h-full">
              <CategoryCard linea={linea} />
            </div>
          ))}
        </div>
      </section>

      {nicho === 'arquitectura' && <ExteriorComingSoon />}
    </div>
  )
}
