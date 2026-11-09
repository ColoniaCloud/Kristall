import type { Metadata } from 'next'
import { LandingPeru } from '@/components/distribuidores-peru/LandingPeru'

const TITULO_PAGINA = 'Distribuidor Autorizado en Perú — Kristall Film'
const DESCRIPCION =
  'Láminas automotrices y de arquitectura con Garantía Digital en cada instalación y una suite digital para que su red venda más.'

export const metadata: Metadata = {
  title: { absolute: TITULO_PAGINA },
  description: DESCRIPCION,
  openGraph: {
    title: TITULO_PAGINA,
    description: DESCRIPCION,
    url: 'https://kristallfilm.com/distribuidores-peru',
    locale: 'es_PE',
  },
}

export default function DistribuidoresPeruPage() {
  return <LandingPeru />
}
