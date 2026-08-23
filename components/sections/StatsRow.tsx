'use client'

/**
 * Pese al nombre del archivo, esto es la barra de logos de línea debajo del
 * hero (quedó así de un diseño anterior). Carrusel infinito auto-scroll con
 * las 16 líneas del catálogo — a diferencia de ProductsGrid.HOME_LINES (una
 * selección curada de 8), acá van todas: es la vidriera completa.
 */
import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { LINEAS, lineaLogoSrc } from '@/lib/catalogo'

// Duplicado para el loop infinito: el scroll resetea al llegar a la mitad.
const loopedLineas = [...LINEAS, ...LINEAS]

export default function StatsRow() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef<number>(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    let pos = 0
    const speed = 0.5 // px por frame

    const step = () => {
      if (!pausedRef.current && el) {
        pos += speed
        // Reset al llegar a la mitad (primer set de items)
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
    <div className="bg-white border-b border-[0.5px] border-[#E4E4E2] shrink-0">
      {/* max-w-[1160px]: mismo ancho de contenido que el resto del sitio. El
          overflow-hidden + degradé en los bordes contiene el carrusel dentro
          de ese ancho aunque la tira de logos, duplicada, sea más ancha. */}
      <div
        className="relative max-w-[1160px] mx-auto"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)', maskImage: 'linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)' }}
      >
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden cursor-grab active:cursor-grabbing select-none px-6"
          style={{ scrollbarWidth: 'none' }}
        >
          {loopedLineas.map((linea, i) => (
            <Link
              key={`${linea.slug}-${i}`}
              href={`/productos/lineas/${linea.slug}`}
              className="group flex-shrink-0 w-28 sm:w-32 h-16 flex items-center justify-center px-3 transition-all duration-200 hover:bg-[#F2F2F0]"
              draggable={false}
              tabIndex={i < LINEAS.length ? 0 : -1}
              aria-hidden={i >= LINEAS.length}
            >
              <div className="relative w-full h-7">
                <Image
                  src={lineaLogoSrc(linea.slug)}
                  alt={linea.nombre}
                  fill
                  sizes="128px"
                  className="object-contain grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-300 pointer-events-none"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
