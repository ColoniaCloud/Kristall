import { useTranslations } from 'next-intl'

export default function BrandHistory() {
  const t = useTranslations('about')
  return (
    <section
      className="bg-[var(--surface)] border-b border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

        {/* Columna izquierda */}
        <div>
          <p className="section-label mb-4">{t('brand_history_label')}</p>
          <h2
            className="font-medium text-[#0A0A0A] leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 500,
            }}
          >
            {t('brand_history_title')}
          </h2>
        </div>

        {/* Columna derecha */}
        <div>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-4">{t('brand_history_body1')}</p>
          <p className="text-sm text-[#5C5C5C] leading-relaxed">{t('brand_history_body2')}</p>
          <div className="w-8 h-[2px] bg-[#E4E4E2] mt-6" />
        </div>

      </div>
    </section>
  )
}
