import { useTranslations } from 'next-intl'
import { BadgeCheck, Sun, ShieldCheck } from 'lucide-react'

export default function AboutCertifications() {
  const t = useTranslations('about')

  const certs = [
    { Icon: BadgeCheck, nameKey: 'cert_1_name', bodyKey: 'cert_1_body' },
    { Icon: Sun, nameKey: 'cert_2_name', bodyKey: 'cert_2_body' },
    { Icon: ShieldCheck, nameKey: 'cert_3_name', bodyKey: 'cert_3_body' },
  ]

  return (
    <section
      className="bg-[var(--bg)] border-t border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-6">
          {t('certs_label')}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {certs.map(({ Icon, nameKey, bodyKey }) => (
            <div
              key={nameKey}
              className="bg-white border border-[#E4E4E2] rounded-xl p-5 text-center shadow-[var(--shadow-card)]"
            >
              <div className="w-10 h-10 rounded-full bg-[#F2F2F0] border border-[#E4E4E2] flex items-center justify-center mx-auto mb-3">
                <Icon size={16} className="text-[#9A9A9A]" />
              </div>
              <div className="text-sm font-medium mb-1 text-[#0A0A0A]">{t(nameKey as Parameters<typeof t>[0])}</div>
              <div className="text-[11px] text-[#9A9A9A] leading-relaxed">{t(bodyKey as Parameters<typeof t>[0])}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
