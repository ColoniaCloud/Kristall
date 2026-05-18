import { useTranslations } from 'next-intl'

export default function AboutTechnology() {
  const t = useTranslations('about')

  const SPECS = [
    [t('tech_spec_uv'), '99%'],
    [t('tech_spec_ir'), 'hasta 95%'],
    [t('tech_spec_thickness'), '1.5 mil — 8 mil'],
    [t('tech_spec_warranty'), 'Sin decoloración'],
    [t('tech_spec_adhesive'), 'Micro-canales'],
    [t('tech_bar_clarity'), '98%'],
  ]

  const BARS = [
    { label: t('tech_bar_solar'), value: '94%', width: 94 },
    { label: t('tech_bar_ir'), value: '95%', width: 95 },
    { label: t('tech_spec_uv'), value: '99%', width: 99 },
    { label: t('tech_bar_clarity'), value: '98%', width: 98 },
    { label: t('tech_bar_durability'), value: '10+ años', width: 85 },
  ]

  return (
    <section
      className="bg-[var(--surface)] border-t border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="section-label mb-6">
          {t('tech_label')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Specs */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="text-sm font-medium mb-5 text-[#0A0A0A]">{t('tech_specs_title')}</div>
            <div className="flex flex-col divide-y divide-[#E4E4E2]">
              {SPECS.map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3">
                  <span className="text-xs text-[#5C5C5C]">{label}</span>
                  <span className="text-xs font-medium text-[#0A0A0A]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="text-sm font-medium mb-5 text-[#0A0A0A]">{t('tech_perf_title')}</div>
            <div className="flex flex-col gap-5">
              {BARS.map(({ label, value, width }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-[#5C5C5C]">{label}</span>
                    <span className="text-xs font-medium text-[#0A0A0A]">{value}</span>
                  </div>
                  <div className="h-[3px] bg-[#E4E4E2] rounded-full">
                    <div
                      className="h-full bg-[#0A0A0A] rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
