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
    // Standard
    {
      name: t('cat_klass_name'),
      category: 'klass' as const,
      vlt: 5, uv: 99, irr: 60, sku: 'KLASS05', inStock: true,
      vlts: [5, 20, 35],
      badge: t('cat_klass_badge'), slug: 'klass05',
      description: t('cat_klass_desc'),
    },
    {
      name: t('cat_polarizado_name'),
      category: 'klar' as const,
      vlt: 5, uv: 99, irr: 73, sku: 'KPRO05', inStock: true,
      vlts: [5, 20, 35, 50],
      badge: t('cat_polarizado_badge'), slug: 'kpro05',
      description: t('cat_polarizado_desc'),
    },
    // Premium
    {
      name: t('cat_karbon_name'),
      category: 'karbon' as const,
      vlt: 35, uv: 99, irr: 85, sku: 'KARBON35', inStock: true,
      vlts: [5, 20, 35],
      badge: t('cat_karbon_badge'), slug: 'karbon35',
      description: t('cat_karbon_desc'),
    },
    {
      name: t('cat_keramx_name'),
      category: 'keramx' as const,
      vlt: 35, uv: 99, irr: 97, sku: 'KERAMX35', inStock: true,
      vlts: [5, 20, 35, 50],
      badge: t('cat_keramx_badge'), slug: 'keramx35',
      description: t('cat_keramx_desc'),
    },
    // Ultra
    {
      name: t('cat_krypton_name'),
      category: 'krypton' as const,
      vlt: 5, uv: 99, irr: 95, sku: 'KS05', inStock: true,
      vlts: [5, 35, 50, 75],
      badge: t('cat_krypton_badge'), slug: 'ks05',
      description: t('cat_krypton_desc'),
    },
    {
      name: t('cat_kaiser_name'),
      category: 'kaiser' as const,
      vlt: 10, uv: 99, irr: 98, sku: 'KAISER10', inStock: true,
      vlts: [10, 20, 40, 70],
      badge: t('cat_kaiser_badge'), slug: 'kaiser10',
      description: t('cat_kaiser_desc'),
    },
    {
      name: t('cat_ppf_name'),
      category: 'ppf' as const,
      vlt: null, uv: null, irr: null, sku: 'TPUKX', inStock: true,
      vlts: [],
      badge: 'Self-healing', slug: 'tpukx',
      description: t('cat_ppf_desc'),
    },
    {
      name: t('cat_vitral_name'),
      category: 'vitral' as const,
      vlt: null, uv: null, irr: null, sku: 'VITRAL01', inStock: false,
      vlts: [],
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
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
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
