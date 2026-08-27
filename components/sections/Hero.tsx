'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

const fadeInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export default function Hero() {
  const t = useTranslations('hero')

  return (
    <section className="relative overflow-hidden px-6 h-[50vh] flex flex-col justify-center bg-[#0A0A0A]">
      {/* Imagen de fondo */}
      <Image
        src="/cat/hero.webp"
        alt="Lámina de control solar Kristall Film aplicada en vehículo"
        fill
        priority
        className="object-cover object-center"
      />
      {/* Overlay: gradiente horizontal (levemente diagonal), más opaco a la
          izquierda y más transparente a la derecha, sin llegar a transparencia total */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.25) 100%)' }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1160px] mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="tracking-tight mb-6 text-white"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3.4rem, 6.12vw, 5.44rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
          }}
        >
          <span className="block" style={{ fontWeight: 600 }}>{t('headline_line1')}</span>
          <span className="block" style={{ fontWeight: 400 }}>{t('headline_line2')}</span>
        </motion.h1>

        {/* Logo + CTAs, misma altura */}
        <div className="flex flex-wrap items-center gap-6">
          <motion.div variants={fadeInLeftVariants}>
            <img
              src="/cat/logob.svg"
              alt="Kristall Film"
              className="h-12 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
            />
          </motion.div>
          <div className="flex flex-wrap items-center gap-3">
            <motion.div variants={itemVariants}>
              <Link
                href="/productos"
                className="btn-primary h-12 flex items-center text-white px-6 rounded-lg text-[16px] font-medium tracking-wide transition-all"
              >
                {t('cta_primary')}
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link
                href="/contacto"
                className="h-12 flex items-center border border-white/50 text-white px-6 rounded-lg text-[16px] font-medium hover:bg-[#0A0A0A] hover:border-[#0A0A0A] hover:text-white transition-all duration-200"
              >
                {t('cta_secondary')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
