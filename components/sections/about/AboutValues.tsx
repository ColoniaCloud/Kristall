import { useTranslations } from 'next-intl'
import { RefreshCw, Eye, Award, Leaf, Headphones } from 'lucide-react'

export default function AboutValues() {
  const t = useTranslations('about')

  const smallCards = [
    { Icon: Award, titleKey: 'values_5_title', bodyKey: 'values_5_body', dark: false },
    { Icon: Leaf, titleKey: 'values_6_title', bodyKey: 'values_6_body', dark: false },
    { Icon: Headphones, titleKey: 'values_7_title', bodyKey: 'values_7_body', dark: true },
  ]

  return (
    <section className="bg-[var(--bg)] pt-6 pb-10 px-6 md:pt-8 md:pb-16 md:px-10">
      <div className="max-w-[1160px] mx-auto">
        <div className="section-label mb-6">
          {t('values_label')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          {/* Card 01 */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6">
            <div
              className="leading-none mb-3 text-white/[0.06]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '40px',
                fontWeight: 500,
              }}
            >
              01
            </div>
            <div className="text-[15px] font-medium text-white mb-2">{t('values_1_title')}</div>
            <div className="text-sm text-white/45 leading-relaxed">
              {t('values_1_body')}
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white border border-[#E4E4E2] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <RefreshCw size={18} className="text-[#9A9A9A] mb-3" />
            <div className="text-[15px] font-medium text-[#0A0A0A] mb-2">{t('values_2_title')}</div>
            <div className="text-sm text-[#5C5C5C] leading-relaxed">
              {t('values_2_body')}
            </div>
          </div>

          {/* Card 03 */}
          <div className="md:col-span-2 bg-white border border-[#E4E4E2] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <Eye size={18} className="text-[#9A9A9A] mb-3" />
            <div className="text-[15px] font-medium text-[#0A0A0A] mb-2">{t('values_3_title')}</div>
            <div className="text-sm text-[#5C5C5C] leading-relaxed">
              {t('values_3_body')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {smallCards.map(({ Icon, titleKey, bodyKey, dark }) => (
            <div
              key={titleKey}
              className={dark ? 'bg-[#1A1A1A] rounded-xl p-4' : 'bg-white border border-[#E4E4E2] rounded-xl p-4 shadow-[var(--shadow-card)]'}
            >
              <Icon size={15} className={dark ? 'text-white/30 mb-2' : 'text-[#9A9A9A] mb-2'} />
              <div className={`text-sm font-medium mb-1 ${dark ? 'text-white' : 'text-[#0A0A0A]'}`}>{t(titleKey as Parameters<typeof t>[0])}</div>
              <div className={`text-xs leading-relaxed ${dark ? 'text-white/45' : 'text-[#9A9A9A]'}`}>{t(bodyKey as Parameters<typeof t>[0])}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
