'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'
import { lineaDestacadaSrc, lineaLogoSrc, type Linea } from '@/lib/catalogo'

export interface CategoryCardProps {
  linea: Linea
}

/**
 * Card de línea para el grid del home. A diferencia de ProductCard (producto),
 * usa la foto destacada sin overlay fuerte y muestra la descripción de la
 * línea en lugar de la tabla de especificaciones.
 */
export default function CategoryCard({ linea }: CategoryCardProps) {
  const t = useTranslations('products')
  const tm = useTranslations('product_modal')

  return (
    <AnimatedBorderCard borderRadius={12} className="h-full">
      <Link href={`/productos/lineas/${linea.slug}`} className="block h-full group">
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
          {/* Banner: foto destacada sin overlay; solo un degradé tenue en la base para el logo */}
          <div className="relative h-44 flex-shrink-0 overflow-hidden">
            <Image
              src={lineaDestacadaSrc(linea.slug)}
              alt={linea.nombre}
              fill
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/90 text-[#0A0A0A] rounded-full px-2.5 py-0.5 font-medium">
              {tm(`categoria_${linea.categoria}`)}
            </span>
            <div className="absolute bottom-3 left-4 w-24 h-9">
              <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain object-left brightness-0 invert" sizes="96px" />
            </div>
          </div>

          {/* Cuerpo: nombre + descripción de la línea */}
          <div className="flex flex-col flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[16px] font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>{linea.nombre}</p>
            </div>
            <p className="text-[13px] leading-relaxed text-[#5C5C5C]">{t(linea.descKey)}</p>
          </div>
        </div>
      </Link>
    </AnimatedBorderCard>
  )
}
