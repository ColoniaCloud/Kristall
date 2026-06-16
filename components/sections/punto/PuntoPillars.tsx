'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, ShoppingBag, Megaphone, TrendingUp } from 'lucide-react'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

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

function SectionHeader() {
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref}>
      <p
        className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-4 transition-all duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transitionDelay: '0ms',
        }}
      >
        Todo lo que recibís como Punto Kristall
      </p>
      <h2
        className="text-3xl font-medium text-white mb-12 transition-all duration-700"
        style={{
          fontFamily: 'var(--font-display)',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transitionDelay: '120ms',
        }}
      >
        Cuatro frentes. Un solo programa.
      </h2>
    </div>
  )
}

function PillarCard({
  tag,
  title,
  body,
  icon: Icon,
  delay,
}: {
  tag: string
  title: string
  body: string
  icon: React.ElementType
  delay: number
}) {
  const { ref, inView } = useInView(0.1)

  return (
    <div
      ref={ref}
      className="relative rounded-2xl p-7 flex flex-col backdrop-blur-md bg-white/[0.08] border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/50 mb-3 block">
        {tag}
      </span>
      <h3
        className="text-2xl font-medium text-[#E6A800] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <p className="text-base leading-relaxed text-white">{body}</p>
      <Icon size={32} className="mt-4 text-[#E6A800]/40" />
    </div>
  )
}

export default function PuntoPillars() {
  return (
    <section className="relative overflow-hidden py-16 px-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-KLAR.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <SectionHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(({ tag, title, body, icon }, i) => (
            <PillarCard
              key={tag}
              tag={tag}
              title={title}
              body={body}
              icon={icon}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
