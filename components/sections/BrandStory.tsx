'use client'

import { useTranslations } from 'next-intl'
import { Shield, Sun, Layers } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import GermanyFlag from '@/components/common/GermanyFlag'
import { Link } from '@/i18n/routing'


const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
}

export default function BrandStory() {
  const t = useTranslations('brand')

  const mainCards = [
    {
      type: 'light',
      content: (
        <>
          <div className="flex gap-[3px] mb-4">
            <div className="w-5 h-[3px] rounded-sm bg-[#1A1A1A]" />
            <div className="w-5 h-[3px] rounded-sm bg-[#CC0000]" />
            <div className="w-5 h-[3px] rounded-sm bg-[#E6A800]" />
          </div>
          <h3 
            className="text-[17px] font-medium text-[#0A0A0A] mb-3"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('title')}
          </h3>
          <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
            {t('body')}
          </p>
        </>
      )
    },
    {
      type: 'dark',
      content: (
        <>
          <div className="mb-4">
            <GermanyFlag width={48} height={32} />
          </div>
          <div>
            <h4 className="text-base font-medium text-white mb-1.5">
              {t('dark_title')}
            </h4>
            <p className="text-sm text-white/45 leading-relaxed">
              {t('dark_body')}
            </p>
          </div>
        </>
      )
    }
  ]

  const certCards = [
    { icon: Shield, title: 'cert1_title', body: 'cert1_body', animate: { rotate: [0, -8, 8, 0] } },
    { icon: Sun, title: 'cert2_title', body: 'cert2_body', animate: { rotate: 360 } },
    { icon: Layers, title: 'cert3_title', body: 'cert3_body', animate: { y: [-2, 2, -2] } }
  ]

  return (
    <section className="px-6 py-10 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
      {/* Label */}
      <div className="section-label mb-6">
        {t('label')}
      </div>

      {/* Bento grid 2 columns */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2 items-stretch"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Card izquierda */}
        <motion.div 
          className="bg-white border border-[0.5px] border-[#E4E4E2] rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] h-full"
          variants={fadeInUpVariants}
        >
          {mainCards[0].content}
        </motion.div>

        {/* Card derecha (imagen de fondo) */}
        <motion.div 
          className="rounded-xl h-full overflow-hidden flex flex-col justify-end"
          variants={fadeInUpVariants}
          transition={{ delay: 0.1 }}
          style={{
            backgroundImage: 'url(/builds.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            aspectRatio: '16 / 9'
          }}
        >
          <div className="p-4">
            <Link
              href="/contacto"
              className="block w-full bg-[#0A0A0A] text-white text-[15px] font-medium text-center py-3 rounded-lg hover:bg-[#1A1A1A] transition-colors"
            >
              {t('contact_btn')}
            </Link>
          </div>
        </motion.div>

      </motion.div>

      {/* Grid 3 columnas */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-2"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
      >
        {certCards.map((cert, index) => (
          <motion.div 
            key={index}
            className="bg-white border border-[0.5px] border-[#E4E4E2] rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            variants={fadeInUpVariants}
            whileHover="iconAnim"
          >
            <motion.div
              className="mb-3 w-fit"
              variants={{
                iconAnim: {
                  ...cert.animate,
                  transition: { duration: 0.6, ease: 'easeInOut', repeat: cert.icon === Sun ? Infinity : 0 }
                }
              }}
            >
              <cert.icon size={22} className="text-[#9A9A9A]" />
            </motion.div>
            <h4 className="text-base font-medium mb-1" style={{ fontFamily: 'var(--font-display)' }}>{t(cert.title)}</h4>
            <p className="text-xs md:text-sm text-[#9A9A9A] leading-relaxed">
              {t(cert.body)}
            </p>
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  )
}
