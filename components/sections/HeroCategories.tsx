'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function HeroCategories() {
  const t = useTranslations('home_categories')

  return (
    <section className="px-6 pt-10 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="group rounded-xl bg-white border-[0.5px] border-[#E4E4E2] shadow-[var(--shadow-card)] p-8 transition-colors duration-300 hover:bg-[#0A0A0A]">
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

        <div className="group rounded-xl bg-white border-[0.5px] border-[#E4E4E2] shadow-[var(--shadow-card)] p-8 transition-colors duration-300 hover:bg-[#0A0A0A]">
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
    </section>
  )
}
