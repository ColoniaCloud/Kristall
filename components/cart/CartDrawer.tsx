'use client'

import { useState } from 'react'
import { X, ShoppingCart } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart'
import CartItem from './CartItem'
import QuoteModal from './QuoteModal'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function CartDrawer() {
  const { items, isOpen, closeCart } = useCart()
  const [quoteOpen, setQuoteOpen] = useState(false)
  const t = useTranslations('cart')

  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <>
      <Sheet open={isOpen} onOpenChange={(v) => !v && closeCart()}>
        <SheetContent side="right" className="w-[360px] sm:w-[400px] flex flex-col p-0 bg-white text-[#0A0A0A]">
          <SheetHeader className="px-5 py-4 border-b border-[#E4E4E2] flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle
                className="text-sm font-medium text-[#0A0A0A]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {t('title')}
              </SheetTitle>
              {totalItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
            >
              <X size={16} />
            </button>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
                <ShoppingCart size={32} className="text-[#9A9A9A]" />
                <p className="text-sm font-medium text-[#9A9A9A]">{t('empty_title')}</p>
                <Link
                  href="/productos"
                  onClick={closeCart}
                  className="text-xs text-[#0A0A0A] underline underline-offset-2"
                >
                  {t('empty_cta')}
                </Link>
              </div>
            ) : (
              <div className="py-2">
                {items.map((item) => (
                  <CartItem key={item.sku} item={item} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="px-5 py-4 border-t border-[#E4E4E2]">
              <div className="text-xs text-[#9A9A9A] mb-3">
                {items.length} {t('references')}
              </div>
              <button
                type="button"
                onClick={() => { closeCart(); setQuoteOpen(true) }}
                className="w-full bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
              >
                {t('request_quote')}
              </button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  )
}
