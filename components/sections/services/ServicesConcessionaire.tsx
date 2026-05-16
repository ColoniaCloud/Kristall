import Image from 'next/image'
import { Check } from 'lucide-react'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export default function ServicesConcessionaire() {
  const t = useTranslations('services_page')

  const features = [
    { title: t('conc_f1_title'), desc: t('conc_f1_body') },
    { title: t('conc_f2_title'), desc: t('conc_f2_body') },
    { title: t('conc_f3_title'), desc: t('conc_f3_body') },
    { title: t('conc_f4_title'), desc: t('conc_f4_body') },
  ]

  return (
    <section
      className="bg-[var(--bg)]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Columna izquierda */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-4">
            {t('conc_label')}
          </div>
          <h2
            className="text-[#0A0A0A] mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 500,
            }}
          >
            {t('conc_headline')}
          </h2>
          <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
            {t('conc_body')}
          </p>

          <ul className="flex flex-col gap-3 mb-8">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded bg-[#0A0A0A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check size={11} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <span className="text-sm text-[#0A0A0A] font-medium">{f.title}</span>
                  <span className="block text-xs text-[#5C5C5C] mt-0.5">{f.desc}</span>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/contacto?servicio=concesionarias"
            className="inline-block bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            {t('conc_cta')}
          </Link>
        </div>

        {/* Columna derecha */}
        <div className="relative h-[420px] rounded-2xl overflow-hidden">
          {/* TODO: Reemplazar con imagen real de instalación en concesionaria */}
          <Image
            src="/porsche.png"
            alt="Servicio de polarizado para concesionarias"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
            <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A]">
              {t('conc_badge_label')}
            </div>
            <div
              className="text-xl text-[#0A0A0A]"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              {t('conc_badge_value')}
            </div>
            <div className="text-xs text-[#5C5C5C]">{t('conc_badge_body')}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
