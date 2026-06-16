'use client'

import { useEffect, useRef, useState } from 'react'
import { Layers, ShieldCheck, Sun, BookOpen, Package, Info } from 'lucide-react'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

const items = [
  {
    icon: Layers,
    title: 'Muestrarios físicos',
    body: 'De toda la gama, para mostrar y comparar en el escritorio de venta.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía digital cruzada',
    body: 'Certificado de marca para cada cliente. Respaldo que protege la reputación de tu salón.',
  },
  {
    icon: Sun,
    title: 'Tótem solar demostrador',
    body: 'Muestra el rechazo de calor en vivo. Argumento de venta que trabaja solo.',
  },
  {
    icon: BookOpen,
    title: 'Capacitación al equipo',
    body: 'A tu fuerza de ventas: cómo presentar la gama y justificar el precio premium.',
  },
  {
    icon: Package,
    title: 'Gama completa disponible',
    body: 'Desde la línea KLAR hasta la premium KERAMX, lista para cada segmento del salón.',
  },
]

function HeaderBlock() {
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref}>
      <span
        className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] mb-3 block transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '0ms' }}
      >
        02 · QUÉ APORTAMOS
      </span>
      <h2
        className="text-3xl font-medium text-[#0A0A0A] mb-3 transition-all duration-700"
        style={{ fontFamily: 'var(--font-display)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '80ms' }}
      >
        Lo que dejamos en tu salón
      </h2>
      <p
        className="text-[16px] text-white leading-relaxed mb-12 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '160ms' }}
      >
        Equipamos tu concesionaria con todo lo necesario para vender polarizado premium desde
        el primer día.
      </p>
    </div>
  )
}

function ItemCard({ icon: Icon, title, body, delay }: { icon: React.ElementType; title: string; body: string; delay: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <div
      ref={ref}
      className="bg-white border border-[#E4E4E2] rounded-2xl p-6 flex items-start gap-4 shadow-[var(--shadow-card)] transition-all duration-500"
      style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: `${delay}ms` }}
    >
      <div className="w-11 h-11 rounded-xl bg-[#E6A800] flex items-center justify-center flex-shrink-0">
        <Icon size={20} className="text-[#0A0A0A]" />
      </div>
      <div>
        <p className="text-[16px] font-semibold text-white mb-1.5">{title}</p>
        <p className="text-[16px] text-white leading-relaxed">{body}</p>
      </div>
    </div>
  )
}

export default function ConcesionariasEquipamiento() {
  const { ref: noteRef, inView: noteInView } = useInView(0.1)

  return (
    <section className="bg-[var(--bg)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto">
        <HeaderBlock />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(({ icon, title, body }, i) => (
            <ItemCard key={title} icon={icon} title={title} body={body} delay={i * 80} />
          ))}
        </div>

        <div
          ref={noteRef}
          className="mt-6 bg-[#F2F2F0] border border-[#E4E4E2] rounded-xl p-4 flex items-start gap-3 transition-all duration-500"
          style={{ opacity: noteInView ? 1 : 0, transform: noteInView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '400ms' }}
        >
          <Info size={15} className="text-[#9A9A9A] flex-shrink-0 mt-0.5" />
          <p className="text-[16px] text-white italic">
            El tester solar de calor (medidor) se adquiere por separado — es la herramienta de
            cierre más efectiva en el escritorio de venta.
          </p>
        </div>
      </div>
    </section>
  )
}
