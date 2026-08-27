'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Monitor } from 'lucide-react'
import { motion } from 'framer-motion'

const GESTIONA_TEXT =
  'tus compras, tu stock, tus instalaciones, tus clientes, tu garantía y la garantía de tus clientes, tus ingresos, tu agenda, '

/**
 * Ticker autoplay (no atado al scroll, a diferencia de CategoryLineMarquee):
 * misma técnica de scrollLeft + rAF que StatsRow, en bucle constante.
 */
function InfiniteTicker({
  text,
  className,
  style,
}: {
  text: string
  className?: string
  style?: React.CSSProperties
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const animRef = useRef(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let pos = 0
    const speed = 0.5
    const step = () => {
      pos += speed
      const half = el.scrollWidth / 2
      if (pos >= half) pos = 0
      el.scrollLeft = pos
      animRef.current = requestAnimationFrame(step)
    }
    animRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-hidden whitespace-nowrap"
      style={{ scrollbarWidth: 'none' }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className={className} style={style}>
          {text}
        </span>
      ))}
    </div>
  )
}

export default function ServicesSection() {
  const t = useTranslations('services')
  const videoRef = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    // Arrancamos el video recién cuando la sección entra en viewport, para
    // que se vea desde el segundo 0 y no consuma ancho de banda mientras el
    // usuario está arriba del fold.
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
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden px-6 h-[420px] md:h-[520px] bg-[#1A1A1A]"
      initial={{ opacity: 0, scale: 1.02 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {/* Video de fondo — cubre toda la sección, no solo la columna del ticker */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/cat/video.mp4"
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Overlay: gradiente horizontal, más oscuro a la izquierda (donde va el
          texto) para legibilidad, más transparente a la derecha */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.25) 100%)' }}
      />

      <div className="relative z-10 h-full max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-2">
        {/* Columna 1: promoción del software */}
        <div className="flex flex-col items-start justify-center h-full">
          <div className="text-left max-w-[340px]">
            <div className="w-11 h-11 rounded-xl bg-[#0A0A0A] border border-white/15 flex items-center justify-center mb-4">
              <Monitor size={18} className="text-white" />
            </div>
            <h2
              className="text-xl md:text-2xl font-medium text-white mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('svc2_title')}
            </h2>
            <p className="text-sm text-white/70 leading-relaxed mb-5">
              {t('svc2_desc')}
            </p>
            <Link
              href="/contacto?servicio=software"
              className="btn-primary inline-block text-sm text-white px-5 py-2.5 rounded-lg font-medium tracking-wide transition-all"
            >
              {t('svc2_cta')}
            </Link>
          </div>
        </div>

        {/* Columna 2: "GESTIONA:" + ticker infinito — oculta en mobile */}
        <div className="hidden md:flex items-center justify-center px-8">
          <div className="text-center max-w-[480px] w-full">
            <p
              className="text-white text-3xl md:text-5xl mb-3 [text-shadow:0_2px_16px_rgba(0,0,0,0.7)]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
            >
              GESTIONA:
            </p>
            <div className="overflow-hidden">
              <InfiniteTicker
                text={GESTIONA_TEXT}
                className="shrink-0 font-normal text-lg md:text-2xl text-white/85 [text-shadow:0_2px_12px_rgba(0,0,0,0.7)]"
                style={{ fontFamily: 'var(--font-display)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
