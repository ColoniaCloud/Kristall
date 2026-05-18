import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="mt-auto bg-[#1A1A1A] px-8 py-8 pb-6">
      <div className="mx-auto max-w-[1160px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Branding */}
        <div>
          <div className="flex items-center mb-3">
            <Image
              src="/LogoPlano.png"
              alt="Kristall"
              width={117}
              height={26}
              className="h-[26px] w-auto"
            />
          </div>
          <p className="text-xs text-white/35 leading-relaxed">
            {t('tagline')}
          </p>
        </div>

        {/* Col 2: Productos */}
        <div>
          <h3 className="text-white font-medium text-sm mb-3">{t('col_products')}</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">{t('link_polarizado')}</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">{t('link_seguridad')}</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">{t('link_arquitectura')}</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">{t('link_ppf')}</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Software */}
        <div>
          <h3 className="text-white font-medium text-sm mb-3">{t('col_services')}</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">
                {t('link_polarized_app')}
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">{t('link_dashboard')}</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Empresa */}
        <div>
          <h3 className="text-white font-medium text-sm mb-3">{t('col_company')}</h3>
          <ul className="space-y-2 text-xs">
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

      {/* Copyright */}
      <div className="mx-auto max-w-[1160px] mt-8 pt-6 border-t border-white/10">
        <p className="text-xs text-white/35 text-center">{t('copyright')}</p>
      </div>
    </footer>
  )
}
