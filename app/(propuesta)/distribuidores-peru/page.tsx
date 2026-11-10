import type { Metadata } from 'next'
import { LandingPeru } from '@/components/distribuidores-peru/LandingPeru'
import { PAISES } from '@/components/distribuidores-peru/paises'

const TITULO_PAGINA = PAISES.PE.titulo
const DESCRIPCION =
  'Láminas automotrices y de arquitectura con Garantía Digital en cada instalación y una suite digital para que su red venda más.'

export const metadata: Metadata = {
  title: { absolute: TITULO_PAGINA },
  description: DESCRIPCION,
  openGraph: {
    title: TITULO_PAGINA,
    description: DESCRIPCION,
    url: 'https://kristallfilm.com/distribuidores-peru',
    locale: PAISES.PE.locale,
  },
}

export default function DistribuidoresPeruPage() {
  return <LandingPeru />
}
