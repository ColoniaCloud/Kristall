import type { Metadata } from 'next'
import Hero from '@/components/catalogo-propuesta/Hero'
import Destacados from '@/components/catalogo-propuesta/Destacados'
import Simulador from '@/components/catalogo-propuesta/Simulador'
import ListaPrecios from '@/components/catalogo-propuesta/ListaPrecios'
import Productos from '@/components/catalogo-propuesta/Productos'
import Recomendador from '@/components/catalogo-propuesta/Recomendador'
import PaginaTurnos from '@/components/catalogo-propuesta/PaginaTurnos'
import Suite from '@/components/catalogo-propuesta/Suite'
import Demo from '@/components/catalogo-propuesta/Demo'
import Cierre from '@/components/catalogo-propuesta/Cierre'
import BarraWhatsApp from '@/components/catalogo-propuesta/BarraWhatsApp'
import { LINEAS, preciosVigentes } from '@/data/lanzamiento'
import { getCotizacionOficial } from '@/lib/cotizacion'

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

export default async function CatalogoPropuestaPage() {
  const vigente = preciosVigentes()
  const cotizacion = vigente ? await getCotizacionOficial() : null

  return (
    <main className="kf-catalogo">
      <Hero />
      <Destacados />
      <Productos lineas={LINEAS} vigente={vigente} />
      <Simulador lineas={LINEAS} />
      <Recomendador lineas={LINEAS} vigente={vigente} />
      <PaginaTurnos />
      <Suite />
      <Demo />
      {/* La lista va al final como resumen: ya vio las láminas, acá compara de un vistazo. */}
      {vigente && <ListaPrecios lineas={LINEAS} cotizacion={cotizacion} />}
      <Cierre vigente={vigente} />
      <BarraWhatsApp />
    </main>
  )
}
