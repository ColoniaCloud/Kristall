'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import ArgentinaFlag from './ArgentinaFlag'
import UKFlag from './UKFlag'
import GermanyFlag from './GermanyFlag'
import { ChevronDown } from 'lucide-react'

/**
 * Selector de idioma de la barra superior: bandera + nombre del idioma + chevron,
 * sin fondo ni caja — es un item más de la barra, no un botón.
 * `es` usa la bandera de Argentina (es el mercado, no España).
 *
 * Pensado para vivir sobre el fondo negro de `TopBar`: el trigger usa texto
 * blanco translúcido. El desplegable en sí es un popover claro (fondo
 * `--surface`) para mantener legibilidad, con `z-[60]` — por encima del header
 * sticky (`z-50`) para que no quede tapado por el logo al abrirse.
 */

type FlagComponent = (props: { width?: number; height?: number }) => React.JSX.Element

const languages: { code: 'es' | 'en' | 'de'; name: string; flag: FlagComponent }[] = [
  { code: 'es', name: 'Español', flag: ArgentinaFlag },
  { code: 'en', name: 'English', flag: UKFlag },
  { code: 'de', name: 'Deutsch', flag: GermanyFlag },
]

/** Mitad del tamaño histórico (20x14) en el trigger; el desplegable va un punto más grande. */
const FLAG_TRIGGER = { width: 10, height: 7 }
const FLAG_MENU = { width: 14, height: 10 }

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const locale = useLocale() as 'es' | 'en' | 'de'
  const router = useRouter()
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

  const switchLocale = (locale: 'es' | 'en' | 'de') => {
    router.replace(pathname, { locale })
    setIsOpen(false)
  }

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

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 mt-2 w-36 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-[60]"
        >
          {languages.map((language) => (
            <button
              key={language.code}
              role="option"
              aria-selected={locale === language.code}
              onClick={() => switchLocale(language.code)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors ${
                locale === language.code
                  ? 'bg-[var(--border)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]'
              }`}
            >
              <language.flag {...FLAG_MENU} />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
