import { useTranslations } from 'next-intl'

export default function AboutTimeline() {
  const t = useTranslations('about')

  const items = [
    { year: t('timeline_1_year'), title: t('timeline_1_title'), desc: t('timeline_1_body') },
    { year: t('timeline_2_year'), title: t('timeline_2_title'), desc: t('timeline_2_body') },
    { year: t('timeline_3_year'), title: t('timeline_3_title'), desc: t('timeline_3_body') },
    { year: t('timeline_4_year'), title: t('timeline_4_title'), desc: t('timeline_4_body') },
    { year: t('timeline_5_year'), title: t('timeline_5_title'), desc: t('timeline_5_body') },
  ]

  return (
    <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-8">
          {t('timeline_label')}
        </div>

        <div className="flex flex-col gap-0">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1
            return (
              <div
                key={item.year}
                className="grid grid-cols-[72px_1px_1fr] gap-x-4 pb-7 last:pb-0"
              >
                <span className="text-[13px] font-medium text-[#9A9A9A] text-right pt-0.5 tracking-wide">
                  {item.year}
                </span>
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0A0A0A] border border-[#C8C8C4] flex-shrink-0 mt-1" />
                  {!isLast && <div className="flex-1 w-px bg-[#E4E4E2] mt-1" />}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0A0A0A] mb-1">{item.title}</div>
                  <div className="text-xs text-[#5C5C5C] leading-relaxed">{item.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
