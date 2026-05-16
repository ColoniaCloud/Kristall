import Hero from '@/components/sections/Hero'
import StatsRow from '@/components/sections/StatsRow'
import BrandStory from '@/components/sections/BrandStory'
import ProductsGrid from '@/components/sections/ProductsGrid'
import ServicesSection from '@/components/sections/ServicesSection'
import ContactCTA from '@/components/sections/ContactCTA'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsRow />
      <BrandStory />
      <ProductsGrid />
      <ServicesSection />
      <ContactCTA />
    </>
  )
}
