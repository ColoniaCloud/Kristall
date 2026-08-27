import type { Metadata } from 'next'
import PuntoHero from '@/components/sections/punto/PuntoHero'
import PuntoPillars from '@/components/sections/punto/PuntoPillars'
import PuntoCTA from '@/components/sections/punto/PuntoCTA'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'

export const revalidate = 3600

const pageMeta: Record<string, { title: string; description: string }> = {
  es: {
    title: 'Punto Kristall — Programa para Instaladores',
    description: 'Sumá tu taller como Punto Kristall: te traemos clientes, te damos las herramientas para cerrar ventas, te ponemos en escena y te respaldamos para crecer.',
  },
  en: {
    title: 'Punto Kristall — Installer Program',
    description: 'Join as a Punto Kristall installer: we bring you clients, give you the tools to close sales, put you in the spotlight, and back you up to grow.',
  },
  de: {
    title: 'Punto Kristall — Installateurprogramm',
    description: 'Werden Sie Punto-Kristall-Werkstatt: Wir bringen Ihnen Kunden, geben Ihnen die Werkzeuge für den Verkaufsabschluss, rücken Sie ins Rampenlicht und unterstützen Ihr Wachstum.',
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
    alternates: buildAlternates('/punto-kristall', locale),
    openGraph: { title: m.title, description: m.description, url: `https://kristallfilm.com/${locale}/punto-kristall`, images: [DEFAULT_OG_IMAGE] },
  }
}

export default function PuntoKristallPage() {
  return (
    <>
      <PuntoHero />
      <PuntoPillars />
      <PuntoCTA />
    </>
  )
}
