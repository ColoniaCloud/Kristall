'use client'

import { useEffect, useRef, useState } from 'react'

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

export default function PropuestaVidrieriasPasos() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2)
  const { ref: stepsRef, inView: stepsInView } = useInView(0.05)

  const steps = [
    {
      num: '01',
      title: 'Reunión inicial',
      desc: 'Presentamos los tres modelos y definimos cuál aplica mejor a tu operación y estructura actual.',
    },
    {
      num: '02',
      title: 'Activación',
      desc: 'Según el modelo elegido: alta como revendedor, acuerdo de servicio, o presentación a estudios.',
    },
    {
      num: '03',
      title: 'Primera venta',
      desc: 'Te acompañamos y asesoramos en el primer trabajo para asegurar la calidad y la experiencia del cliente.',
    },
    {
      num: '04',
      title: 'Escalás',
      desc: 'Con resultados reales, definimos cómo crecer: más volumen, más modelos activos, arquitectura.',
    },
  ]

  return (
    <section className="relative overflow-hidden py-20 px-6 md:px-10 bg-[#0A0A0A]">
      {/* Background KLAR Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-KLAR.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        
        {/* Header Block */}
        <div
          ref={headerRef}
          className="mb-14 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#CC0000] mb-3 block">
            04 · Cómo arrancamos
          </span>
          <h2
            className="text-3xl md:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cuatro pasos para activar el canal.
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[600px]">
            Sin burocracia. Definís cómo querés operar y en la primera reunión ya tenés claro el modelo que más te conviene.
          </p>
        </div>

        {/* Steps Grid */}
        <div
          ref={stepsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="relative backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
              style={{
                opacity: stepsInView ? 1 : 0,
                transform: stepsInView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* Giant Translucent Number */}
              <span
                className="text-4xl font-bold text-[#CC0000] block mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step.num}
              </span>
              <h3 className="text-white text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
