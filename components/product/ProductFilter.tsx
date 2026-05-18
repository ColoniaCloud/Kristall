'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { CATEGORIES } from '@/types/product'

export default function ProductFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('categoria') ?? ''
  const t = useTranslations('products_page')

  const allCategories = [
    { value: '', label: t('filter_todos') },
    ...CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
  ]

  const setFilter = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('categoria', value)
      } else {
        params.delete('categoria')
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setFilter(cat.value)}
          className={`text-xs font-medium px-4 py-1.5 rounded-full transition-colors ${
            active === cat.value
              ? 'bg-[#0A0A0A] text-white'
              : 'border border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
