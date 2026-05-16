'use client'

import { useTranslations } from 'next-intl'
import { Car, Monitor } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { motion, type Variants } from 'framer-motion'

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export default function ServicesSection() {
  const t = useTranslations('services')

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
      {/* Label */}
      <div className="text-[11px] uppercase tracking-[0.1em] text-[#9A9A9A] font-medium mb-6">
        {t('label')}
      </div>

      {/* Grid 2 columnas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.15 }}
      >
        {/* Card blanca: Concesionarias */}
        <motion.div 
          className="bg-white border border-[0.5px] border-[#E4E4E2] rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]"
          variants={cardVariants}
        >
          <div className="w-10 h-10 rounded-lg bg-[#F2F2F0] border border-[0.5px] border-[#E4E4E2] flex items-center justify-center mb-3.5">
            <Car size={16} className="text-[#5C5C5C]" />
          </div>
          <h3 className="text-[15px] font-medium text-[#0A0A0A] mb-1.5">
            {t('svc1_title')}
          </h3>
          <p className="text-xs text-[#5C5C5C] leading-relaxed mb-3.5">
            {t('svc1_desc')}
          </p>
          <Link
            href="/contacto"
            className="inline-block text-xs border border-[#C8C8C4] px-3.5 py-1.5 rounded-lg hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A] transition-all duration-200"
          >
            {t('svc1_cta')}
          </Link>
        </motion.div>

        {/* Card negra: Software */}
        <motion.div 
          className="bg-[#1A1A1A] rounded-xl p-5"
          variants={cardVariants}
        >
          <div className="w-9 h-9 rounded-lg bg-white/6 border border-white/8 flex items-center justify-center mb-3.5">
            <Monitor size={16} className="text-white/50" />
          </div>
          <h3 className="text-[15px] font-medium text-white mb-1.5">
            {t('svc2_title')}
          </h3>
          <p className="text-xs text-white/45 leading-relaxed mb-3.5">
            {t('svc2_desc')}
          </p>
          <Link
            href="/contacto"
            className="inline-block text-xs border border-white/20 text-white px-3.5 py-1.5 rounded-lg bg-white/6 hover:bg-white/12 transition-all duration-200"
          >
            {t('svc2_cta')}
          </Link>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/25 flex-shrink-0" />
              <span className="text-[11px] text-white/55">{t('svc2_f1')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/25 flex-shrink-0" />
              <span className="text-[11px] text-white/55">{t('svc2_f2')}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-white/25 flex-shrink-0" />
              <span className="text-[11px] text-white/55">{t('svc2_f3')}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </div>
    </section>
  )
}
