'use client'

import { useEffect, useRef } from 'react'

const SRC = '/catalogo-propuesta/hero.mp4'

type Conexion = { saveData?: boolean; effectiveType?: string }

/**
 * Fondo del hero. El HTML trae solo el póster (el primer cuadro del video, 25 KB);
 * el video se pide recién cuando la página terminó de cargar y el navegador
 * está libre. Medido con Lighthouse en celular: con el video en el HTML, sus
 * bytes competían con todo lo demás y el primer pintado se iba a ~7 s.
 *
 * Se queda en el póster si el usuario pidió menos movimiento, si tiene el ahorro
 * de datos prendido o si la red es 2G — el video es decoración. En 3G sí se
 * carga: pesa 204 KB y llega después de todo lo demás, y Chrome reporta "3g"
 * con facilidad en redes móviles que andan bien.
 */
export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const conexion = (navigator as Navigator & { connection?: Conexion }).connection
    if (conexion?.saveData || /2g$/.test(conexion?.effectiveType ?? '')) return

    let idle = 0
    let timer = 0
    const reproducir = () =>
      video.play().catch(() => {
        // Autoplay bloqueado (modo ahorro de batería en iOS, por ejemplo): queda el póster.
      })
    const arrancar = () => {
      video.muted = true
      video.src = SRC
      if (document.visibilityState === 'visible') reproducir()
    }
    // Chrome pausa los videos de páginas ocultas: si el usuario salió a otra app
    // (pasa mucho en el navegador de Instagram) se retoma al volver.
    const alVolver = () => {
      if (document.visibilityState === 'visible' && video.src && video.paused) reproducir()
    }
    document.addEventListener('visibilitychange', alVolver)
    const cuandoEsteLibre = () => {
      // Safari no tiene requestIdleCallback.
      if (typeof window.requestIdleCallback === 'function') idle = window.requestIdleCallback(arrancar, { timeout: 2000 })
      else timer = window.setTimeout(arrancar, 300)
    }

    if (document.readyState === 'complete') cuandoEsteLibre()
    else window.addEventListener('load', cuandoEsteLibre, { once: true })

    return () => {
      window.removeEventListener('load', cuandoEsteLibre)
      document.removeEventListener('visibilitychange', alVolver)
      if (idle) window.cancelIdleCallback(idle)
      if (timer) window.clearTimeout(timer)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="absolute inset-0 -z-20 h-full w-full object-cover"
      poster="/catalogo-propuesta/hero-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
    />
  )
}
