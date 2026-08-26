'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import NextLink from 'next/link'
import Image from 'next/image'
import TopBar from '@/components/layout/TopBar'
import NavDropdown from '@/components/layout/NavDropdown'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useCart } from '@/lib/cart'
import CartDrawer from '@/components/cart/CartDrawer'

/** Alto de TopBar (h-8). Cuando el scroll la supera, el header sticky ya la
 * tapó por completo — ese es el momento exacto de encoger el header. */
const TOPBAR_HEIGHT = 32

export default function Header() {
  const t = useTranslations('nav')
  const tCart = useTranslations('cart')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const locale = useLocale() as 'es' | 'en' | 'de'
  const router = useRouter()
  const openCart = useCart((s) => s.openCart)
  const cartCount = useCart((s) => s.items.reduce((acc, i) => acc + i.quantity, 0))

  useEffect(() => {
    // El store se hidrata a mano (skipHydration) para que el primer render en
    // cliente coincida con el del servidor y no dispare un warning de hidratación.
    useCart.persist.rehydrate()
  }, [])

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > TOPBAR_HEIGHT)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const switchLocale = (loc: 'es' | 'en' | 'de') => {
    router.replace(pathname, { locale: loc })
    setMobileOpen(false)
  }

  interface NavChild {
    href: string
    label: string
    external?: boolean
  }
  type NavEntry = { href: string; label: string } | { label: string; children: NavChild[] }

  const navLinks: NavEntry[] = [
    { href: '/', label: t('home') },
    {
      label: t('products'),
      children: [
        { href: '/productos', label: t('products_catalog') },
        { href: '/garantia', label: t('products_warranty'), external: true },
      ],
    },
    { href: '/nosotros', label: t('about') },
    { href: '/blog', label: t('blog') },
    {
      label: t('services'),
      children: [
        { href: '/servicios', label: t('services_info') },
        { href: '/cliente/ingresar', label: t('services_access'), external: true },
      ],
    },
    { href: '/contacto', label: t('contact') },
  ]

  return (
    <>
      <TopBar />
      <header
        className={`sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] transition-[height] duration-300 h-14 ${isScrolled ? 'md:h-14' : 'md:h-[62px]'}`}
        style={{ borderBottomWidth: '0.5px' }}
      >
        <div className="mx-auto flex h-full max-w-[1160px] items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/LogoPlano.png"
              alt="Kristall"
              width={140}
              height={32}
              priority
              className={`w-auto transition-[height] duration-300 h-8 ${isScrolled ? 'md:h-8' : 'md:h-9'}`}
            />
          </Link>

          {/* Desktop: nav pegado contra el carrito/CTA, todo el bloque alineado a la derecha */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-5">
              {navLinks.map(link =>
                'children' in link ? (
                  <NavDropdown key={link.label} label={link.label} items={[...link.children]} />
                ) : (
                  <Link key={link.href} href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{link.label}</Link>
                )
              )}
            </nav>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={openCart}
                aria-label={tCart('open_cart')}
                className="relative w-8 h-8 flex items-center justify-center text-[var(--text-primary)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-[9px] flex items-center justify-center font-medium tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>
              <Link href="/contacto" className="btn-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all">{t('quote')}</Link>
            </div>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={openCart}
              aria-label={tCart('open_cart')}
              className="relative w-8 h-8 flex items-center justify-center text-[var(--text-primary)]"
            >
              <ShoppingCart size={19} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0A0A0A] text-white text-[9px] flex items-center justify-center font-medium tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-primary)]"
              aria-label={t('open_menu')}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-[#F2F2F0] flex flex-col md:hidden">
          {/* Header */}
          <div className="flex h-14 items-center justify-between px-6 bg-white border-b border-[#E4E4E2]" style={{ borderBottomWidth: '0.5px' }}>
            <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center">
              <Image src="/LogoPlano.png" alt="Kristall" width={140} height={32} priority className="h-8 w-auto" />
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center text-[#0A0A0A]"
              aria-label={t('close_menu')}
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 px-6 pt-6 pb-8 overflow-y-auto">
            <nav className="flex flex-col">
              {navLinks.map(link =>
                'children' in link ? (
                  <div key={link.label} className="border-b border-[#E4E4E2] py-4">
                    <p className="text-lg font-medium text-[#0A0A0A] mb-3">{link.label}</p>
                    <div className="flex flex-col gap-3 pl-3">
                      {link.children.map(child =>
                        child.external ? (
                          <NextLink
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-base text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
                          >
                            {child.label}
                          </NextLink>
                        ) : (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="text-base text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
                          >
                            {child.label}
                          </Link>
                        )
                      )}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-4 border-b border-[#E4E4E2] text-lg font-medium text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Locale selector */}
            <div className="mt-8">
              <p className="text-xs uppercase tracking-widest text-[#9A9A9A] mb-3">{t('language')}</p>
              <div className="flex gap-2">
                {(['es', 'en', 'de'] as const).map(loc => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => switchLocale(loc)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      locale === loc
                        ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
                        : 'border-[#E4E4E2] text-[#5C5C5C] hover:border-[#0A0A0A] hover:text-[#0A0A0A]'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-auto pt-8">
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="btn-primary block w-full text-white text-center py-4 text-base font-medium rounded-lg transition-all"
              >
                {t('quote')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <CartDrawer />
    </>
  )
}
