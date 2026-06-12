'use client'

import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'
import { laminasByLine, type LineMeta } from '@/lib/catalogo'

export interface CategoryCardProps {
  line: LineMeta
}

/**
 * Card de categoría para el grid del home. A diferencia de ProductCard (lámina),
 * usa la foto "top" sin overlay fuerte y muestra la descripción de la línea en
 * lugar de la tabla de especificaciones.
 */
export default function CategoryCard({ line }: CategoryCardProps) {
  const t = useTranslations('products')
  const tm = useTranslations('product_modal')

  const comingSoon = !laminasByLine(line.slug).some((l) => l.inStock)

  return (
    <AnimatedBorderCard borderRadius={12} className="h-full">
      <Link href={`/productos/categorias/${line.slug}`} className="block h-full">
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden border-[0.5px] border-[#E4E4E2] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.04)]">
          {/* Banner: foto "top" sin overlay; solo un degradé tenue en la base para el logo */}
          <div className="relative h-44 flex-shrink-0">
            <Image
              src={line.heroImage}
              alt={line.name}
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-white/90 text-[#0A0A0A] rounded-full px-2.5 py-0.5 font-medium">
              {tm(`tier_${line.tier}`)}
            </span>
            <div className="absolute bottom-3 left-4 w-24 h-9">
              <Image src={line.logo} alt={line.name} fill className="object-contain object-left brightness-0 invert" sizes="96px" />
            </div>
          </div>

          {/* Cuerpo: nombre + descripción de la categoría */}
          <div className="flex flex-col flex-1 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[15px] font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>{line.name}</p>
              {comingSoon && (
                <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-600 rounded px-2 py-0.5">{tm('coming_soon')}</span>
              )}
            </div>
            <p className="text-[13px] leading-relaxed text-[#5C5C5C]">{t(line.descKey)}</p>
          </div>
        </div>
      </Link>
    </AnimatedBorderCard>
  )
}
