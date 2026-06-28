import PropuestaVidrieriasHero from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasHero'
import PropuestaVidrieriasModelos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasModelos'
import PropuestaVidrieriasProductos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasProductos'
import PropuestaVidrieriasGarantia from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasGarantia'
import PropuestaVidrieriasPasos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasPasos'
import PropuestaVidrieriasCTA from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasCTA'

export const revalidate = 3600

export default function PropuestaVidrieriasPage() {
  return (
    <>
      <PropuestaVidrieriasHero />
      <PropuestaVidrieriasModelos />
      <PropuestaVidrieriasProductos />
      <PropuestaVidrieriasGarantia />
      <PropuestaVidrieriasPasos />
      <PropuestaVidrieriasCTA />
    </>
  )
}
