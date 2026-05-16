import { BadgeCheck, Sun, ShieldCheck } from 'lucide-react'

const CERTS = [
  {
    Icon: BadgeCheck,
    name: 'ISO 9001:2015',
    desc: 'Sistema de gestión de calidad en producción',
  },
  {
    Icon: Sun,
    name: 'ANSI / IWFA',
    desc: 'Estándar norteamericano para láminas de control solar',
  },
  {
    Icon: ShieldCheck,
    name: 'EN 12600',
    desc: 'Normativa europea de seguridad en vidriado',
  },
]

export default function AboutCertifications() {
  return (
    <section
      className="bg-[var(--bg)] border-t border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-6">
          Certificaciones
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CERTS.map(({ Icon, name, desc }) => (
            <div
              key={name}
              className="bg-white border border-[#E4E4E2] rounded-xl p-5 text-center shadow-[var(--shadow-card)]"
            >
              <div className="w-10 h-10 rounded-full bg-[#F2F2F0] border border-[#E4E4E2] flex items-center justify-center mx-auto mb-3">
                <Icon size={16} className="text-[#9A9A9A]" />
              </div>
              <div className="text-sm font-medium mb-1 text-[#0A0A0A]">{name}</div>
              <div className="text-[11px] text-[#9A9A9A] leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
