import type { Metadata } from 'next'
import PropuestaVidrieriasHero from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasHero'
import PropuestaVidrieriasBenefits from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasBenefits'
import PropuestaVidrieriasModelos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasModelos'
import PropuestaVidrieriasProductos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasProductos'
import PropuestaVidrieriasGarantia from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasGarantia'
import PropuestaVidrieriasCompromisos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasCompromisos'
import PropuestaVidrieriasCTA from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasCTA'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'

export const revalidate = 3600

const pageMeta: Record<string, { title: string; description: string }> = {
  es: {
    title: 'Propuesta Aberturas — Programa de Socios Kristall',
    description: 'Sumá una nueva unidad de negocio para tu empresa de aberturas con el Programa de Socios Kristall: soporte técnico, comercial y Garantía Digital en cada instalación.',
  },
  en: {
    title: 'Door & Window Retailers Proposal — Kristall Partner Program',
    description: 'Add a new business unit to your door and window company with the Kristall Partner Program: technical and sales support, plus a Digital Warranty on every installation.',
  },
  de: {
    title: 'Angebot für Fenster- und Türenhändler — Kristall-Partnerprogramm',
    description: 'Erweitern Sie Ihr Geschäft als Fenster- und Türenhändler mit dem Kristall-Partnerprogramm: technischer und kaufmännischer Support sowie digitale Garantie für jede Installation.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    // absolute: el título ya incluye "Kristall" — evita que el template del
    // layout ('%s | Kristall Film') lo duplique.
    title: { absolute: m.title },
    description: m.description,
    alternates: buildAlternates('/propuesta-aberturas', locale),
    openGraph: { title: m.title, description: m.description, url: `https://kristallfilm.com/${locale}/propuesta-aberturas`, images: [DEFAULT_OG_IMAGE] },
  }
}

export default function PropuestaVidrieriasPage() {
  return (
    <>
      <PropuestaVidrieriasHero />
      <PropuestaVidrieriasBenefits />
      <PropuestaVidrieriasModelos />
      <PropuestaVidrieriasProductos />
      <PropuestaVidrieriasGarantia />
      <PropuestaVidrieriasCompromisos />
      <PropuestaVidrieriasCTA />
    </>
  )
}
