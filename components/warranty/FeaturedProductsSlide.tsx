'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { lineaDestacadaSrc } from '@/lib/catalogo'

// Selección curada (autos + arquitectura) de líneas con foto destacada.
const SLIDES = ['klass', 'krypton', 'kaiser', 'ppf', 'kreflect-silver']

/** Slide de fotos destacadas de producto, auto-avance con crossfade. */
export default function FeaturedProductsSlide() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative h-[300px] md:h-[380px] w-full overflow-hidden bg-[#1A1A1A]">
      {SLIDES.map((slug, i) => (
        <Image
          key={slug}
          src={lineaDestacadaSrc(slug)}
          alt=""
          fill
          priority={i === 0}
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-opacity duration-1000 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}

      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  )
}
