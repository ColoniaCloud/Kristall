'use client'

import { useTranslations } from 'next-intl'
import { useState, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'

export default function ContactCTA() {
  const t = useTranslations('cta')
  const [email, setEmail] = useState('')
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-t border-[0.5px] border-b border-[0.5px] border-[#E4E4E2] px-6 min-h-[50vh] flex items-center">
      {/* Background Image con parallax */}
      <motion.div className="absolute inset-[-2px]" style={{ y: imageY, transformOrigin: 'center bottom' }}>
        <Image
          src="/futermail.png"
          fill
          alt=""
          className="object-cover object-bottom"
        />
      </motion.div>
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
          <p className="text-[15px] text-white/70">
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
            className="border border-white/30 rounded-lg px-3 py-2.5 text-[15px] bg-white/10 text-white placeholder:text-white/40 flex-1 md:w-72 outline-none focus:border-white/70 transition-colors backdrop-blur-sm"
          />
          <button className="bg-white text-[#0A0A0A] px-6 py-2.5 rounded-lg text-[15px] font-medium tracking-wide hover:bg-white/90 transition-opacity flex-shrink-0">
            {t('button')}
          </button>
        </div>
      </div>
      </motion.div>
    </section>
  )
}
