'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import NavDropdown from '@/components/layout/NavDropdown'
import { Menu, X } from 'lucide-react'

/**
 * Header global de la web, para usar en superficies aisladas (/cliente, /garantia)
 * que viven fuera del árbol [locale] y no tienen next-intl disponible.
 * Texto fijo en español: estas superficies son de un solo idioma (ver middleware.ts).
 */
export default function StaticHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

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

  interface NavChild {
    href: string
    label: string
    external?: boolean
  }
  type NavEntry = { href: string; label: string } | { label: string; children: NavChild[] }

  const navLinks: NavEntry[] = [
    { href: '/', label: 'Inicio' },
    {
      label: 'Productos',
      children: [
        { href: '/productos', label: 'Catálogo', external: true },
        { href: '/garantia', label: 'Garantías', external: true },
      ],
    },
    { href: '/nosotros', label: 'Nosotros' },
    { href: '/blog', label: 'Blog' },
    {
      label: 'Software',
      children: [
        { href: '/servicios', label: 'Información', external: true },
        { href: '/cliente/ingresar', label: 'Acceder', external: true },
      ],
    },
    { href: '/contacto', label: 'Contacto' },
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
            {navLinks.map(link =>
              'children' in link ? (
                <NavDropdown key={link.label} label={link.label} items={[...link.children]} />
              ) : (
                <Link key={link.href} href={link.href} className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">{link.label}</Link>
              )
            )}
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/contacto" className="btn-primary text-white px-4 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all">Distribuir</Link>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="w-8 h-8 flex items-center justify-center text-[var(--text-primary)]"
              aria-label="Abrir menú"
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
              aria-label="Cerrar menú"
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
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          className="text-base text-[#5C5C5C] hover:text-[#0A0A0A] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
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

            {/* CTA */}
            <div className="mt-auto pt-8">
              <Link
                href="/contacto"
                onClick={() => setMobileOpen(false)}
                className="btn-primary block w-full text-white text-center py-4 text-base font-medium rounded-lg transition-all"
              >
                Distribuir
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
