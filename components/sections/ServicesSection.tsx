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

// Fondo de la columna de software: negro, con grid de líneas finas y un radial
// negro en el centro (oscurece el centro para que el texto se lea limpio y el
// grid quede más visible hacia los bordes).
const promoBg: React.CSSProperties = {
  backgroundColor: '#0A0A0A',
  backgroundImage:
    'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.85) 0%, rgba(10,10,10,0) 55%), ' +
    'linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), ' +
    'linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)',
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
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[35fr_65fr] gap-2">
        {/* Columna 1: promoción del software */}
        <div
          className="relative rounded-xl overflow-hidden h-[420px] md:h-[520px] flex items-center justify-center p-8"
          style={promoBg}
        >
          <div className="relative z-10 text-center max-w-[340px]">
            <div className="w-11 h-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center mx-auto mb-4">
              <Monitor size={18} className="text-white/60" />
            </div>
            <h3
              className="text-xl md:text-2xl font-medium text-white mb-2 tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {t('svc2_title')}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed mb-5">
              {t('svc2_desc')}
            </p>
            <Link
              href="/contacto?servicio=software"
              className="inline-block text-sm border border-white/20 text-white bg-white/[0.06] px-5 py-2.5 rounded-lg font-medium tracking-wide hover:bg-white/[0.12] transition-all duration-200"
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
                  className="btn-primary text-white px-6 py-3 rounded-lg text-[15px] font-medium tracking-wide transition-all"
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
