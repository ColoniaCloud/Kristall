'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/routing'
import Image from 'next/image'
import LanguageSelector from '@/components/common/LanguageSelector'
import { Menu, X } from 'lucide-react'
import { useLocale } from 'next-intl'

export default function Header() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale() as 'es' | 'en' | 'de'
  const router = useRouter()

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

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/productos', label: t('products') },
    { href: '/nosotros', label: t('about') },
    { href: '/blog', label: t('blog') },
    { href: '/servicios', label: t('services') },
    { href: '/contacto', label: t('contact') },
  ]

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

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{link.label}</Link>
            ))}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSelector />
            <Link href="/contacto" className="btn-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all">{t('quote')}</Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-3">
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
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-4 border-b border-[#E4E4E2] text-lg font-medium text-[#0A0A0A] hover:text-[#5C5C5C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
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
    </>
  )
}
