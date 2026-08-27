'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion, type Variants } from 'framer-motion'

// Entrada blur→nítido de la marca de agua. Va en un wrapper aparte del
// <img> (que ya anima su propia opacidad/invert en hover): si el opacity/
// filter de Framer y el de Tailwind conviven en el mismo elemento, el estilo
// inline de Framer le gana por especificidad a la clase de hover y la rompe.
const watermarkVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(16px)' },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: 'easeOut' },
  },
}

export default function HeroCategories() {
  const t = useTranslations('home_categories')

  return (
    <section className="px-6 pt-10 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
        {/* sr-only: no hay título visible acá (el diseño va directo a las dos
            cards), pero la sección necesita su propio h2 para no saltar de
            h1 a h3 sin nivel intermedio. */}
        <h2 className="sr-only">Categorías de producto</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="group relative overflow-hidden rounded-xl bg-white border-[0.5px] border-[#E4E4E2] shadow-[var(--shadow-card)] p-8 transition-colors duration-300 hover:bg-[#0A0A0A]">
            <motion.div
              className="absolute -bottom-6 -right-6 pointer-events-none"
              variants={watermarkVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <img
                src="/cat/SVG/icono-auto.svg"
                alt=""
                className="h-28 w-auto opacity-[0.08] group-hover:opacity-[0.14] group-hover:invert transition-all duration-300"
              />
            </motion.div>
            <div className="relative z-10">
              <h3
                className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-3 tracking-tight transition-colors duration-300 group-hover:text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Automotive
              </h3>
              <p className="text-[15px] text-[#5C5C5C] leading-relaxed max-w-[420px] mb-6 transition-colors duration-300 group-hover:text-white/70">
                {t('automotive_desc')}
              </p>
              <Link
                href="/autos"
                className="inline-flex items-center h-11 px-5 rounded-lg bg-[#0A0A0A] text-white text-[15px] font-medium transition-colors duration-300 group-hover:bg-white group-hover:text-[#0A0A0A]"
              >
                {t('cta_label')}
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-white border-[0.5px] border-[#E4E4E2] shadow-[var(--shadow-card)] p-8 transition-colors duration-300 hover:bg-[#0A0A0A]">
            <motion.div
              className="absolute -bottom-6 -right-6 pointer-events-none"
              variants={watermarkVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <img
                src="/cat/SVG/icono-arqui.svg"
                alt=""
                className="h-28 w-auto opacity-[0.08] group-hover:opacity-[0.14] group-hover:invert transition-all duration-300"
              />
            </motion.div>
            <div className="relative z-10">
              <h3
                className="text-xl md:text-2xl font-medium text-[#0A0A0A] mb-3 tracking-tight transition-colors duration-300 group-hover:text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Architectural
              </h3>
              <p className="text-[15px] text-[#5C5C5C] leading-relaxed max-w-[420px] mb-6 transition-colors duration-300 group-hover:text-white/70">
                {t('architectural_desc')}
              </p>
              <Link
                href="/arquitectura"
                className="inline-flex items-center h-11 px-5 rounded-lg bg-[#0A0A0A] text-white text-[15px] font-medium transition-colors duration-300 group-hover:bg-white group-hover:text-[#0A0A0A]"
              >
                {t('cta_label')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
