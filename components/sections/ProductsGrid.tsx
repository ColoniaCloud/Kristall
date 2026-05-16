'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { motion, type Variants } from 'framer-motion'
import Image from 'next/image'


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
      href: '/productos/categorias/klar',
      slug: 'klar',
      image: '/cat/KLAR.png',
      name: 'klar_name',
      desc: 'klar_desc',
      badge: 'klar_badge',
    },
    {
      href: '/productos/categorias/karbon',
      slug: 'karbon',
      image: '/cat/KARBON.png',
      name: 'karbon_name',
      desc: 'karbon_desc',
      badge: 'karbon_badge',
    },
    {
      href: '/productos/categorias/keramx',
      slug: 'keramx',
      image: '/cat/KERAMX.png',
      name: 'keramx_name',
      desc: 'keramx_desc',
      badge: 'keramx_badge',
    },
    {
      href: '/productos/categorias/krypton',
      slug: 'krypton',
      image: '/cat/KRYPTON.png',
      name: 'krypton_name',
      desc: 'krypton_desc',
      badge: 'krypton_badge',
    },
    {
      href: '/productos/categorias/ppf',
      slug: 'ppf',
      image: '/cat/PPF.png',
      name: 'ppf_name',
      desc: 'ppf_desc',
      badge: 'ppf_badge',
    },
    {
      href: '/productos/categorias/vitral',
      slug: 'vitral',
      image: '/cat/VITRAL.png',
      name: 'vitral_name',
      desc: 'vitral_desc',
      badge: 'vitral_badge',
    },
  ]

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <Link href={product.href} className="h-full block">
      <div className="bg-white border border-[0.5px] border-[#E4E4E2] rounded-xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)] transition-shadow duration-300 cursor-pointer h-full">
        {/* Imagen sublogo */}
        <div className="h-24 bg-[#F2F2F0] flex items-center justify-center px-4">
          <Image
            src={product.image}
            alt={product.slug}
            width={140}
            height={64}
            className="object-contain h-12 w-auto"
          />
        </div>
        {/* Body */}
        <div className="p-3">
          <h3 className="text-sm font-semibold text-[#0A0A0A] mb-1">
            {t(product.name)}
          </h3>
          <p className="text-[11px] text-[#5C5C5C] leading-relaxed">
            {t(product.desc)}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="inline-block text-[10px] bg-[#F2F2F0] border border-[#E4E4E2] rounded px-1.5 py-0.5 text-[#9A9A9A]">
              {t(product.badge)}
            </span>
            <span className="text-sm text-[#9A9A9A]">→</span>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-baseline mb-6">
        <div className="text-[11px] uppercase tracking-[0.1em] text-[#9A9A9A] font-medium">
          {t('label')}
        </div>
        <Link 
          href="/productos"
          className="text-xs text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
        >
          {t('see_all')} →
        </Link>
      </div>

      {/* Grid 3x2 */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 gap-2"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {products.map((product, index) => (
          <motion.div key={index} variants={cardVariants}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
      </div>
    </section>
  )
}
