'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ContactCTA() {
  const t = useTranslations('cta')
  const [email, setEmail] = useState('')

  return (
    <section className="relative overflow-hidden px-6 min-h-[50vh] flex items-center" style={{ borderTop: '0.5px solid #E4E4E2' }}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/futermail.png"
          fill
          alt=""
          className="object-cover object-bottom"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <motion.div 
        className="relative z-10 max-w-[1160px] mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Izquierda */}
        <div>
          <h2
            className="text-2xl font-medium text-white mb-1.5 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-[16px] text-white/70">
            {t('subtitle')}
          </p>
        </div>

        {/* Derecha: Form */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="border border-white/30 rounded-lg px-3 py-2.5 text-base bg-white/10 text-white placeholder:text-white/40 flex-1 md:w-72 outline-none focus:border-white/70 transition-colors backdrop-blur-sm"
          />
          <button className="bg-white text-[#0A0A0A] px-6 py-2.5 rounded-lg text-[16px] font-medium tracking-wide hover:bg-white/90 transition-opacity flex-shrink-0">
            {t('button')}
          </button>
        </div>
      </div>
      </motion.div>
    </section>
  )
}
