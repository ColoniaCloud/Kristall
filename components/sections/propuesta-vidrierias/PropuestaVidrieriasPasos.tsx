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
      desc: 'Analizamos tu empresa y definimos si el mejor camino es certificar tu equipo, incorporar el servicio o abrir canal de arquitectura.',
    },
    {
      num: '02',
      title: 'Activación del programa',
      desc: 'Acordamos el modelo de trabajo, la capacitación y la forma de operar para que empieces con claridad.',
    },
    {
      num: '03',
      title: 'Primera instalación',
      desc: 'Te acompañamos en el primer proyecto para asegurar la calidad del trabajo y la emisión del Certificado Digital.',
    },
    {
      num: '04',
      title: 'Escalás con respaldo',
      desc: 'Con resultados reales, sumás volumen y expandís tu oferta con la confianza de la marca Kristall.',
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
          <h2
            className="text-3xl md:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cuatro pasos para activar tu negocio como socio Kristall.
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[680px]">
            El proceso es simple y rápido: definís cómo querés operar, activás el programa y empezás a vender con respaldo técnico, comercial y garantía digital.
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
