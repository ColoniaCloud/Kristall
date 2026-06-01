'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import ProductCard from '@/components/product/ProductCard'
import { CATEGORIES } from '@/lib/categories'

export interface ProductItem {
  id: string
  name_es: string
  category: string
  description_es: string
  vlt: number | null
  uv: number | null
  irr: number | null
  sku: string
  inStock: boolean
  slug: string
}

interface ProductsClientProps {
  products: ProductItem[]
}

const btnBase = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors'
const btnActive = 'bg-[#0A0A0A] text-white'
const btnInactive = 'bg-[#F2F2F0] text-[#5C5C5C] hover:bg-[#E8E8E6]'

export default function ProductsClient({ products }: ProductsClientProps) {
  const t = useTranslations('products_page')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeVLT, setActiveVLT] = useState('all')
  const [activeUV, setActiveUV] = useState('all')

  const VLT_OPTIONS = [
    { label: t('filter_todos'), value: 'all' },
    { label: '5%', value: '5' },
    { label: '15%', value: '15' },
    { label: '30%', value: '30' },
    { label: '35%', value: '35' },
    { label: '46%', value: '46' },
    { label: '50%', value: '50' },
    { label: '75%', value: '75' },
    { label: '80%', value: '80' },
    { label: t('filter_sin_vlt'), value: 'none' },
  ]

  const UV_OPTIONS = [
    { label: t('filter_todos'), value: 'all' },
    { label: '99%', value: '99' },
    { label: '92%', value: '92' },
    { label: '81%', value: '81' },
    { label: '56%', value: '56' },
    { label: t('filter_sin_uv'), value: 'none' },
  ]

  const filtered = products.filter(p => {
    const catOk = activeCategory === 'all' || p.category === activeCategory
    const vltOk = activeVLT === 'all' ? true : activeVLT === 'none' ? p.vlt == null : String(p.vlt) === activeVLT
    const uvOk = activeUV === 'all' ? true : activeUV === 'none' ? p.uv == null : String(p.uv) === activeUV
    return catOk && vltOk && uvOk
  })

  const clearFilters = () => {
    setActiveCategory('all')
    setActiveVLT('all')
    setActiveUV('all')
  }

  return (
    <div>
      {/* Barra de filtros sticky */}
      <div className="bg-white border-b border-[#E4E4E2] sticky top-[56px] z-40">
        <div className="px-10 py-4 max-w-[1160px] mx-auto flex flex-col gap-3">

          {/* Fila 1 — Categoría */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_linea')}</span>

            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                activeCategory === 'all'
                  ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                  : 'bg-white border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A]'
              }`}
            >
              {t('filter_todas')}
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  activeCategory === cat.slug
                    ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                    : 'bg-white border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A]'
                }`}
              >
                <div className="relative w-5 h-2.5 flex-shrink-0">
                  <Image
                    src={cat.logo}
                    alt={cat.name}
                    fill
                    className={`object-contain object-left ${activeCategory === cat.slug ? 'brightness-0 invert' : ''}`}
                    sizes="20px"
                  />
                </div>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Fila 2 — VLT y UV */}
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_vlt')}</span>
            {VLT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setActiveVLT(opt.value)}
                className={`${btnBase} ${activeVLT === opt.value ? btnActive : btnInactive}`}
              >
                {opt.label}
              </button>
            ))}

            <div className="w-px h-4 bg-[#E4E4E2] mx-2" />

            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_uv')}</span>
            {UV_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setActiveUV(opt.value)}
                className={`${btnBase} ${activeUV === opt.value ? btnActive : btnInactive}`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Contador */}
          <p className="text-[11px] text-[#9A9A9A]">{filtered.length === 1 ? t('filter_count_one') : t('filter_count_other', { count: filtered.length })}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="px-10 py-10 max-w-[1160px] mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-sm text-[#9A9A9A]">{t('filter_empty')}</p>
            <button
              onClick={clearFilters}
              className="text-xs border border-[#E4E4E2] rounded-lg px-4 py-2 text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all"
            >
              {t('filter_clear')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                name={p.name_es}
                category={p.category}
                description={p.description_es}
                vlt={p.vlt}
                uv={p.uv}
                irr={p.irr}
                sku={p.sku}
                inStock={p.inStock}
                slug={p.slug}
                badge={p.sku}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
