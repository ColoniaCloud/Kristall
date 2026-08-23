'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import ProductCard from '@/components/product/ProductCard'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PRODUCTOS, LINEAS, lineaLogoSrc, type Producto } from '@/lib/catalogo'
import { useState } from 'react'

// Valores reales presentes en el catálogo (orden ascendente)
const VLT_VALUES = [...new Set(PRODUCTOS.map((p) => p.vlt).filter((v): v is number => v != null))].sort((a, b) => a - b)
const UV_VALUES = [...new Set(PRODUCTOS.map((p) => p.uvr).filter((v): v is number => v != null))].sort((a, b) => a - b)

// El sitio público no está envuelto en .kf-app-theme (esa clase es solo del
// Panel de Cliente y Garantías), así que los tokens que usa Select por default
// (bg-popover, focus:bg-accent) no resuelven a ningún color ahí. Se pisan acá
// en vez de tocar components/ui/select.tsx, que sí funciona bien donde hay
// tema. El color/alto van por `style`, no por className: este navegador tiene
// prefers-color-scheme:dark, y como el proyecto nunca configuró el modo oscuro
// por clase, el `dark:bg-input/30` del trigger (con --input indefinido acá)
// termina ganándole a cualquier bg-* por clase — style inline no compite con
// eso, gana siempre.
const selectTrigger = 'w-full border-transparent text-sm font-medium data-placeholder:text-[#5C5C5C]'
const triggerStyle = { height: 40, backgroundColor: '#F2F2F0' }
const selectContent = 'border border-white/10'
const contentStyle = { backgroundColor: '#0A0A0A', color: '#fff' }
const selectItem = 'focus:bg-white/15 focus:text-white'

export default function ProductsClient() {
  const t = useTranslations('products_page')
  const tp = useTranslations('products')
  const tm = useTranslations('product_modal')
  const [activeLinea, setActiveLinea] = useState('all')
  const [activeVLT, setActiveVLT] = useState('all')
  const [activeUV, setActiveUV] = useState('all')

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

  const matchesFilters = (p: Producto) => {
    const lineaOk = activeLinea === 'all' || p.lineaSlug === activeLinea
    const vltOk = activeVLT === 'all' ? true : activeVLT === 'none' ? p.vlt == null : String(p.vlt) === activeVLT
    const uvOk = activeUV === 'all' ? true : activeUV === 'none' ? p.uvr == null : String(p.uvr) === activeUV
    return lineaOk && vltOk && uvOk
  }

  const clearFilters = () => {
    setActiveLinea('all')
    setActiveVLT('all')
    setActiveUV('all')
  }

  const lineTagline = (slug: string) => {
    const linea = LINEAS.find((l) => l.slug === slug)
    if (!linea) return ''
    const categoria = tm(`categoria_${linea.categoria}`)
    return linea.garantiaAnios ? `${categoria} · ${tm('warranty_years', { n: linea.garantiaAnios })}` : categoria
  }

  const hasActiveFilters = activeLinea !== 'all' || activeVLT !== 'all' || activeUV !== 'all'

  const sections = LINEAS
    .map((linea) => ({ linea, items: linea.productos.filter(matchesFilters) }))
    .filter((s) => s.items.length > 0)

  const totalFiltered = sections.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <div>
      {/* Barra de filtros — los 3 selects reparten el ancho de contenido en una
          fila en desktop; en mobile se apilan, cada uno a ancho completo. */}
      <div className="bg-white border-b border-[#E4E4E2] sticky top-[56px] z-40">
        <div className="px-4 md:px-10 py-4 max-w-[1160px] mx-auto flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A]">{t('filter_linea')}</span>
              <Select value={activeLinea} onValueChange={setActiveLinea}>
                <SelectTrigger className={selectTrigger} style={triggerStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContent} style={contentStyle}>
                  <SelectItem className={selectItem} value="all">{t('filter_todas')}</SelectItem>
                  {LINEAS.map((linea) => (
                    <SelectItem className={selectItem} key={linea.slug} value={linea.slug}>{linea.nombre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A]">{t('filter_vlt')}</span>
              <Select value={activeVLT} onValueChange={setActiveVLT}>
                <SelectTrigger className={selectTrigger} style={triggerStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContent} style={contentStyle}>
                  {VLT_OPTIONS.map((opt) => (
                    <SelectItem className={selectItem} key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A]">{t('filter_uv')}</span>
              <Select value={activeUV} onValueChange={setActiveUV}>
                <SelectTrigger className={selectTrigger} style={triggerStyle}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={selectContent} style={contentStyle}>
                  {UV_OPTIONS.map((opt) => (
                    <SelectItem className={selectItem} key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] text-[#9A9A9A]">
              {totalFiltered === 1 ? t('filter_count_one') : t('filter_count_other', { count: totalFiltered })}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
              >
                <X size={12} />
                {t('filter_clear')}
              </button>
            )}
          </div>
        </div>
      </div>

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
            {sections.map(({ linea, items }) => (
              <section key={linea.slug}>
                {/* Header de sección */}
                <div className="mb-6 pb-6 border-b border-[#E4E4E2]">
                  <div className="relative h-7 w-32 mb-3">
                    <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain object-left" sizes="128px" />
                  </div>
                  <p className="text-[13px] font-semibold text-[#0A0A0A] mb-2">{lineTagline(linea.slug)}</p>
                  <p className="text-sm text-[#5C5C5C] max-w-[640px] leading-relaxed">{tp(linea.descKey)}</p>
                </div>
                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((p) => (
                    <ProductCard key={p.codigo} producto={p} />
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
