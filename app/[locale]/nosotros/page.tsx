import Image from 'next/image'
import AboutHero from '@/components/sections/about/AboutHero'
import BrandHistory from '@/components/sections/about/BrandHistory'
import AboutValues from '@/components/sections/about/AboutValues'
import AboutTechnology from '@/components/sections/about/AboutTechnology'
import AboutLayers from '@/components/sections/about/AboutLayers'
import AboutCTA from '@/components/sections/about/AboutCTA'

export default function NosotrosPage() {
  return (
    <>
      <AboutHero />
      <BrandHistory />
      <section className="relative w-full" style={{ height: '70vh' }}>
        <Image
          src="/cat/top-VITRAL.jpg"
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </section>
      <AboutValues />
      <AboutTechnology />
      <AboutLayers />
      <AboutCTA />
    </>
  )
}
