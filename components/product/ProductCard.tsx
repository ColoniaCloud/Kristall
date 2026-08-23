'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'
import ProductDetailModal from '@/components/product/ProductDetailModal'
import { getLinea, productoNombre, lineaDestacadaSrc, lineaLogoSrc, overlayOpacity, type Producto } from '@/lib/catalogo'

export interface ProductCardProps {
  producto: Producto
  /** Si se pasa, la card es un link (teaser de home). Si no, abre el modal. */
  href?: string
}

export default function ProductCard({ producto, href }: ProductCardProps) {
  const t = useTranslations('product_modal')
  const [open, setOpen] = useState(false)

  const linea = getLinea(producto.lineaSlug)
  const nombre = productoNombre(producto)

  const rows: [string, string][] = []
  if (producto.vlt != null) rows.push(['VLT', `${producto.vlt}%`])
  if (producto.ir != null) rows.push(['IR', `${producto.ir}%`])
  if (producto.uvr != null) rows.push(['UV', `${producto.uvr}%`])
  if (producto.espesor) rows.push([t('spec_thickness'), `${producto.espesor.valor} ${producto.espesor.unidad}`])
  rows.push([t('code_label'), producto.codigo])

  const inner = (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
      {/* Banner: foto + overlay graduado por VLT + logo + categoría */}
      <div className="relative h-44 flex-shrink-0">
        <Image
          src={lineaDestacadaSrc(producto.lineaSlug)}
          alt={nombre}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity(producto.vlt) }} />
        {linea && (
          <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/90 text-[#0A0A0A] rounded-full px-2.5 py-0.5 font-medium">
            {t(`categoria_${linea.categoria}`)}
          </span>
        )}
        {linea && (
          <div className="absolute bottom-3 left-4 w-24 h-9">
            <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain object-left brightness-0 invert" sizes="96px" />
          </div>
        )}
      </div>

      {/* Cuerpo */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[16px] font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>{nombre}</p>
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
      {open && <ProductDetailModal producto={producto} onClose={() => setOpen(false)} />}
    </>
  )
}
