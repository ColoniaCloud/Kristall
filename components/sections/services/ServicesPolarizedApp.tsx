import Image from 'next/image'
import { ClipboardList, Package, BarChart3, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ServicesPolarizedApp() {
  const t = useTranslations('services_page')

  const features = [
    { Icon: ClipboardList, title: t('app_f1_title'), desc: t('app_f1_body') },
    { Icon: Package, title: t('app_f2_title'), desc: t('app_f2_body') },
    { Icon: BarChart3, title: t('app_f3_title'), desc: t('app_f3_body') },
    { Icon: Clock, title: t('app_f4_title'), desc: t('app_f4_body') },
  ]

  return (
    <section
      className="bg-[#0A0A0A]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Columna izquierda — imagen */}
        <div className="relative h-[440px] rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/8">
          {/* TODO: Reemplazar con screenshot real de Polarized App */}
          <Image
            src="/porsche.png"
            alt="Polarized App"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-3 py-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-2 animate-pulse" />
            <span className="text-xs text-white/70">{t('app_badge')}</span>
          </div>
        </div>

        {/* Columna derecha — contenido */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-4">
            {t('app_label')}
          </div>
          <h2
            className="text-white mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 500,
            }}
          >
            {t('app_headline')}
          </h2>
          <p className="text-[15px] text-white/55 leading-relaxed mb-8">
            {t('app_body')}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/8 rounded-xl p-4"
              >
                <Icon size={16} className="text-white/40 mb-2" />
                <div className="text-[15px] font-medium text-white mb-1">{title}</div>
                <div className="text-sm text-white/45 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
              className="border border-white/25 text-white px-6 py-3 rounded-lg text-[15px] hover:bg-white hover:text-[#0A0A0A] transition-all"
          >
            {t('app_cta')}
          </button>
        </div>
      </div>
    </section>
  )
}
