'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const lineVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

/** Anuncio del futuro Show Room — sección corta con video de fondo, antes del grid de líneas. */
export default function ShowRoomComingSoon() {
  const t = useTranslations('showroom_teaser')
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    // Arrancamos el video recién cuando la sección entra en viewport, mismo
    // patrón que ServicesSection.
    //
    // Con `preload="none"` el play() tiene que disparar la descarga, así que un
    // solo intento es frágil: si el navegador lo rechaza —política de autoplay,
    // o el ahorro de energía que pausa video muteado cuando la pestaña no está en
    // primer plano— antes se cortaba el observer igual y el video quedaba
    // congelado para siempre. Ahora solo dejamos de intentar cuando la
    // reproducción arrancó de verdad, y reintentamos al volver la pestaña al
    // frente.
    let started = false
    const tryPlay = () => {
      if (started) return
      video.play().then(() => { started = true }).catch(() => {})
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) tryPlay()
      },
      { threshold: 0.35 },
    )
    io.observe(section)
    document.addEventListener('visibilitychange', tryPlay)

    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', tryPlay)
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden mb-8 h-[220px] md:h-[280px] bg-[#1A1A1A]">
      {/* Video de fondo — object-top: recorta desde abajo, donde el clip tiene
          una marca de agua chica que no queremos mostrar.

          preload="none": son 3.5 MB de video decorativo. Con "auto" el navegador
          lo bajaba entero en cada carga del home, también en celular, aunque el
          visitante nunca llegara a esta sección. El IntersectionObserver de
          arriba dispara el play() —y con él la descarga— solo si entra en
          viewport. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-top"
        src="/sr.mp4"
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      />

      {/* Overlay oscuro (translúcido, no opaco) para legibilidad del texto */}
      <div className="absolute inset-0 bg-black/65" />

      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        <motion.p
          variants={lineVariants}
          className="font-medium text-white text-2xl md:text-4xl tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {t('title')}
        </motion.p>
        <motion.p variants={lineVariants} className="mt-2 font-normal text-white/70 text-sm md:text-base">
          {t('location')}
        </motion.p>
      </motion.div>
    </section>
  )
}
