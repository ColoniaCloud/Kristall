import type { Metadata } from 'next'
import ServicesHero from '@/components/sections/services/ServicesHero'
import ServicesPolarizedApp from '@/components/sections/services/ServicesPolarizedApp'
import ServicesCTA from '@/components/sections/services/ServicesCTA'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Software', description: 'Descubrí nuestras soluciones de software para instaladores de láminas.' },
  en: { title: 'Software', description: 'Discover our software solutions for window film installers.' },
  de: { title: 'Software', description: 'Entdecken Sie unsere Softwarelösungen für Folieninstallateure.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `/${locale}/servicios` },
  }
}

export default function ServiciosPage() {
  return (
    <>
      <ServicesHero />
      <ServicesPolarizedApp />
      <ServicesCTA />
    </>
  )
}

