'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import LanguageSelector from '@/components/common/LanguageSelector'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart'
import CartDrawer from '@/components/cart/CartDrawer'

export default function Header() {
  const t = useTranslations('nav')
  const { items, openCart } = useCart()
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <>
      <header
        className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]"
        style={{ borderBottomWidth: '0.5px' }}
      >
        <div className="mx-auto flex h-14 max-w-[1160px] items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image src="/LogoPlano.png" alt="Kristall" width={140} height={32} priority className="h-8 w-auto" />
          </Link>
          <nav className="flex items-center gap-5">
            <Link href="/" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('home')}</Link>
            <Link href="/productos" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('products')}</Link>
            <Link href="/nosotros" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('about')}</Link>
            <Link href="/blog" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('blog')}</Link>
            <Link href="/servicios" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('services')}</Link>
            <Link href="/contacto" className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{t('contact')}</Link>
          </nav>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button type="button" onClick={openCart} className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" aria-label="Abrir carrito">
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-[9px] flex items-center justify-center">{totalItems}</span>
              )}
            </button>
            <Link href="/carrito" className="bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium tracking-wide hover:opacity-85 transition-opacity">{t('quote')}</Link>
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
