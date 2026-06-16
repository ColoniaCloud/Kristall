import { Users, ShoppingBag, Megaphone, TrendingUp } from 'lucide-react'

const pillars = [
  {
    tag: 'DEMANDA',
    title: 'Traemos los clientes',
    body: 'No esperás que aparezcan. Te los acercamos a la puerta del taller mediante derivación por zona.',
    icon: Users,
    dark: true,
  },
  {
    tag: 'CIERRE',
    title: 'Herramientas de venta',
    body: 'Todo lo que necesitás para convencer y cerrar en el momento: muestrario, tótem y capacitación.',
    icon: ShoppingBag,
    dark: false,
  },
  {
    tag: 'IMAGEN',
    title: 'Presencia y marketing',
    body: 'Tu taller se ve profesional y respaldado por una marca alemana. Listing web, redes y cartelería.',
    icon: Megaphone,
    dark: false,
  },
  {
    tag: 'LEALTAD',
    title: 'Respaldo y crecimiento',
    body: 'No te dejamos solo. Garantía digital, capacitación técnica y soporte WhatsApp permanente.',
    icon: TrendingUp,
    dark: true,
  },
]

export default function PuntoPillars() {
  return (
    <section className="bg-[var(--surface)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-muted)] mb-4">
          Todo lo que recibís como Punto Kristall
        </p>
        <h2 className="text-3xl font-medium text-[var(--text-primary)] mb-12" style={{ fontFamily: 'var(--font-display)' }}>
          Cuatro frentes. Un solo programa.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(({ tag, title, body, icon: Icon, dark }) => (
            <div
              key={tag}
              className={`rounded-2xl p-7 ${
                dark
                  ? 'bg-[#0A0A0A]'
                  : 'bg-[#F2F2F0] border border-[#E4E4E2] shadow-[var(--shadow-card)]'
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] mb-3 block">
                {tag}
              </span>
              <h3
                className={`text-2xl font-medium mb-3 ${
                  dark ? 'text-white' : 'text-[#0A0A0A]'
                }`}
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  dark ? 'text-white/45' : 'text-[#5C5C5C]'
                }`}
              >
                {body}
              </p>
              <Icon
                size={32}
                className={`mt-4 ${dark ? 'text-white/10' : 'text-[#0A0A0A]/10'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
