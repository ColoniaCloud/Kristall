import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function AboutCTA() {
  const t = useTranslations('about')
  return (
    <section className="px-4 pb-4 md:px-10 md:pb-10">
      <div className="max-w-[1160px] mx-auto bg-[#1A1A1A] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 md:p-10">
        <div>
          <h3
            className="text-white mb-2"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
          >
            {t('cta_title')}
          </h3>
          <p className="text-[15px] text-white/40 leading-relaxed">
            {t('cta_body')}
          </p>
        </div>
        <Link
          href="/contacto"
          className="bg-white text-[#0A0A0A] px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-white/90 transition-opacity whitespace-nowrap"
        >
          {t('cta_button')}
        </Link>
      </div>
    </section>
  )
}
