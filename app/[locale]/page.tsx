import type { Metadata } from 'next'
import Hero from '@/components/sections/Hero'
import StatsRow from '@/components/sections/StatsRow'
import HeroCategories from '@/components/sections/HeroCategories'
import BrandStory from '@/components/sections/BrandStory'
import ShowRoomComingSoon from '@/components/sections/ShowRoomComingSoon'
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
      <Hero />
      <StatsRow />
      <HeroCategories />
      <BrandStory />
      <ShowRoomComingSoon />
      <ProductsGrid />
      <ServicesSection />
      <ContactCTA />
    </>
  )
}
