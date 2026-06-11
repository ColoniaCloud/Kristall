import type { Metadata } from 'next'
import ServicesHero from '@/components/sections/services/ServicesHero'
import ServicesPolarizedApp from '@/components/sections/services/ServicesPolarizedApp'
import ServicesCTA from '@/components/sections/services/ServicesCTA'
import { buildAlternates } from '@/lib/seo'

const pageMeta: Record<string, { title: string; description: string }> = {
  es: { title: 'Software para instaladores', description: 'Descubrí Polarized, la app de cálculo de Kristall Film para instaladores profesionales de láminas automotrices. Herramienta gratuita y precisa.' },
  en: { title: 'Installer Software', description: "Discover Polarized, Kristall Film's calculation app for professional window film installers. Free and accurate tool for automotive technicians." },
  de: { title: 'Installateur-Software', description: 'Entdecken Sie Polarized, die Berechnungs-App von Kristall Film für professionelle Folieninstallateure. Kostenloses Werkzeug für Kfz-Techniker.' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/servicios', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/servicios` },
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
