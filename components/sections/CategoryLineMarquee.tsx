'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { lineaLogoSrc, type Linea } from '@/lib/catalogo'

interface CategoryLineMarqueeProps {
  label: string
  lineas: Linea[]
}

// Máscara de desvanecimiento en los bordes: el contenido se pierde contra el
// fondo antes de llegar al límite del contenedor de 1160px.
const edgeFadeStyle: React.CSSProperties = {
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
  maskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
}

/**
 * Traduce el scroll vertical de la página en desplazamiento horizontal del
 * track (loop infinito por duplicación de contenido + wrap por módulo, misma
 * técnica que StatsRow pero atada al scroll en vez de un rAF con velocidad
 * constante). `direction` invierte el sentido entre la fila de texto y la de
 * logos.
 *
 * El offset "real" (target) se mueve 1:1 con el scroll para que la relación
 * sea fiel; lo que se pinta en pantalla (current) persigue a ese target con
 * lerp en un rAF continuo, dando una sensación más suave/amortiguada en vez
 * de un desplazamiento rígido cuadro a cuadro con el evento de scroll.
 */
function useScrollTrack(direction: 1 | -1, smoothing = 0.09) {
  const trackRef = useRef<HTMLDivElement>(null)
  const targetRef = useRef(0)
  const currentRef = useRef(0)
  const halfRef = useRef(0)
  const lastYRef = useRef(0)
  const rafRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const measure = () => {
      halfRef.current = track.scrollWidth / 2
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(track)

    lastYRef.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastYRef.current
      lastYRef.current = y
      targetRef.current += delta * direction
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const loop = () => {
      currentRef.current += (targetRef.current - currentRef.current) * smoothing
      const half = halfRef.current
      if (half > 0) {
        let off = currentRef.current % half
        if (off < 0) off += half
        track.style.transform = `translate3d(${-off}px, 0, 0)`
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafRef.current)
    }
  }, [direction, smoothing])

  return trackRef
}

export default function CategoryLineMarquee({ label, lineas }: CategoryLineMarqueeProps) {
  const titleTrack = useScrollTrack(1)
  const logosTrack = useScrollTrack(-1)

  const titleUnits = Array.from({ length: 8 })
  const loopedLineas = Array.from({ length: 8 }).flatMap(() => lineas)

  return (
    <div className="py-6">
      <div className="overflow-hidden" style={edgeFadeStyle}>
        <div ref={titleTrack} className="flex whitespace-nowrap will-change-transform">
          {titleUnits.map((_, i) => (
            <span
              key={i}
              className="shrink-0 pr-8 text-[clamp(2rem,8vw,64px)] leading-none tracking-tight text-[#9A9A9A]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="font-bold">Kristall</span>{' '}
              <span className="font-normal">{label}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="overflow-hidden mt-3" style={edgeFadeStyle}>
        <div ref={logosTrack} className="flex items-center whitespace-nowrap will-change-transform">
          {loopedLineas.map((linea, i) => (
            <div key={`${linea.slug}-${i}`} className="relative shrink-0 w-20 h-6 mx-5 opacity-40">
              <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain" sizes="80px" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
