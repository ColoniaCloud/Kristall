import PuntoHero from '@/components/sections/punto/PuntoHero'
import PuntoPillars from '@/components/sections/punto/PuntoPillars'
import PuntoDetalle from '@/components/sections/punto/PuntoDetalle'
import PuntoCTA from '@/components/sections/punto/PuntoCTA'

export const revalidate = 3600

export default function PuntoKristallPage() {
  return (
    <>
      <PuntoHero />
      <PuntoPillars />
      <PuntoDetalle />
      <PuntoCTA />
    </>
  )
}
