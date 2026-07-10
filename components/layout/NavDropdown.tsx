'use client'

import { useState, useRef, useEffect } from 'react'
import { Link as IntlLink } from '@/i18n/routing'
import NextLink from 'next/link'
import { ChevronDown } from 'lucide-react'

interface NavDropdownItem {
  href: string
  label: string
  /** true = ruta fuera del locale routing (/cliente, /garantia): usa next/link plano. */
  external?: boolean
}

interface Props {
  label: string
  items: NavDropdownItem[]
}

export default function NavDropdown({ label, items }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      >
        {label}
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--surface)] shadow-lg overflow-hidden z-50">
          {items.map((item) =>
            item.external ? (
              <NextLink
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </NextLink>
            ) : (
              <IntlLink
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-[var(--border)] hover:text-[var(--text-primary)] transition-colors"
              >
                {item.label}
              </IntlLink>
            )
          )}
        </div>
      )}
    </div>
  )
}
