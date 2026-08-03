import PropuestaVidrieriasHero from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasHero'
import PropuestaVidrieriasBenefits from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasBenefits'
import PropuestaVidrieriasModelos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasModelos'
import PropuestaVidrieriasProductos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasProductos'
import PropuestaVidrieriasGarantia from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasGarantia'
import PropuestaVidrieriasCompromisos from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasCompromisos'
import PropuestaVidrieriasCTA from '@/components/sections/propuesta-vidrierias/PropuestaVidrieriasCTA'

export const revalidate = 3600

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
