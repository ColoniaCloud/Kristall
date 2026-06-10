import Image from 'next/image'
import GermanyFlag from '@/components/common/GermanyFlag'
import { useTranslations } from 'next-intl'

export default function ServicesHero() {
  const t = useTranslations('services_page')
  return (
    <section className="relative overflow-hidden bg-[#1A1A1A] pt-14 md:pt-[72px] px-6 md:px-10 pb-12 md:pb-16">
      <Image
        src="/porsche.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2.5">
          <GermanyFlag />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/50">
            {t('hero_eyebrow')}
          </span>
        </div>

        <h1
          className="font-[var(--font-display)] text-white max-w-[500px] mt-4 mb-4 leading-[1.1]"
          style={{
            fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
            fontWeight: 600,
          }}
        >
          {t('hero_headline')}
        </h1>

        <p className="text-[15px] text-white/55 max-w-[420px] leading-relaxed">
          {t('hero_body')}
        </p>

        <div className="flex gap-3 mt-8">
          <div className="bg-white/6 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <div
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              {t('hero_stat1_value')}
            </div>
            <div className="text-[11px] text-white/45 mt-1">
              {t('hero_stat1_label')}
            </div>
          </div>
          <div className="bg-white/6 border border-white/10 rounded-xl px-5 py-4 backdrop-blur-sm">
            <div
              className="text-2xl text-white"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
            >
              {t('hero_stat2_value')}
            </div>
            <div className="text-[11px] text-white/45 mt-1">
              {t('hero_stat2_label')}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
