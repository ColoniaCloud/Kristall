'use client'

/**
 * Igual que components/sections/StatsRow.tsx (carrusel infinito de logos de
 * línea) pero con next/link liso en vez del Link de next-intl: las
 * superficies aisladas (/garantia, /cliente) viven fuera del árbol [locale]
 * y no tienen next-intl disponible (ver middleware.ts).
 */
import { useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LINEAS, lineaLogoSrc } from '@/lib/catalogo'

const loopedLineas = [...LINEAS, ...LINEAS]

export default function LineLogosStrip() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let pos = 0
    const speed = 0.5

    const step = () => {
      if (!pausedRef.current && el) {
        pos += speed
        const half = el.scrollWidth / 2
        if (pos >= half) pos = 0
        el.scrollLeft = pos
      }
      animRef.current = requestAnimationFrame(step)
    }

    animRef.current = requestAnimationFrame(step)

    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }

    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume, { passive: true })
    el.addEventListener('mousedown', pause)
    el.addEventListener('mouseup', resume)
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(animRef.current)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('mousedown', pause)
      el.removeEventListener('mouseup', resume)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [])

  return (
    <div className="bg-[#0A0A0A]">
      <div
        className="relative"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)', maskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)' }}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none px-4"
          style={{ scrollbarWidth: 'none' }}
        >
          {loopedLineas.map((linea, i) => (
            <Link
              key={`${linea.slug}-${i}`}
              href={`/productos/lineas/${linea.slug}`}
              className="group flex-shrink-0 w-24 h-14 flex items-center justify-center px-2 transition-all duration-200 hover:bg-white/10"
              draggable={false}
              tabIndex={i < LINEAS.length ? 0 : -1}
              aria-hidden={i >= LINEAS.length}
            >
              <div className="relative w-full h-6">
                <Image
                  src={lineaLogoSrc(linea.slug)}
                  alt={linea.nombre}
                  fill
                  sizes="96px"
                  className="object-contain brightness-0 invert opacity-50 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
