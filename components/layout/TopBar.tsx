'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Mail, MapPin } from 'lucide-react'
import LanguageSelector from '@/components/common/LanguageSelector'
import SocialIcons from '@/components/common/SocialIcons'

/**
 * Barra fina de una línea por encima del header. No es sticky: scrollea con la
 * página y deja al header pegado arriba.
 *
 * Izquierda: selector de idioma + casilla de contacto según idioma
 * (`topbar.email` en los messages: es → hola@…, en/de → hi@…).
 * Derecha: ubicación + iconos de redes. La dirección solo linkea a Maps en
 * español — en/de no tienen oficina y muestran el texto de `topbar.address`.
 *
 * Se oculta debajo de `md`: en mobile no entra en una línea y el idioma ya está
 * dentro del menú del header.
 */

/** Dirección de la oficina para el link a Google Maps (solo se usa en `es`). */
const OFFICE_MAPS_QUERY = 'Av. Juan B. Justo 2918, CABA, Buenos Aires, Argentina'
const OFFICE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_MAPS_QUERY)}`

export default function TopBar() {
  const t = useTranslations('topbar')
  const locale = useLocale() as 'es' | 'en' | 'de'
  const email = t('email')
  const hasOffice = locale === 'es'

  return (
    <div
      className="hidden md:block bg-[var(--surface)] border-b border-[var(--border)]"
      style={{ borderBottomWidth: '0.5px' }}
    >
      <div className="mx-auto flex h-8 max-w-[1160px] items-center justify-between px-6 text-[11px] text-[var(--text-secondary)]">
        {/* Izquierda: idioma + mail */}
        <div className="flex items-center gap-5">
          <LanguageSelector />
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="leading-none">{email}</span>
          </a>
        </div>

        {/* Derecha: ubicación + redes */}
        <div className="flex items-center gap-5">
          {hasOffice ? (
            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[var(--text-primary)] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="leading-none">{t('address')}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="leading-none">{t('address')}</span>
            </span>
          )}
          <SocialIcons size={15} gap={10} href={{ email: `mailto:${email}` }} />
        </div>
      </div>
    </div>
  )
}
