import PuntoHero from '@/components/sections/punto/PuntoHero'
import PuntoPillars from '@/components/sections/punto/PuntoPillars'
import PuntoCTA from '@/components/sections/punto/PuntoCTA'

export const revalidate = 3600

export default function PuntoKristallPage() {
  return (
    <>
      <PuntoHero />
      <PuntoPillars />
      <PuntoCTA />
    </>
  )
}
