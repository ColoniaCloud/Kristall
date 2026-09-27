import type { Metadata } from 'next'
import ConcesionariasHero from '@/components/sections/concesionarias/ConcesionariasHero'
import ConcesionariasNegocio from '@/components/sections/concesionarias/ConcesionariasNegocio'
import ConcesionariasEquipamiento from '@/components/sections/concesionarias/ConcesionariasEquipamiento'
import ConcesionariasRequisitos from '@/components/sections/concesionarias/ConcesionariasRequisitos'
import ConcesionariasCTA from '@/components/sections/concesionarias/ConcesionariasCTA'
import { buildAlternates, DEFAULT_OG_IMAGE } from '@/lib/seo'
import { setRequestLocale } from 'next-intl/server'

export const revalidate = 3600

const pageMeta: Record<string, { title: string; description: string }> = {
  es: {
    title: 'Programa para Concesionarias',
    description: 'Sumá un margen adicional premium a cada entrega de 0km con el programa de polarizado Kristall: sin exclusividad, con garantía digital y respaldo técnico y comercial.',
  },
  en: {
    title: 'Dealership Program',
    description: 'Add a premium margin to every new car delivery with the Kristall window film program: no exclusivity required, with digital warranty and technical and sales support.',
  },
  de: {
    title: 'Autohaus-Programm',
    description: 'Steigern Sie Ihre Marge bei jeder Neuwagenübergabe mit dem Kristall-Tönungsprogramm: ohne Exklusivität, mit digitaler Garantie sowie technischem und kaufmännischem Support.',
  },
  pt: {
    title: 'Programa para Concessionárias',
    description:
      'Some uma margem premium a cada entrega de zero-quilômetro com o programa de insulfilm Kristall: sem exclusividade, com garantia digital e suporte técnico e comercial.',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const m = pageMeta[locale] ?? pageMeta.es
  return {
    title: m.title,
    description: m.description,
    alternates: buildAlternates('/concesionarias', locale),
    openGraph: { title: `${m.title} | Kristall Film`, description: m.description, url: `https://kristallfilm.com/${locale}/concesionarias`, images: [DEFAULT_OG_IMAGE] },
  }
}

export default async function ConcesionariasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <>
      <ConcesionariasHero />
      <ConcesionariasNegocio />
      <ConcesionariasEquipamiento />
      <ConcesionariasRequisitos />
      <ConcesionariasCTA />
    </>
  )
}
