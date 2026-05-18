'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion, type Variants } from 'framer-motion'
import ProductCard from '@/components/product/ProductCard'


const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

export default function ProductsGrid() {
  const t = useTranslations('products')

  const products = [
    {
      name: t('cat_polarizado_name'),
      category: 'klar' as const,
      vlt: 5, uv: 99, irr: 73, sku: 'KPRO05', inStock: true,
      badge: t('cat_polarizado_badge'), slug: 'kpro05',
      description: t('cat_polarizado_desc'),
    },
    {
      name: t('cat_karbon_name'),
      category: 'karbon' as const,
      vlt: 20, uv: 99, irr: 85, sku: 'KARBON01', inStock: true,
      badge: t('cat_karbon_badge'), slug: 'karbon01',
      description: t('cat_karbon_desc'),
    },
    {
      name: t('cat_keramx_name'),
      category: 'keramx' as const,
      vlt: 35, uv: 99, irr: 97, sku: 'KERAMX01', inStock: true,
      badge: t('cat_keramx_badge'), slug: 'keramx01',
      description: t('cat_keramx_desc'),
    },
    {
      name: t('cat_krypton_name'),
      category: 'krypton' as const,
      vlt: 15, uv: 99, irr: 95, sku: 'KS4', inStock: true,
      badge: t('cat_krypton_badge'), slug: 'ks4',
      description: t('cat_krypton_desc'),
    },
    {
      name: t('cat_ppf_name'),
      category: 'ppf' as const,
      vlt: null, uv: null, irr: null, sku: 'TPUKX', inStock: true,
      badge: 'Self-healing', slug: 'tpukx',
      description: t('cat_ppf_desc'),
    },
    {
      name: t('cat_vitral_name'),
      category: 'vitral' as const,
      vlt: null, uv: null, irr: null, sku: 'VITRAL01', inStock: false,
      badge: '', slug: 'vitral01',
      description: t('cat_vitral_desc'),
    },
  ]

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-6">
        <div className="section-label">
          {t('label')}
        </div>
        <Link 
          href="/productos"
          className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          {t('see_all')} →
        </Link>
      </div>

      {/* Grid 2x2 */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products.map((product, index) => (
          <motion.div key={index} variants={cardVariants} className="h-full">
            <ProductCard {...product} />
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  )
}
