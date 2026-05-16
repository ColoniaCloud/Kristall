import ServicesHero from '@/components/sections/services/ServicesHero'
import ServicesConcessionaire from '@/components/sections/services/ServicesConcessionaire'
import ServicesPolarizedApp from '@/components/sections/services/ServicesPolarizedApp'
import ServicesComparison from '@/components/sections/services/ServicesComparison'
import ServicesCTA from '@/components/sections/services/ServicesCTA'

export default function ServiciosPage() {
  return (
    <>
      <ServicesHero />
      <ServicesConcessionaire />
      <ServicesPolarizedApp />
      <ServicesComparison />
      <ServicesCTA />
    </>
  )
}

