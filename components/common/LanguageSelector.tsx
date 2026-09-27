'use client'

import { useState, useRef, useEffect } from 'react'
import { Link, usePathname, routing, type Locale } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import ArgentinaFlag from './ArgentinaFlag'
import UKFlag from './UKFlag'
import GermanyFlag from './GermanyFlag'
import BrazilFlag from './BrazilFlag'
import { ChevronDown } from 'lucide-react'

type FlagComponent = (props: { width?: number; height?: number }) => React.JSX.Element

/**
 * Record<Locale, ...> a propósito, no un array: si se suma un idioma a
 * i18n/routing.ts y no se le agrega bandera acá, esto no compila — en vez de
 * desaparecer del selector en silencio, que es lo que le pasó a `pt`.
 */
const LANGUAGE_BY_LOCALE: Record<Locale, { name: string; flag: FlagComponent }> = {
  es: { name: 'Español', flag: ArgentinaFlag },
  en: { name: 'English', flag: UKFlag },
  de: { name: 'Deutsch', flag: GermanyFlag },
  pt: { name: 'Português', flag: BrazilFlag },
}

/** El orden del selector sale del routing, que es la fuente de verdad. */
const languages = routing.locales.map((code) => ({ code, ...LANGUAGE_BY_LOCALE[code] }))

/** Mitad del tamaño histórico (20x14) en el trigger; el desplegable va un punto más grande. */
const FLAG_TRIGGER = { width: 10, height: 7 }
const FLAG_MENU = { width: 14, height: 10 }

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
      >
        <currentLanguage.flag {...FLAG_TRIGGER} />
        <span className="leading-none">{currentLanguage.name}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Se renderiza SIEMPRE y se oculta con `hidden`, en vez de montarse solo al
          abrirlo: así los <a> de cada idioma están en el HTML servido. Antes eran
          <button> con router.replace, o sea que el sitio no tenía un solo link
          interno a /en, /de ni /pt y los rastreadores llegaban a las otras locales
          únicamente por hreflang y sitemap. `hidden` además los saca del orden de
          tabulación y del árbol de accesibilidad mientras está cerrado. */}
      <div
        role="listbox"
        className={`absolute left-0 mt-2 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-[60] ${
          isOpen ? '' : 'hidden'
        }`}
      >
        {languages.map((language) => (
          <Link
            key={language.code}
            href={pathname}
            locale={language.code}
            replace
            role="option"
            aria-selected={locale === language.code}
            onClick={() => setIsOpen(false)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
              locale === language.code
                ? 'bg-[var(--border)] text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]'
            }`}
          >
            <language.flag {...FLAG_MENU} />
            <span>{language.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
