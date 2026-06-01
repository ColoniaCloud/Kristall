'use client'

import { MessageSquare } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

interface ProductActionsProps {
  sku: string
  name: string
  category: string
  inStock: boolean
}

export default function ProductActions({ sku, name, category, inStock }: ProductActionsProps) {
  const t = useTranslations('product_actions')

  if (!inStock) {
    return (
      <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)] sticky top-24">
        <div className="text-center py-4">
          <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 rounded-full px-3 py-1">
            {t('coming_soon_badge')}
          </span>
          <p className="text-xs text-[#9A9A9A] mt-4 leading-relaxed">
            {t('coming_soon_body')}
          </p>
          <Link
            href={`/contacto?producto=${sku}`}
            className="block w-full mt-4 border border-[#E4E4E2] text-[#5C5C5C] px-4 py-3 rounded-lg text-sm hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all text-center"
          >
            {t('consult_availability')}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)] sticky top-24 flex flex-col gap-3">
      <div className="pb-4 border-b border-[#F2F2F0] mb-2">
        <p className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mb-1">{category.toUpperCase()}</p>
        <p className="text-sm font-medium text-[#0A0A0A]">{name}</p>
        <p className="text-sm text-[#9A9A9A] mt-0.5">{t('ref_label')} {sku}</p>
      </div>

      <Link
        href={`/contacto?producto=${sku}`}
        className="btn-primary w-full text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all"
      >
        <MessageSquare size={15} />
        {t('consult_product')}
      </Link>

      <p className="text-[11px] text-[#9A9A9A] text-center leading-relaxed mt-1">
        {t('no_charge')}
      </p>
    </div>
  )
}
