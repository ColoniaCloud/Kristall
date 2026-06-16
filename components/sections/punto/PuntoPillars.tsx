import Image from 'next/image'
import { Users, ShoppingBag, Megaphone, TrendingUp } from 'lucide-react'

const pillars = [
  {
    tag: 'DEMANDA',
    title: 'Traemos los clientes',
    body: 'No esperás que aparezcan. Te los acercamos a la puerta del taller mediante derivación por zona.',
    icon: Users,
  },
  {
    tag: 'CIERRE',
    title: 'Herramientas de venta',
    body: 'Todo lo que necesitás para convencer y cerrar en el momento: muestrario, tótem y capacitación.',
    icon: ShoppingBag,
  },
  {
    tag: 'IMAGEN',
    title: 'Presencia y marketing',
    body: 'Tu taller se ve profesional y respaldado por una marca alemana. Listing web, redes y cartelería.',
    icon: Megaphone,
  },
  {
    tag: 'LEALTAD',
    title: 'Respaldo y crecimiento',
    body: 'No te dejamos solo. Garantía digital, capacitación técnica y soporte WhatsApp permanente.',
    icon: TrendingUp,
  },
]

export default function PuntoPillars() {
  return (
    <section className="relative overflow-hidden py-16 px-10">
      <Image
        src="/cat/top-KLAR.jpg"
        alt=""
        fill
        className="absolute inset-0 object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-4">
          Todo lo que recibís como Punto Kristall
        </p>
        <h2
          className="text-3xl font-medium text-white mb-12"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Cuatro frentes. Un solo programa.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(({ tag, title, body, icon: Icon }) => (
            <div
              key={tag}
              className="relative rounded-2xl p-7 flex flex-col backdrop-blur-md bg-white/[0.08] border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
            >
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] mb-3 block">
                {tag}
              </span>
              <h3
                className="text-2xl font-medium text-white mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-white/55">{body}</p>
              <Icon size={32} className="mt-4 text-white/20" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
