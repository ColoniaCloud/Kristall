'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion, type Variants } from 'framer-motion'
import CategoryCard from '@/components/product/CategoryCard'
import { getLine, type LineMeta } from '@/lib/catalogo'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// Orden de exhibición de las categorías en el home.
const HOME_LINES = ['klass', 'klar', 'karbon', 'keramx', 'krypton', 'kaiser', 'ppf', 'vitral']

export default function ProductsGrid() {
  const t = useTranslations('products')

  const items = HOME_LINES
    .map((slug) => getLine(slug))
    .filter((l): l is LineMeta => l != null)

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-6">
          <div className="section-label">{t('label')}</div>
          <Link href="/productos" className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors">
            {t('see_all')} →
          </Link>
        </div>

        {/* Grid de líneas */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {items.map((line) => (
            <motion.div key={line.slug} variants={cardVariants} className="h-full">
              <CategoryCard line={line} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
