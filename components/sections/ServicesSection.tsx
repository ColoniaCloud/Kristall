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

// Fondo de la columna de software: grid de líneas grises oscuras super finas
// con un glow radial en el centro.
const promoBg: React.CSSProperties = {
  backgroundColor: '#F4F4F2',
  backgroundImage:
    'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.8) 0%, rgba(244,244,242,0) 55%), ' +
    'linear-gradient(to right, rgba(10,10,10,0.09) 1px, transparent 1px), ' +
    'linear-gradient(to bottom, rgba(10,10,10,0.09) 1px, transparent 1px)',
  backgroundSize: '100% 100%, 26px 26px, 26px 26px',
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
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
        {/* Columna 1: promoción del software */}
        <div
          className="relative rounded-xl overflow-hidden h-[420px] md:h-[520px] flex items-center justify-center p-8"
          style={promoBg}
        >
          <div className="relative z-10 text-center max-w-[340px]">
            <div className="w-11 h-11 rounded-xl bg-white border border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-center justify-center mx-auto mb-4">
              <Monitor size={18} className="text-[#0A0A0A]" />
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
              className="btn-primary inline-block text-white px-5 py-2.5 rounded-lg text-sm font-medium tracking-wide transition-all"
            >
              {t('svc2_cta')}
            </Link>
          </div>
        </div>

        {/* Columna 2: panel de video (Fase A) */}
        <div
          ref={panelRef}
          className="relative rounded-xl overflow-hidden h-[420px] md:h-[520px] bg-[#1A1A1A]"
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
                  width={180}
                  height={54}
                  className="h-9 md:h-12 w-auto object-contain brightness-0 invert"
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
                  width={180}
                  height={54}
                  className="h-9 md:h-12 w-auto object-contain brightness-0 invert"
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
                  className="bg-white text-[#0A0A0A] px-6 py-3 rounded-lg text-[15px] font-medium tracking-wide hover:bg-white/90 transition-colors"
                >
                  {t('video_cta')}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
