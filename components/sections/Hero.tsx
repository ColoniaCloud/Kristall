'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'


export default function Hero() {
  const t = useTranslations('hero')
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const filmCards = [
    { name: 'KRYPTON', sub: 'Seguridad y confort',    badge: 'PREMIUM', bg: 'bg-black/75' },
    { name: 'KAISER',  sub: 'Máxima protección UV',   badge: 'ULTRA',   bg: 'bg-black/40' },
    { name: 'PPF',     sub: 'Protección de pintura',  badge: 'ULTRA',   bg: 'bg-transparent' },
  ]

  return (
    <section ref={sectionRef} className="relative overflow-hidden px-6 bg-[var(--surface)]">
      {/* Background Image con parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ y: imageY, scale: 1.15, transformOrigin: 'center' }}
      >
        <Image
          src="/hero1.png"
          fill
          alt=""
          priority
          className="object-cover object-center"
          style={{ transform: 'scaleX(-1)' }}
        />
      </motion.div>
      {/* Overlay negro semitransparente */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-[1160px] mx-auto pt-16 pb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }} 
        className="font-medium tracking-tight max-w-[520px] mt-5 mb-4 text-white"
        style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: 'clamp(2.2rem, 4vw, 3.7rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('headline')}
      </motion.h1>

      {/* Subheadline */}
      <motion.p 
        className="text-base text-white/75 max-w-[420px] leading-relaxed mt-5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {t('subheadline')}
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex flex-wrap gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/productos"
          className="bg-white text-[#0A0A0A] px-6 py-3 rounded-lg text-[15px] font-medium tracking-wide hover:bg-white/90 transition-opacity"
        >
          {t('cta_primary')}
        </Link>
        <Link
          href="/contacto"
          className="border border-white/50 text-white px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200"
        >
          {t('cta_secondary')}
        </Link>
      </motion.div>

      {/* Film Cards */}
      <motion.div
        className="mt-8 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <div className="grid grid-cols-3 gap-2 max-w-[520px]">
          {filmCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/10 border border-white/40 backdrop-blur-sm rounded-lg p-2 sm:p-3 transition-all duration-200 hover:bg-white/15"
            >
              {/* Film simulation — mismo borde en las 3 para dar relieve */}
              <div className={`h-14 rounded mb-2 border border-white/20 ring-1 ring-inset ring-white/10 ${card.bg}`} />
              <div className="text-sm text-white/90 mb-0.5" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '-0.01em' }}>{card.name}</div>
              <div className="text-xs text-white/60 mb-1.5">{card.sub}</div>
              <span className="inline-block bg-black/80 text-white/70 text-[9px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded">
                {card.badge}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Watermark */}
      <div 
        className="absolute bottom-4 right-[-8px] text-[clamp(2.5rem,12vw,88px)] text-white/[0.07] select-none pointer-events-none leading-none"
        style={{ fontFamily: 'var(--font-brand)', fontWeight: 900, letterSpacing: '0.15em' }}
      >
        KRISTALL
      </div>
      </motion.div>
    </section>
  )
}
