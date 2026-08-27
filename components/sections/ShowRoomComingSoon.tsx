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
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.play().catch(() => {})
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(section)

    return () => io.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden mb-8 h-[220px] md:h-[280px] bg-[#1A1A1A]">
      {/* Video de fondo — object-top: recorta desde abajo, donde el clip tiene
          una marca de agua chica que no queremos mostrar. */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-top"
        src="/sr.mp4"
        muted
        loop
        playsInline
        preload="auto"
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
