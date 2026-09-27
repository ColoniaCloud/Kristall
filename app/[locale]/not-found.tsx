'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

/**
 * 404 del sitio público. Componente **cliente** a propósito: cuando Next renderiza
 * este boundary no hay request locale disponible, así que `getTranslations()` del
 * lado servidor no resuelve y la página sale vacía. `useTranslations` en cambio lee
 * el NextIntlClientProvider que monta el layout, que sí tiene el locale.
 *
 * Antes estaba hardcodeado en español y con `pt` abierto un visitante de Brasil
 * leía «Página no encontrada».
 */
export default function NotFound() {
  const t = useTranslations('not_found')

  return (
    <section className="px-6 py-32 max-w-2xl mx-auto text-center">
      <p className="text-xs font-medium tracking-widest uppercase text-[#9A9A9A] mb-4">404</p>
      <h1
        className="text-4xl font-black text-[#0A0A0A] mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {t('title')}
      </h1>
      <p className="text-[#5C5C5C] text-sm mb-8">{t('description')}</p>
      <Link
        href="/"
        className="btn-primary inline-block text-white text-sm font-medium px-6 py-3 rounded-full transition-all"
      >
        {t('cta')}
      </Link>
    </section>
  )
}
