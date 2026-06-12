'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { LAMINAS, LINE_ORDER, getLine, type Lamina } from '@/lib/catalogo'

const btnBase = 'px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors'
const btnActive = 'bg-[#0A0A0A] text-white'
const btnInactive = 'bg-[#F2F2F0] text-[#5C5C5C] hover:bg-[#E8E8E6]'
const catBtn = (active: boolean) =>
  `px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
    active
      ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
      : 'bg-white border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A]'
  }`

// Valores reales presentes en el catálogo (orden ascendente)
const VLT_VALUES = [...new Set(LAMINAS.map((l) => l.vlt).filter((v): v is number => v != null))].sort((a, b) => a - b)
const UV_VALUES = [...new Set(LAMINAS.map((l) => l.uv).filter((v): v is number => v != null))].sort((a, b) => a - b)

export default function ProductsClient() {
  const t = useTranslations('products_page')
  const tp = useTranslations('products')
  const tm = useTranslations('product_modal')
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeVLT, setActiveVLT] = useState('all')
  const [activeUV, setActiveUV] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)

  const VLT_OPTIONS = [
    { label: t('filter_todos'), value: 'all' },
    ...VLT_VALUES.map((v) => ({ label: `${v}%`, value: String(v) })),
    { label: t('filter_sin_vlt'), value: 'none' },
  ]

  const UV_OPTIONS = [
    { label: t('filter_todos'), value: 'all' },
    ...UV_VALUES.map((v) => ({ label: `${v}%`, value: String(v) })),
    { label: t('filter_sin_uv'), value: 'none' },
  ]

  const matchesFilters = (p: Lamina) => {
    const catOk = activeCategory === 'all' || p.line === activeCategory
    const vltOk = activeVLT === 'all' ? true : activeVLT === 'none' ? p.vlt == null : String(p.vlt) === activeVLT
    const uvOk = activeUV === 'all' ? true : activeUV === 'none' ? p.uv == null : String(p.uv) === activeUV
    return catOk && vltOk && uvOk
  }

  const clearFilters = () => {
    setActiveCategory('all')
    setActiveVLT('all')
    setActiveUV('all')
  }

  const lineTagline = (slug: string) => {
    const line = getLine(slug)
    if (!line) return ''
    const tier = tm(`tier_${line.tier}`)
    return line.warrantyYears ? `${tier} · ${tm('warranty_years', { n: line.warrantyYears })}` : tier
  }

  const hasActiveFilters = activeCategory !== 'all' || activeVLT !== 'all' || activeUV !== 'all'
  const activeFilterCount = [activeCategory !== 'all', activeVLT !== 'all', activeUV !== 'all'].filter(Boolean).length

  const sections = LINE_ORDER
    .map((slug) => ({
      slug,
      line: getLine(slug),
      items: LAMINAS.filter((p) => p.line === slug && matchesFilters(p)),
    }))
    .filter((s) => s.line != null && s.items.length > 0)

  const totalFiltered = sections.reduce((sum, s) => sum + s.items.length, 0)

  const filterContent = (
    <div className="flex flex-col gap-5">
      <div>
        <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] block mb-2">{t('filter_linea')}</span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveCategory('all')} className={catBtn(activeCategory === 'all')}>
            {t('filter_todas')}
          </button>
          {LINE_ORDER.map((slug) => (
            <button key={slug} onClick={() => setActiveCategory(slug)} className={catBtn(activeCategory === slug)}>
              {getLine(slug)?.name}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] block mb-2">{t('filter_vlt')}</span>
        <div className="flex flex-wrap gap-1.5">
          {VLT_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setActiveVLT(opt.value)} className={`${btnBase} ${activeVLT === opt.value ? btnActive : btnInactive}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] block mb-2">{t('filter_uv')}</span>
        <div className="flex flex-wrap gap-1.5">
          {UV_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => setActiveUV(opt.value)} className={`${btnBase} ${activeUV === opt.value ? btnActive : btnInactive}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Mobile: botón Filtrar */}
      <div className="md:hidden bg-white border-b border-[#E4E4E2] px-4 py-3 sticky top-[56px] z-40">
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-[#0A0A0A] text-white py-2.5 rounded-lg text-sm font-medium"
        >
          <SlidersHorizontal size={14} />
          {hasActiveFilters ? `Filtros activos (${activeFilterCount})` : 'Filtrar'}
        </button>
      </div>

      {/* Desktop: barra de filtros */}
      <div className="hidden md:block bg-white border-b border-[#E4E4E2] sticky top-[56px] z-40">
        <div className="px-10 py-3 max-w-[1160px] mx-auto flex flex-col gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_linea')}</span>
            <button onClick={() => setActiveCategory('all')} className={catBtn(activeCategory === 'all')}>
              {t('filter_todas')}
            </button>
            {LINE_ORDER.map((slug) => (
              <button key={slug} onClick={() => setActiveCategory(slug)} className={catBtn(activeCategory === slug)}>
                {getLine(slug)?.name}
              </button>
            ))}
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_vlt')}</span>
            {VLT_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setActiveVLT(opt.value)} className={`${btnBase} ${activeVLT === opt.value ? btnActive : btnInactive}`}>
                {opt.label}
              </button>
            ))}
            <div className="w-px h-4 bg-[#E4E4E2] mx-2" />
            <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mr-1">{t('filter_uv')}</span>
            {UV_OPTIONS.map((opt) => (
              <button key={opt.value} onClick={() => setActiveUV(opt.value)} className={`${btnBase} ${activeUV === opt.value ? btnActive : btnInactive}`}>
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9A9A9A]">
            {totalFiltered === 1 ? t('filter_count_one') : t('filter_count_other', { count: totalFiltered })}
          </p>
        </div>
      </div>

      {/* Modal de filtros (mobile) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-t-2xl px-6 pt-5 pb-8 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-base font-medium text-[#0A0A0A]">Filtros</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors">
                <X size={20} />
              </button>
            </div>
            {filterContent}
            <div className="flex gap-3 mt-6">
              {hasActiveFilters && (
                <button
                  onClick={() => { clearFilters(); setModalOpen(false) }}
                  className="flex-1 py-2.5 border border-[#E4E4E2] rounded-lg text-sm text-[#5C5C5C]"
                >
                  {t('filter_clear')}
                </button>
              )}
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 bg-[#0A0A0A] text-white rounded-lg text-sm font-medium"
              >
                Ver {totalFiltered} producto{totalFiltered !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Secciones por línea */}
      <div className="px-4 md:px-10 py-8 md:py-12 max-w-[1160px] mx-auto">
        {sections.length === 0 ? (
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
          <div className="space-y-16">
            {sections.map(({ slug, line, items }) => (
              <section key={slug}>
                {/* Header de sección */}
                <div className="mb-6 pb-6 border-b border-[#E4E4E2]">
                  <div className="relative h-7 w-32 mb-3">
                    <Image src={line!.logo} alt={line!.name} fill className="object-contain object-left" sizes="128px" />
                  </div>
                  <p className="text-[13px] font-semibold text-[#0A0A0A] mb-2">{lineTagline(slug)}</p>
                  <p className="text-sm text-[#5C5C5C] max-w-[640px] leading-relaxed">{tp(line!.descKey)}</p>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((p) => (
                    <ProductCard key={p.sku} lamina={p} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
