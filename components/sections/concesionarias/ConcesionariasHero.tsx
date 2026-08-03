'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'

export default function ConcesionariasHero() {
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  const item = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  })

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A]">
      <Image
        src="/porsche.png"
        alt="Concesionaria"
        fill
        className="absolute inset-0 object-cover object-center opacity-25"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      <div className="relative z-10 max-w-[1160px] mx-auto px-10 pt-20 pb-[72px]">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6" style={item(0)}>
          <div className="flex h-[14px] w-6 overflow-hidden rounded-[2px] flex-shrink-0">
            <div className="flex-1 bg-[#1A1A1A]" />
            <div className="flex-1 bg-[#CC0000]" />
            <div className="flex-1 bg-[#E6A800]" />
          </div>
          <span className="text-[12px] font-medium uppercase tracking-[0.1em] text-white/35">
            Programa para concesionarias
          </span>
        </div>

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-[#E6A800]/10 border border-[#E6A800]/20 rounded-full px-4 py-1.5 mb-6"
          style={item(80)}
        >
          <span className="w-2 h-2 rounded-full bg-[#E6A800]" />
          <span className="text-xs text-[#E6A800]/80">Sin exclusividad</span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold leading-tight text-white mb-10"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.525rem, 5vw, 4rem)',
            ...item(160),
          }}
        >
          Sumá más margen
          <span className="block text-[#E6A800]">a cada entrega de 0km.</span>
        </h1>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap" style={item(260)}>
          <Link
            href="/contacto?canal=concesionarias"
            className="btn-primary text-white px-7 py-3 rounded-lg text-sm font-medium transition-all"
          >
            Sumar mi concesionaria
          </Link>
          <Link
            href="/productos"
            className="border border-white/20 text-white/60 px-7 py-3 rounded-lg text-sm hover:text-white hover:border-white/40 transition-all"
          >
            Ver gama de productos
          </Link>
        </div>
      </div>
    </section>
  )
}
