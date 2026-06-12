'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'
import ProductDetailModal from '@/components/product/ProductDetailModal'
import { getLine, laminaName, overlayOpacity, type Lamina } from '@/lib/catalogo'

export interface ProductCardProps {
  lamina: Lamina
  /** Si se pasa, la card es un link (teaser de home). Si no, abre el modal. */
  href?: string
}

export default function ProductCard({ lamina, href }: ProductCardProps) {
  const t = useTranslations('product_modal')
  const [open, setOpen] = useState(false)

  const line = getLine(lamina.line)
  const name = laminaName(lamina)

  const rows: [string, string][] = []
  if (lamina.vlt != null) rows.push(['VLT', `${lamina.vlt}%`])
  if (lamina.irr != null) rows.push(['IR', `${lamina.irr}%`])
  if (lamina.uv != null) rows.push(['UV', `${lamina.uv}%`])
  lamina.specRows?.forEach((s) => rows.push([t(s.labelKey), s.value]))
  rows.push(['SKU', lamina.sku])

  const inner = (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
      {/* Banner: foto + overlay graduado por VLT + logo + tier */}
      <div className="relative h-44 flex-shrink-0">
        <Image
          src={line?.image ?? '/cat/top-KLAR.jpg'}
          alt={name}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity(lamina.vlt) }} />
        {line && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/90 text-[#0A0A0A] rounded-full px-2.5 py-0.5 font-medium">
            {t(`tier_${line.tier}`)}
          </span>
        )}
        {line && (
          <div className="absolute bottom-3 left-4 w-24 h-9">
            <Image src={line.logo} alt={line.name} fill className="object-contain object-left brightness-0 invert" sizes="96px" />
          </div>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[15px] font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>{name}</p>
          {!lamina.inStock && (
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 rounded px-2 py-0.5">{t('coming_soon')}</span>
          )}
        </div>

        {/* Tabla de datos */}
        <div className="rounded-lg border border-[#E4E4E2] overflow-hidden mt-auto">
          {rows.map(([label, value], i) => (
            <div key={label} className={`grid grid-cols-[72px_1fr] text-[13px] ${i % 2 === 0 ? 'bg-[#F8F8F7]' : 'bg-white'}`}>
              <span className="px-3 py-1.5 text-[#9A9A9A] border-r border-[#E4E4E2]">{label}</span>
              <span className="px-3 py-1.5 text-[#0A0A0A] font-medium tabular-nums">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <AnimatedBorderCard borderRadius={12} className="h-full">
        <Link href={href} className="block h-full">{inner}</Link>
      </AnimatedBorderCard>
    )
  }

  return (
    <>
      <AnimatedBorderCard borderRadius={12} className="h-full">
        <button type="button" onClick={() => setOpen(true)} className="block w-full h-full text-left cursor-pointer">
          {inner}
        </button>
      </AnimatedBorderCard>
      {open && <ProductDetailModal lamina={lamina} onClose={() => setOpen(false)} />}
    </>
  )
}
