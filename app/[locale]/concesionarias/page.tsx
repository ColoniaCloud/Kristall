import ConcesionariasHero from '@/components/sections/concesionarias/ConcesionariasHero'
import ConcesionariasNegocio from '@/components/sections/concesionarias/ConcesionariasNegocio'
import ConcesionariasEquipamiento from '@/components/sections/concesionarias/ConcesionariasEquipamiento'
import ConcesionariasRequisitos from '@/components/sections/concesionarias/ConcesionariasRequisitos'
import ConcesionariasCTA from '@/components/sections/concesionarias/ConcesionariasCTA'

export const revalidate = 3600

export default function ConcesionariasPage() {
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
