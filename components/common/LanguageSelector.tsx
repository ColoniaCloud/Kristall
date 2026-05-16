'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import SpainFlag from './SpainFlag'
import UKFlag from './UKFlag'
import GermanyFlag from './GermanyFlag'
import { ChevronDown } from 'lucide-react'

const languages = [
  { code: 'es' as const, name: 'Español', flag: SpainFlag },
  { code: 'en' as const, name: 'English', flag: UKFlag },
  { code: 'de' as const, name: 'Deutsch', flag: GermanyFlag },
]

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
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)] transition-colors"
      >
        <currentLanguage.flag />
        <ChevronDown className="w-3 h-3 text-[var(--text-secondary)]" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-50">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => switchLocale(language.code)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                locale === language.code
                  ? 'bg-[var(--border)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)]'
              }`}
            >
              <language.flag />
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
