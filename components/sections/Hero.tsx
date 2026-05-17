'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion } from 'framer-motion'


const filmCards = [
  { name: 'KLAR KPRO05', sub: 'Alta protección UV', tint: '#0a0a0a', opacity: 0.5, transparent: false },
  { name: 'KRYPTON KS4', sub: 'Calidad nanoceramica de seguridad', tint: '#0a0a0a', opacity: 0.2, transparent: false },
  { name: 'PPF', sub: 'Protección transparente de pintura', tint: null, opacity: 0, transparent: true },
]

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden px-6">
      {/* Background Image */}
      <Image
        src="/porsche.png"
        fill
        alt=""
        priority
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

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
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}
      >
        {t('headline')}
      </motion.h1>

      {/* Subheadline */}
      <motion.p 
        className="text-[15px] text-white/70 max-w-[420px] leading-relaxed mt-5 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {t('subheadline')}
      </motion.p>

      {/* Buttons */}
      <motion.div 
        className="flex gap-3 mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Link
          href="/productos"
          className="bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium tracking-wide hover:opacity-80 transition-opacity"
        >
          {t('cta_primary')}
        </Link>
        <Link
          href="/carrito"
          className="border border-white/40 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0A0A0A] transition-all duration-200"
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
              className={`border border-[0.5px] border-white/15 rounded-lg p-3 transition-all duration-200 ${
                card.transparent
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-black/30 backdrop-blur-sm hover:bg-black/40'
              }`}
            >
              {card.transparent ? (
                <div className="h-14 rounded mb-2 border border-white/10" />
              ) : (
                <div className="h-14 rounded mb-2" style={{ backgroundColor: card.tint!, opacity: card.opacity }} />
              )}
              <div className="text-xs text-white/70 mb-0.5">{card.name}</div>
              <div className="text-[10px] text-white/50">{card.sub}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Watermark */}
      <div 
        className="absolute bottom-4 right-[-8px] text-[88px] text-white/[0.06] select-none pointer-events-none leading-none"
        style={{ fontFamily: 'var(--font-brand)', fontWeight: 900, letterSpacing: '0.15em' }}
      >
        KRISTALL
      </div>
      </motion.div>
    </section>
  )
}
