import type { Metadata } from 'next'
import Hero from '@/components/catalogo-propuesta/Hero'
import Destacados from '@/components/catalogo-propuesta/Destacados'
import Productos from '@/components/catalogo-propuesta/Productos'
import Suite from '@/components/catalogo-propuesta/Suite'
import Demo from '@/components/catalogo-propuesta/Demo'
import Cierre from '@/components/catalogo-propuesta/Cierre'
import BarraWhatsApp from '@/components/catalogo-propuesta/BarraWhatsApp'
import { diasRestantes, LINEAS, preciosVigentes, VIGENTE_HASTA } from '@/data/lanzamiento'

/**
 * Se regenera cada hora: así el contador de días avanza y, pasado el
 * 1/12/2026, los precios se ocultan solos sin volver a desplegar.
 */
export const revalidate = 3600

const TITULO = 'Lanzamiento Línea Automotriz — Kristall Film'
const DESCRIPCION =
  '8 láminas de tecnología alemana a precio de lanzamiento, garantía digital y un portal para gestionar tu taller.'

export const metadata: Metadata = {
  title: { absolute: TITULO },
  description: DESCRIPCION,
  openGraph: {
    title: TITULO,
    description: DESCRIPCION,
    url: 'https://kristallfilm.com/catalogo-propuesta',
    locale: 'es_AR',
    // JPG estático y liviano: WhatsApp descarta las vistas previas pesadas.
    // Se regenera con scripts/og-catalogo-propuesta.py.
    images: [
      {
        url: 'https://kristallfilm.com/catalogo-propuesta/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Kristall Film — Lanzamiento Línea Automotriz',
      },
    ],
  },
  twitter: { card: 'summary_large_image', images: ['https://kristallfilm.com/catalogo-propuesta/og.jpg'] },
}

export default function CatalogoPropuestaPage() {
  const vigente = preciosVigentes()
  const hasta = VIGENTE_HASTA.toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  return (
    <main className="kf-catalogo">
      <Hero dias={diasRestantes()} vigente={vigente} />
      <Destacados />
      <Productos lineas={LINEAS} vigente={vigente} />
      <Suite />
      <Demo />
      <Cierre vigente={vigente} hasta={hasta} />
      <BarraWhatsApp />
    </main>
  )
}
