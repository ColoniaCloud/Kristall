'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion } from 'framer-motion'

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden px-6 h-[50vh] flex flex-col justify-center bg-[#0A0A0A]">
      {/* Video de fondo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/cat/videohero.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      {/* Overlay negro semitransparente */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1160px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="font-medium tracking-tight max-w-[560px] mb-6 text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3.6vw, 3.2rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Automotive &amp; Architectural window films
        </h1>

        {/* Logo + CTAs, misma altura */}
        <div className="flex flex-wrap items-center gap-6">
          <img src="/cat/logob.svg" alt="Kristall Film" className="h-12 w-auto" />
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/productos"
              className="btn-primary h-12 flex items-center text-white px-6 rounded-lg text-[16px] font-medium tracking-wide transition-all"
            >
              {t('cta_primary')}
            </Link>
            <Link
              href="/contacto"
              className="h-12 flex items-center border border-white/50 text-white px-6 rounded-lg text-[16px] font-medium hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200"
            >
              {t('cta_secondary')}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
