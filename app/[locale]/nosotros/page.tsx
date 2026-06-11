import type { Metadata } from 'next'
import Image from 'next/image'
import AboutHero from '@/components/sections/about/AboutHero'
import AboutValues from '@/components/sections/about/AboutValues'
import AboutTechnology from '@/components/sections/about/AboutTechnology'
import AboutCTA from '@/components/sections/about/AboutCTA'
import { buildAlternates } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Nosotros', description: 'Conocé la historia, los valores y la tecnología alemana detrás de Kristall Film, distribuidor oficial de láminas automotrices y arquitectónicas en Argentina.' },
  en: { title: 'About Us', description: 'Learn about the history, values and German technology behind Kristall Film, official distributor of automotive and architectural window films in Argentina.' },
  de: { title: 'Über uns', description: 'Erfahren Sie mehr über die Geschichte, Werte und Technologie hinter Kristall Film, dem offiziellen Vertrieb für Folien in Argentinien.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/nosotros', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/nosotros` },
  }
}

export default function NosotrosPage() {
  return (
    <>
      <AboutHero />
      <AboutValues />
      <section className="relative w-full" style={{ height: '70vh' }}>
        <Image
          src="/cat/top-VITRAL.jpg"
          alt="Instalación de lámina arquitectónica VITRAL Kristall Film en vidriado comercial"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </section>
      <AboutTechnology />
      <AboutCTA />
    </>
  )
}
