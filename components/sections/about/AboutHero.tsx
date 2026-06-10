import { useTranslations } from 'next-intl'

export default function AboutHero() {
  const t = useTranslations('about')
  return (
    <section
      className="relative overflow-hidden bg-[#1A1A1A] min-h-[360px] md:min-h-[520px] pt-16 md:pt-[100px] px-6 md:px-10 pb-12 md:pb-20"
    >
      {/* Video de fondo */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      >
        <source src="/cat/video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/60 to-[#1A1A1A]/30" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex gap-1">
            <span className="w-4 h-[3px] rounded-sm bg-[#444]" />
            <span className="w-4 h-[3px] rounded-sm bg-[#CC0000]" />
            <span className="w-4 h-[3px] rounded-sm bg-[#E6A800]" />
          </div>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/35">
            {t('hero_eyebrow')}
          </span>
        </div>

        <h1
          className="text-white leading-tight mb-4"
          style={{
            fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4vw, 3.7rem)',
            fontWeight: 500,
          }}
        >
          {t('hero_headline')}
        </h1>

        <p className="text-sm md:text-[15px] text-white/80 max-w-[440px] leading-relaxed">
          {t('hero_body')}
        </p>
      </div>

      <div
        className="absolute bottom-4 right-0 font-bold text-white/[0.03] select-none pointer-events-none leading-none"
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '90px',
        }}
      >
        {t('hero_watermark')}
      </div>
    </section>
  )
}
