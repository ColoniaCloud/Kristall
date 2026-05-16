'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactCTA() {
  const t = useTranslations('cta')
  const [email, setEmail] = useState('')

  return (
    <section className="bg-[#FFFFFF] border-t border-[0.5px] border-b border-[0.5px] border-[#E4E4E2] px-6 py-10">
      <motion.div 
        className="max-w-[1160px] mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <div className="flex justify-between items-center gap-6">
        {/* Izquierda */}
        <div>
          <h2 
            className="text-xl font-medium text-[#0A0A0A] mb-1.5 tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h2>
          <p className="text-sm text-[#5C5C5C]">
            {t('subtitle')}
          </p>
        </div>

        {/* Derecha: Form */}
        <div className="flex gap-2 items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('placeholder')}
            className="border border-[#C8C8C4] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] w-48 outline-none focus:border-[#0A0A0A] transition-colors"
          />
          <button className="bg-[#0A0A0A] text-white px-6 py-2.5 rounded-lg text-sm font-medium tracking-wide hover:opacity-85 transition-opacity">
            {t('button')}
          </button>
        </div>
      </div>
      </motion.div>
    </section>
  )
}
