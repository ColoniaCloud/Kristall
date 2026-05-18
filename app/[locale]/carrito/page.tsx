'use client'

import { useState } from 'react'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import CartItem from '@/components/cart/CartItem'
import QuoteModal from '@/components/cart/QuoteModal'
import { Link } from '@/i18n/routing'

export default function CarritoPage() {
  const { items } = useCart()
  const [quoteOpen, setQuoteOpen] = useState(false)

  const totalRefs = items.length

  if (items.length === 0) {
    return (
      <section className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center" style={{ padding: '64px 40px' }}>
        <ShoppingCart size={40} className="text-[#9A9A9A]" />
        <h1
          className="text-xl font-medium text-[#0A0A0A]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Tu carrito está vacío
        </h1>
        <p className="text-sm text-[#5C5C5C]">Explorá nuestros productos y agregá los que te interesan.</p>
        <Link
          href="/productos"
          className="bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
        >
          Ver productos
        </Link>
      </section>
    )
  }

  return (
    <>
      <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
        <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Lista */}
          <div>
            <div className="section-label mb-2">
              Carrito de cotización
            </div>
            <h1
              className="text-2xl font-medium text-[#0A0A0A] mb-6"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Tu selección
            </h1>
            <div className="bg-white border border-[#E4E4E2] rounded-2xl p-4">
              {items.map((item) => (
                <CartItem key={item.sku} item={item} />
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-white border border-[#E4E4E2] rounded-2xl p-5">
            <div className="text-sm font-medium text-[#0A0A0A] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Resumen de cotización
            </div>
            <div className="flex flex-col gap-2 mb-4">
              {items.map((item) => (
                <div key={item.sku} className="flex justify-between text-xs">
                  <span className="text-[#5C5C5C] truncate mr-2">{item.name}</span>
                  <span className="text-[#0A0A0A] font-medium flex-shrink-0">×{item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E4E4E2] pt-3 mb-4">
              <div className="text-xs text-[#9A9A9A]">
                {totalRefs} {totalRefs === 1 ? 'referencia' : 'referencias'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="w-full bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              Solicitar cotización
            </button>
          </div>
        </div>
      </section>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  )
}
