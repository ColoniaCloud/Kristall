'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import NextLink from 'next/link'
import { MapPin } from 'lucide-react'
import SocialIcons from '@/components/common/SocialIcons'
import { OFFICE_MAPS_URL } from '@/lib/office'

export default function Footer() {
  const t = useTranslations('footer')
  const tTopbar = useTranslations('topbar')
  const locale = useLocale() as 'es' | 'en' | 'de'
  const hasOffice = locale === 'es'

  return (
    <footer className="sticky bottom-0 z-0 mt-auto bg-[#1A1A1A] px-8 py-8 pb-6 md:h-[50vh] md:flex md:flex-col md:justify-center md:py-14 md:pb-12">
      <div className="mx-auto w-full max-w-[1160px] grid grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 text-center lg:text-left">
        {/* Col 1: Branding */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <img
              src="/cat/logob.svg"
              alt="Kristall"
              className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <div className="flex items-center justify-center lg:justify-start mb-4">
            {hasOffice ? (
              <a
                href={OFFICE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{tTopbar('address')}</span>
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-white/50">
                <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span>{tTopbar('address')}</span>
              </span>
            )}
          </div>

          <div className="flex items-center justify-center lg:justify-start">
            <SocialIcons size={18} gap={14} className="text-white/40" />
          </div>
        </div>

        {/* Col 2: Productos */}
        <div>
          <h3 className="text-white font-medium text-[16px] mb-3">{t('col_products')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/productos/autos" className="text-white/50 hover:text-white transition-colors">{t('link_polarizado')}</Link>
            </li>
            <li>
              <Link href="/productos/lineas/krypton" className="text-white/50 hover:text-white transition-colors">{t('link_seguridad')}</Link>
            </li>
            <li>
              <Link href="/productos/arquitectura" className="text-white/50 hover:text-white transition-colors">{t('link_arquitectura')}</Link>
            </li>
            <li>
              <Link href="/productos/lineas/ppf" className="text-white/50 hover:text-white transition-colors">{t('link_ppf')}</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Software + Empresa */}
        <div>
          <div className="mb-6">
            <h3 className="text-white font-medium text-[16px] mb-3">{t('col_services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">
                  {t('link_software_info')}
                </Link>
              </li>
              <li>
                <NextLink href="/cliente/ingresar" className="text-white/50 hover:text-white transition-colors">{t('link_software_access')}</NextLink>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-[16px] mb-3">{t('col_company')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/nosotros" className="text-white/50 hover:text-white transition-colors">
                  {t('link_nosotros')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/50 hover:text-white transition-colors">
                  {t('link_blog')}
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-white/50 hover:text-white transition-colors">
                  {t('link_contacto')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Col 4: Sumate a Kristall */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-white font-medium text-[16px] mb-3">{t('col_partners')}</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/propuesta-aberturas" className="text-white/50 hover:text-white transition-colors">
                {t('link_vidrierias')}
              </Link>
            </li>
            <li>
              <Link href="/concesionarias" className="text-white/50 hover:text-white transition-colors">
                {t('link_concesionarias')}
              </Link>
            </li>
            <li>
              <Link href="/punto-kristall" className="text-white/50 hover:text-white transition-colors">
                {t('link_punto_kristall')}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto w-full max-w-[1160px] mt-8 pt-6 border-t border-white/10">
        <p className="text-sm text-white/35 text-center">{t('copyright')}</p>
      </div>
    </footer>
  )
}
