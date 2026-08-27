'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Monitor } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Phase = 'none' | 'kaiser' | 'ppf'

// Marcas de tiempo (segundos del video). El fin del PPF se calcula en runtime
// como duración − 0.5 para no depender de la duración exacta del archivo.
const KAISER_IN = 1.5
const KAISER_OUT = 4.0
const PPF_IN = 4.0

const GESTIONA_TEXT =
  'tus compras, tu stock, tus instalaciones, tus clientes, tu garantía y la garantía de tus clientes, tus ingresos, tu agenda, '

/**
 * Ticker autoplay (no atado al scroll, a diferencia de CategoryLineMarquee):
 * misma técnica de scrollLeft + rAF que StatsRow, en bucle constante.
 */
function InfiniteTicker({ text }: { text: string }) {
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
        <span key={i} className="shrink-0 text-xs text-white/80">
          {text}
        </span>
      ))}
    </div>
  )
}

export default function ServicesSection() {
  const t = useTranslations('services')
  const videoRef = useRef<HTMLVideoElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState<Phase>('none')
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const panel = panelRef.current
    if (!video || !panel) return

    let raf = 0
    let started = false

    const loop = () => {
      const tt = video.currentTime
      const dur = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8
      const ppfOut = dur - 0.5
      let next: Phase = 'none'
      if (tt >= KAISER_IN && tt < KAISER_OUT) next = 'kaiser'
      else if (tt >= PPF_IN && tt < ppfOut) next = 'ppf'
      setPhase((p) => (p === next ? p : next))
      raf = requestAnimationFrame(loop)
    }

    // Arrancamos el video (y el timeline) recién cuando la sección entra en
    // viewport, para que se vea desde el segundo 0 y no consuma ancho de banda
    // mientras el usuario está arriba del fold.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started) {
          started = true
          try { video.currentTime = 0 } catch {}
          video.play().catch(() => {})
          raf = requestAnimationFrame(loop)
          io.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    io.observe(panel)

    const onEnded = () => {
      cancelAnimationFrame(raf)
      setPhase('none')
      setEnded(true)
    }
    video.addEventListener('ended', onEnded)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-2">
        {/* Columna 1: promoción del software */}
        <div className="flex flex-col items-start justify-center h-[420px] md:h-[520px] p-8">
          <div className="text-left max-w-[340px]">
            <div className="w-11 h-11 rounded-xl bg-[#0A0A0A] flex items-center justify-center mb-4">
              <Monitor size={18} className="text-white" />
            </div>
            <h3
              className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('svc2_title')}
            </h3>
            <p className="text-sm text-[#5C5C5C] leading-relaxed mb-5">
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

        {/* Columna 2: panel de video (Fase A) */}
        <motion.div
          ref={panelRef}
          className="relative rounded-xl overflow-hidden h-[420px] md:h-[520px] bg-[#1A1A1A]"
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
        >
          {/* Video de fondo */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/cat/video.mp4"
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          />

          {/* Overlay negro transparente */}
          <div className="absolute inset-0 bg-black/35 pointer-events-none" />

          {/* "GESTIONA:" + ticker infinito, persistente durante toda la reproducción */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 w-[180px] md:w-[200px] text-right">
            <p className="text-white text-xs font-bold tracking-widest mb-1.5 [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]">
              GESTIONA:
            </p>
            <InfiniteTicker text={GESTIONA_TEXT} />
          </div>

          {/* Overlays animados durante la reproducción */}
          <AnimatePresence>
            {phase === 'kaiser' && (
              <motion.div
                key="kaiser"
                className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex flex-col items-end text-right gap-2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <Image
                  src="/cat/KAISER.png"
                  alt="KAISER"
                  width={134}
                  height={25}
                  className="brightness-0 invert"
                />
                <motion.p
                  className="text-white font-medium text-sm md:text-lg max-w-[200px] md:max-w-[260px] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {t('video_kaiser')}
                </motion.p>
              </motion.div>
            )}

            {phase === 'ppf' && (
              <motion.div
                key="ppf"
                className="absolute top-6 left-6 md:top-8 md:left-8 flex flex-col items-start text-left gap-2"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <Image
                  src="/cat/PPF.png"
                  alt="PPF"
                  width={110}
                  height={25}
                  className="brightness-0 invert"
                />
                <motion.p
                  className="text-white font-medium text-sm md:text-lg max-w-[200px] md:max-w-[260px] [text-shadow:0_1px_12px_rgba(0,0,0,0.7)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                >
                  {t('video_ppf')}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón al terminar la reproducción */}
          <AnimatePresence>
            {ended && (
              <motion.div
                key="cta"
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Link
                  href="/productos"
                  className="btn-primary text-white px-6 py-3 rounded-lg text-[16px] font-medium tracking-wide transition-all"
                >
                  {t('video_cta')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
