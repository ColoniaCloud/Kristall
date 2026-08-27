'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { motion, type Variants } from 'framer-motion'

const wordContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

const logoVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut', delay: 0.5 },
  },
}

/** Anuncio de la futura línea de exterior para arquitectura — se repite igual en varias páginas. */
export default function ExteriorComingSoon() {
  const t = useTranslations('products')
  const words = t('exterior_title').split(' ')

  return (
    <section
      className="relative overflow-hidden px-6 h-[380px] md:h-[460px] flex items-center"
      style={{ borderTop: '0.5px solid #E4E4E2' }}
    >
      <Image src="/exterior.jpg" alt="" fill className="object-cover object-center" />

      {/* Overlay: gradiente horizontal, más opaco a la izquierda (donde va el texto) */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(100deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.25) 100%)' }}
      />

      <div className="relative z-10 w-full max-w-[1160px] mx-auto">
        <motion.h2
          className="font-medium text-white mb-5 max-w-[560px]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)',
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
          variants={wordContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {words.flatMap((word, i) => [
            i > 0 ? ' ' : null,
            <motion.span key={i} variants={wordVariants} className="inline-block">
              {word}
            </motion.span>,
          ])}
        </motion.h2>

        <motion.img
          src="/cat/logob.svg"
          alt="Kristall Film"
          className="h-7 md:h-8 w-auto"
          variants={logoVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        />
      </div>
    </section>
  )
}
