'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'
import { getCategoryImage, getCategoryLogo } from '@/lib/categories'

import { useTranslations } from 'next-intl'

export interface ProductCardProps {
  name: string
  category: string
  description: string
  vlt?: number | null
  uv?: number | null
  irr?: number | null
  vlts?: number[]
  sku: string
  inStock: boolean
  slug: string
  badge?: string
}

const badgeClass = "text-[10px] bg-[#F2F2F0] border border-[#E4E4E2] rounded px-1.5 py-0.5 text-[#5C5C5C]"
const varBadgeClass = "text-[11px] font-medium bg-[#0A0A0A]/[0.04] border border-[#0A0A0A]/[0.10] rounded px-2 py-0.5 text-[#0A0A0A]"

export default function ProductCard({
  name, category, description, vlt, uv, irr, vlts, inStock, slug, badge,
}: ProductCardProps) {
  const t = useTranslations('cart')
  const tp = useTranslations('products')
  return (
    <AnimatedBorderCard borderRadius={12} className="h-full">
      <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
        <Link href={`/productos/categorias/${category}`} className="block flex-shrink-0">
          <div className="relative h-48 overflow-hidden group">
            <Image src={getCategoryImage(category)} alt={name} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-3 left-3">
              <div className="relative w-12 h-6">
                <Image src={getCategoryLogo(category)} alt={category} fill className="object-contain object-left brightness-0 invert opacity-80" sizes="48px" />
              </div>
            </div>
          </div>
        </Link>
        <Link href={`/productos/${slug}`} className="flex flex-col flex-1 p-4">
          <div className="relative w-20 h-8 mb-2">
            <Image src={getCategoryLogo(category)} alt={category} fill className="object-contain object-left" sizes="80px" />
          </div>
          <p className="text-[15px] font-medium text-[#6B6B6B] mb-1">{name}</p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-3 flex-1">{description}</p>
          {vlts && vlts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <span className="text-[10px] text-[#9A9A9A]">{tp('available_in')}:</span>
              {vlts.map(v => (
                <span key={v} className={varBadgeClass}>VLT {v}%</span>
              ))}
            </div>
          ) : (vlt != null || uv != null || irr != null) && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {vlt != null && <span className={varBadgeClass}>VLT {vlt}%</span>}
              {uv != null && <span className={varBadgeClass}>UV {uv}%</span>}
              {irr != null && <span className={varBadgeClass}>IRR {irr}%</span>}
            </div>
          )}
          <div className="flex justify-between items-center mt-auto pt-2 border-t border-[#F2F2F0]">
            {!inStock ? (
              <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 rounded px-2 py-0.5">{t('coming_soon')}</span>
            ) : (
              <span className={badgeClass}>{badge}</span>
            )}
            <span className="text-sm text-[#9A9A9A]">→</span>
          </div>
        </Link>
      </div>
    </AnimatedBorderCard>
  )
}