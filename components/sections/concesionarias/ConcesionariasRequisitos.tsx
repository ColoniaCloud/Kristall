'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronRight } from 'lucide-react'

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

const compromisos = [
  'Adoptar Kristall como lámina de tu salón',
  'Ofrecer el polarizado en la venta del 0km',
  'Que tu instalador tercerizado trabaje con lámina Kristall',
  'Activar la garantía digital cruzada en el sistema',
  'Usar las herramientas de cierre (tótem, medidor, muestrario)',
  'Mantener la experiencia premium con el cliente',
]

export default function ConcesionariasRequisitos() {
  const { ref: leftRef, inView: leftInView } = useInView(0.15)
  const { ref: rightRef, inView: rightInView } = useInView(0.1)

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

      <div className="relative z-10 max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Columna izquierda */}
        <div ref={leftRef}>
          <span
            className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#CC0000] mb-3 block transition-all duration-700"
            style={{ opacity: leftInView ? 1 : 0, transform: leftInView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '0ms' }}
          >
            03 · LO QUE PEDIMOS
          </span>
          <h2
            className="text-3xl font-medium text-white mb-4 transition-all duration-700"
            style={{ fontFamily: 'var(--font-display)', opacity: leftInView ? 1 : 0, transform: leftInView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '80ms' }}
          >
            Qué pedimos a cambio
          </h2>
          <p
            className="text-[15px] text-white/60 leading-relaxed transition-all duration-700"
            style={{ opacity: leftInView ? 1 : 0, transform: leftInView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '160ms' }}
          >
            El alta es ágil y sin obras. Te equipamos el salón, capacitamos a tu equipo y
            coordinamos con tu instalador.
          </p>
        </div>

        {/* Columna derecha — glass card */}
        <div
          ref={rightRef}
          className="backdrop-blur-md bg-white/[0.07] border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)] rounded-2xl p-6 transition-all duration-500"
          style={{ opacity: rightInView ? 1 : 0, transform: rightInView ? 'translateX(0)' : 'translateX(24px)', transitionDelay: '100ms' }}
        >
          <p className="text-[15px] font-semibold text-white mb-5">
            Compromisos del programa
          </p>
          <ul className="flex flex-col gap-3">
            {compromisos.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-3 transition-all duration-500"
                style={{
                  opacity: rightInView ? 1 : 0,
                  transform: rightInView ? 'translateY(0)' : 'translateY(10px)',
                  transitionDelay: `${200 + i * 60}ms`,
                }}
              >
                <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight size={11} className="text-white" />
                </div>
                <p className="text-[15px] text-white/70 leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
