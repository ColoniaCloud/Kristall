'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ShoppingCart } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useCart } from '@/lib/cart'
import CartItem from '@/components/cart/CartItem'
import QuoteModal from '@/components/cart/QuoteModal'

export default function CarritoClient() {
  const t = useTranslations('cart')
  const { items } = useCart()
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    useCart.persist.rehydrate()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  // Antes de hidratar, `items` siempre es [] (ver lib/cart.ts) — evita mostrar
  // "carrito vacío" un instante mientras se lee localStorage.
  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#F2F2F0] px-4 md:px-10 py-28 md:py-32">
      <div className="max-w-[640px] mx-auto">
        <h1 className="text-2xl md:text-3xl font-medium text-[#0A0A0A] mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          {t('title')}
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E4E4E2] flex flex-col items-center justify-center gap-3 py-16 px-6 text-center">
            <ShoppingCart size={32} className="text-[#9A9A9A]" />
            <p className="text-sm font-medium text-[#9A9A9A]">{t('empty_title')}</p>
            <p className="text-xs text-[#9A9A9A] max-w-[280px]">{t('empty_body')}</p>
            <Link href="/productos" className="text-xs text-[#0A0A0A] underline underline-offset-2 mt-1">
              {t('empty_cta')}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#E4E4E2] p-5">
            <p className="text-xs text-[#9A9A9A] mb-2">
              {items.length} {t('references')}
            </p>
            <div>
              {items.map((item) => (
                <CartItem key={item.codigo} item={item} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setQuoteOpen(true)}
              className="w-full mt-4 bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
            >
              {t('request_quote')}
            </button>
          </div>
        )}
      </div>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  )
}
