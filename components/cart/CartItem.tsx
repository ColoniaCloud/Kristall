'use client'

import { Trash2 } from 'lucide-react'
import { useCart, type CartItem as CartItemType } from '@/lib/cart'
import { useTranslations } from 'next-intl'

const categoryLabel: Record<string, string> = {
  klar: 'KLAR',
  karbon: 'KARBÖN',
  keramx: 'KERAMX',
  krypton: 'KRYPTON',
  ppf: 'PPF',
  vitral: 'VITRAL',
  'vehicular-polarizado': 'POLARIZADO',
  'vehicular-seguridad': 'SEGURIDAD',
  'arquitectura-polarizado': 'ARQUITECTURA',
  'arquitectura-seguridad': 'SEGURIDAD ARQ.',
}

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()
  const t = useTranslations('cart')

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-[#E4E4E2] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#0A0A0A] truncate">{item.name}</div>
        <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#9A9A9A] mt-0.5">
          {categoryLabel[item.category] ?? item.category.toUpperCase()}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
          className="w-6 h-6 border border-[#E4E4E2] rounded text-xs flex items-center justify-center hover:bg-[#F2F2F0] transition-colors"
        >
          −
        </button>
        <span className="text-sm font-medium text-[#0A0A0A] w-4 text-center">{item.quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
          className="w-6 h-6 border border-[#E4E4E2] rounded text-xs flex items-center justify-center hover:bg-[#F2F2F0] transition-colors"
        >
          +
        </button>
      </div>

      <button
        type="button"
        onClick={() => removeItem(item.sku)}
        className="text-[#9A9A9A] hover:text-red-500 transition-colors ml-1"
        aria-label={t('remove')}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
