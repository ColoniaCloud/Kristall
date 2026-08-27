'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Mail, MapPin } from 'lucide-react'
import LanguageSelector from '@/components/common/LanguageSelector'
import SocialIcons from '@/components/common/SocialIcons'
import { OFFICE_MAPS_URL } from '@/lib/office'

/**
 * Barra fina de una línea por encima del header, fondo negro (`--de-black`).
 * No es sticky: scrollea con la página y deja al header pegado arriba — al
 * pasar el scroll de su propia altura queda tapada por el header, momento que
 * usa `Header` para "encoger" a su tamaño de reposo (ver `Header.tsx`).
 *
 * Desktop — izquierda: selector de idioma + casilla de contacto según idioma
 * (`topbar.email` en los messages: es → hola@…, en/de → hi@…). Derecha:
 * ubicación + iconos de redes. La dirección solo linkea a Maps en español —
 * en/de no tienen oficina y muestran el texto de `topbar.address`.
 *
 * Mobile — misma barra pero solo con idioma (izquierda) y ubicación
 * (derecha): mail y redes se ocultan para que entre en una línea de 375px.
 */

export default function TopBar() {
  const t = useTranslations('topbar')
  const locale = useLocale() as 'es' | 'en' | 'de'
  const email = t('email')
  const hasOffice = locale === 'es'

  return (
    <div className="bg-[var(--de-black)] border-b border-white/10">
      <div className="mx-auto flex h-8 max-w-[1160px] items-center justify-between px-4 md:px-6 text-[11px] text-white/70">
        {/* Izquierda: idioma (+ mail desde md) */}
        <div className="flex items-center gap-5 min-w-0">
          <LanguageSelector />
          <a
            href={`mailto:${email}`}
            className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="leading-none">{email}</span>
          </a>
        </div>

        {/* Derecha: ubicación (+ redes desde md) */}
        <div className="flex items-center gap-5 min-w-0">
          {hasOffice ? (
            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 min-w-0 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="leading-none truncate">{t('address')}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span className="leading-none truncate">{t('address')}</span>
            </span>
          )}
          <div className="hidden md:block">
            <SocialIcons size={15} gap={10} href={{ email: `mailto:${email}` }} className="text-white/50" />
          </div>
        </div>
      </div>
    </div>
  )
}
