'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import { useTranslations } from 'next-intl'

interface AddToCartButtonProps {
  sku: string
  name: string
  category: string
  inStock?: boolean
}

export default function AddToCartButton({ sku, name, category, inStock = true }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const t = useTranslations('cart')

  const handleClick = () => {
    addItem({ sku, name, category })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  if (!inStock) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-1.5 border border-[#E4E4E2] text-[#9A9A9A] px-4 py-2.5 rounded-lg text-xs font-medium cursor-not-allowed"
      >
        {t('coming_soon')}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-1.5 bg-[#0A0A0A] text-white px-4 py-2.5 rounded-lg text-xs font-medium hover:bg-[#2a2a2a] transition-colors"
    >
      {added ? (
        <span className="flex items-center gap-1.5">{t('added')}</span>
      ) : (
        <>
          <ShoppingCart size={13} />
          {t('add_to_cart')}
        </>
      )}
    </button>
  )
}
