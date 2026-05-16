import { Link } from '@/i18n/routing'
import AddToCartButton from '@/components/cart/AddToCartButton'

export interface ProductCardProps {
  name: string
  category: string
  vlt: number | null
  uv: number | null
  irr: number | null
  sku?: string
  inStock: boolean
  slug: string
  locale?: string
}

const categoryBg: Record<string, string> = {
  klar: 'bg-[#2a2a2a]',
  karbon: 'bg-[#1a1a1a]',
  keramx: 'bg-[#3a3a3a]',
  krypton: 'bg-[#111111]',
  ppf: 'bg-[#e8e8e6]',
  vitral: 'bg-[#d0e4f0]',
}

const categoryLabel: Record<string, string> = {
  klar: 'KLAR',
  karbon: 'KARBÖN',
  keramx: 'KERAMX',
  krypton: 'KRYPTON',
  ppf: 'PPF',
  vitral: 'VITRAL',
}

const isDark = (cat: string) => !['ppf', 'vitral'].includes(cat)

export default function ProductCard({
  name,
  category,
  vlt,
  uv,
  irr,
  inStock,
  slug,
}: ProductCardProps) {
  const dark = isDark(category)

  return (
    <Link href={`/productos/${slug}` as `/productos/${string}`} className="group block">
      <div className="rounded-[var(--r)] overflow-hidden border border-[#E4E4E2] hover:border-[#0A0A0A] transition-colors">
        {/* Visual area */}
        <div className={`relative h-40 ${categoryBg[category] ?? 'bg-[#2a2a2a]'} flex items-end p-4`}>
          {!inStock && (
            <span className="absolute top-3 right-3 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/90 text-[#0A0A0A]">
              Próximamente
            </span>
          )}
          <span
            className={`text-xs font-medium tracking-widest uppercase ${dark ? 'text-white/40' : 'text-black/30'}`}
          >
            {categoryLabel[category] ?? category.toUpperCase()}
          </span>
          {/* Shimmer for KERAMX */}
          {category === 'keramx' && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>

        {/* Info */}
        <div className="p-4 bg-white">
          <p className="text-sm font-semibold text-[#0A0A0A] leading-tight mb-3">{name}</p>

          {/* Technical badges */}
          {(vlt !== null || uv !== null || irr !== null) && (
            <div className="flex flex-wrap gap-1.5">
              {vlt !== null && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F2F0] text-[#0A0A0A]">
                  VLT {vlt}%
                </span>
              )}
              {uv !== null && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F2F0] text-[#0A0A0A]">
                  UV {uv}%
                </span>
              )}
              {irr !== null && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F2F2F0] text-[#0A0A0A]">
                  IRR {irr}%
                </span>
              )}
            </div>
          )}

          {!inStock && (
            <p className="mt-2 text-[10px] text-[#9A9A9A]">Consultá por preventas</p>
          )}

          <div className="mt-3">
            <AddToCartButton sku={slug} name={name} category={category} inStock={inStock} />
          </div>
        </div>
      </div>
    </Link>
  )
}
