'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ShoppingCart, Minus, Plus } from 'lucide-react'
import { useCart } from '@/lib/cart'
import type { Producto } from '@/lib/catalogo'

interface AddToCartControlProps {
  producto: Producto
  nombre: string
}

/** Selector de cantidad (en rollos) + botón de agregar al carrito de cotización. */
export default function AddToCartControl({ producto, nombre }: AddToCartControlProps) {
  const t = useTranslations('cart')
  const addItem = useCart((s) => s.addItem)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem({ codigo: producto.codigo, nombre, lineaSlug: producto.lineaSlug }, quantity)
    setAdded(true)
    setQuantity(1)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A]">{t('quantity_rollos')}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-[#E4E4E2] rounded-lg overflow-hidden flex-shrink-0">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="−"
            className="w-9 h-10 flex items-center justify-center text-[#5C5C5C] hover:bg-[#F2F2F0] transition-colors"
          >
            <Minus size={13} />
          </button>
          <span className="w-9 text-center text-sm font-medium text-[#0A0A0A] tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            aria-label="+"
            className="w-9 h-10 flex items-center justify-center text-[#5C5C5C] hover:bg-[#F2F2F0] transition-colors"
          >
            <Plus size={13} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#0A0A0A] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          {added ? (
            t('added')
          ) : (
            <>
              <ShoppingCart size={14} />
              {t('add_to_cart')}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
