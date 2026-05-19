import type { Metadata } from 'next'
import Image from 'next/image'
import AboutHero from '@/components/sections/about/AboutHero'
import AboutValues from '@/components/sections/about/AboutValues'
import AboutTechnology from '@/components/sections/about/AboutTechnology'
import AboutCTA from '@/components/sections/about/AboutCTA'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Nosotros', description: 'Conocé la historia, valores y tecnología detrás de Kristall Film.' },
  en: { title: 'About Us', description: 'Learn about the story, values and technology behind Kristall Film.' },
  de: { title: 'Über uns', description: 'Erfahren Sie mehr über die Geschichte, Werte und Technologie hinter Kristall Film.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `/${locale}/nosotros` },
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
          alt=""
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
