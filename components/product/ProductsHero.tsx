'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

const HERO_IMAGES = [
  '/cat/top-KLAR.jpg',
  '/cat/top-KARBON.jpg',
  '/cat/top-KERAMX.jpg',
  '/cat/top-KRYPTON.jpg',
  '/cat/top-PPF.jpg',
  '/cat/top-VITRAL.jpg',
]

export default function ProductsHero() {
  const t = useTranslations('products_page')
  const [current, setCurrent] = useState(0)
  const [next, setNext] = useState(1)
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIdx = (current + 1) % HERO_IMAGES.length
      setNext(nextIdx)
      setTransitioning(true)
      setTimeout(() => {
        setCurrent(nextIdx)
        setTransitioning(false)
      }, 800)
    }, 4000)
    return () => clearInterval(interval)
  }, [current])

  const goTo = (idx: number) => {
    if (idx === current || transitioning) return
    setNext(idx)
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(idx)
      setTransitioning(false)
    }, 800)
  }

  return (
    <section className="relative h-[420px] overflow-hidden">
      {/* Imagen actual */}
      <Image
        src={HERO_IMAGES[current]}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Imagen siguiente — fade in */}
      <div
        className="absolute inset-0 transition-opacity duration-[800ms]"
        style={{ opacity: transitioning ? 1 : 0 }}
      >
        <Image
          src={HERO_IMAGES[next]}
          alt=""
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/40 to-black/15" />

      {/* Contenido */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-12 px-10 max-w-[1160px] mx-auto">
        <p className="section-label mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          {t('hero_label')}
        </p>

        <h1
          className="font-medium text-white mb-3 max-w-[520px]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 500,
            letterSpacing: '-0.02em',
          }}
        >
          {t('hero_headline')}
        </h1>

        <p className="text-sm text-white/50 max-w-[400px] leading-relaxed">
          {t('hero_subheadline')}
        </p>

        {/* Indicadores */}
        <div className="flex gap-1.5 mt-6">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                idx === current ? 'bg-white' : 'bg-white/30 cursor-pointer'
              }`}
              aria-label={`Imagen ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
