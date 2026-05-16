'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'
import LanguageSelector from '@/components/common/LanguageSelector'
import { motion } from 'framer-motion'

export default function Header() {
  const t = useTranslations('nav')

  return (
    <motion.header 
      className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)]" 
      style={{ borderBottomWidth: '0.5px' }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="mx-auto flex h-14 max-w-[1160px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/LogoPlano.png"
            alt="Kristall"
            width={140}
            height={32}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-5">
          <Link 
            href="/productos" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('products')}
          </Link>
          <Link 
            href="/servicios" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('services')}
          </Link>
          <Link 
            href="/nosotros" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('about')}
          </Link>
          <Link 
            href="/blog" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('blog')}
          </Link>
          <Link 
            href="/contacto" 
            className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {t('contact')}
          </Link>
        </nav>

        {/* Right side: locale switcher + CTA */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Link
            href="/carrito"
            className="bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium tracking-wide hover:opacity-85 transition-opacity"
          >
            {t('quote')}
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
