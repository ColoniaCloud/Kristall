import { useEffect, useRef } from 'react'

// Máscara de desvanecimiento en los bordes: el contenido se pierde contra el
// fondo antes de llegar al límite del contenedor de 1160px.
export const edgeFadeStyle: React.CSSProperties = {
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
  maskImage: 'linear-gradient(to right, transparent, black 48px, black calc(100% - 48px), transparent)',
}

/**
 * Traduce el scroll vertical de la página en desplazamiento horizontal del
 * track (loop infinito por duplicación de contenido + wrap por módulo, misma
 * técnica que StatsRow pero atada al scroll en vez de un rAF con velocidad
 * constante). `direction` invierte el sentido entre filas (ej. título vs.
 * logos en CategoryLineMarquee).
 *
 * El offset "real" (target) se mueve 1:1 con el scroll para que la relación
 * sea fiel; lo que se pinta en pantalla (current) persigue a ese target con
 * lerp en un rAF continuo, dando una sensación más suave/amortiguada en vez
 * de un desplazamiento rígido cuadro a cuadro con el evento de scroll.
 */
export function useScrollTrack(direction: 1 | -1, smoothing = 0.09) {
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
