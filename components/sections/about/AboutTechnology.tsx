import { useTranslations } from 'next-intl'

export default function AboutTechnology() {
  const t = useTranslations('about')

  const SPECS = [
    [t('tech_spec_uv'), '99%'],
    [t('tech_spec_ir'), 'hasta 95%'],
    [t('tech_spec_thickness'), '1 mil — 12 mil'],
    [t('tech_spec_warranty'), t('tech_spec_warranty_value')],
    [t('tech_spec_adhesive'), 'Micro-canales'],
    [t('tech_bar_clarity'), '98%'],
  ]

  const LAYERS = [
    { bg: 'bg-[#EBEBEA]', text: 'text-[#444]', name: t('layer_1_name'), func: t('layer_1_desc') },
    { bg: 'bg-[#DCDCDA]', text: 'text-[#333]', name: t('layer_2_name'), func: t('layer_2_desc') },
    { bg: 'bg-[#C8C8C6]', text: 'text-[#222]', name: t('layer_3_name'), func: t('layer_3_desc') },
    { bg: 'bg-[#ADADAB]', text: 'text-[#111]', name: t('layer_4_name'), func: t('layer_4_desc') },
    { bg: 'bg-[#888886]', text: 'text-white', name: t('layer_5_name'), func: t('layer_5_desc') },
    { bg: 'bg-[#5C5C5A]', text: 'text-white', name: t('layer_6_name'), func: t('layer_6_desc') },
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
            <div className="text-[15px] font-medium mb-5 text-[#0A0A0A]">{t('tech_specs_title')}</div>
            <div className="flex flex-col divide-y divide-[#E4E4E2]">
              {SPECS.map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-3">
                  <span className="text-sm text-[#5C5C5C]">{label}</span>
                  <span className="text-sm font-medium text-[#0A0A0A]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Layers */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="text-[15px] font-medium mb-5 text-[#0A0A0A]">{t('layers_title')}</div>
            <div className="flex flex-col gap-1.5">
              {LAYERS.map((l) => (
                <div
                  key={l.name}
                  className={`${l.bg} ${l.text} rounded-lg px-4 py-3 flex justify-between items-center`}
                >
                  <span className="text-sm font-medium">{l.name}</span>
                  <span className="text-xs opacity-60">{l.func}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
