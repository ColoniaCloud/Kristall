import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function ServicesCTA() {
  const t = useTranslations('services_page')
  return (
    <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
      <div className="max-w-[640px] mx-auto text-center">
        <h2
          className="text-[#0A0A0A] mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 3vw, 2.7rem)',
            fontWeight: 500,
          }}
        >
          {t('final_headline')}
        </h2>
        <p className="text-[15px] text-[#5C5C5C] leading-relaxed mb-8">
          {t('final_body')}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/contacto?servicio=software"
            className="btn-primary inline-block text-white px-6 py-3 rounded-lg text-[15px] font-medium transition-all"
          >
            {t('final_cta1')}
          </Link>
          <Link
            href="/productos"
            className="inline-block border border-[#0A0A0A] text-[#0A0A0A] px-6 py-3 rounded-lg text-[15px] font-medium hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            {t('final_cta2')}
          </Link>
        </div>
      </div>
    </section>
  )
}
