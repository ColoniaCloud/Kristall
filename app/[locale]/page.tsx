import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import StatsRow from '@/components/sections/StatsRow'
import BrandStory from '@/components/sections/BrandStory'
import ProductsGrid from '@/components/sections/ProductsGrid'
import ServicesSection from '@/components/sections/ServicesSection'
import ContactCTA from '@/components/sections/ContactCTA'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Inicio', description: 'Láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF. Distribuidor oficial en Argentina.' },
  en: { title: 'Home', description: 'German-engineered window films for automotive, architectural and PPF applications. Official distributor in Argentina.' },
  de: { title: 'Startseite', description: 'Deutsche Folientechnologie für Automobil, Architektur und Lackschutzfolie. Offizieller Vertrieb in Argentinien.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}`, images: [DEFAULT_OG_IMAGE] },
  }
}

export default function HomePage() {
  return (
    <>
      {/* Hero + barra de logos ocupan exactamente la primera pantalla.
          100dvh menos lo que hay arriba → los logos quedan pegados al fondo del
          viewport sin necesidad de scroll. Se calcula para el estado inicial
          (sin scroll, TopBar h-8 = 2rem visible): header h-14 (3.5rem) en
          mobile, y en desktop el header arranca 10% más alto (h-[62px] ≈
          3.875rem) hasta que el usuario scrollea y encoge a 3.5rem — pero para
          entonces el hero ya quedó atrás, así que el cálculo usa el tamaño
          "en reposo" (sin scroll) de cada breakpoint. */}
      <div className="flex flex-col h-[calc(100dvh_-_5.5rem)] md:h-[calc(100dvh_-_5.875rem)]">
        <Hero />
        <StatsRow />
      </div>
      <BrandStory />
      <ProductsGrid />
      <ServicesSection />
      <ContactCTA />
    </>
  )
}
