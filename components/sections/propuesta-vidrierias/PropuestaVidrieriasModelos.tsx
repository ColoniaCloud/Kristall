'use client'

import { useEffect, useRef, useState } from 'react'

function useInView(threshold = 0.1) {
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

export default function PropuestaVidrieriasModelos() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2)
  const { ref: cardsRef, inView: cardsInView } = useInView(0.05)
  const { ref: noteRef, inView: noteInView } = useInView(0.1)

  const models = [
    {
      letter: 'A',
      title: 'Revendedor Kristall',
      desc: 'Comprás el film al precio mayorista Kristall y lo vendés a tu cliente junto con la instalación. Nosotros te recomendamos instaladores certificados de la red Kristall para ejecutar el trabajo. Vos controlás el precio final y tu margen.',
      steps: [
        'Vidriería compra film',
        'Ofrece al cliente',
        'Instalador Kristall ejecuta',
        'Vidriería cobra',
      ],
      badgeLabel: 'Tu Margen',
      badgeVal: 'Libre',
      highlighted: false,
    },
    {
      letter: 'B',
      title: 'Servicio Tercerizado',
      desc: 'No comprás stock. Kristall pone el film y coordina al instalador. Vos presentás el servicio a tu cliente, fijás el precio que querés cobrar y nos transferís el costo Kristall. La diferencia es tuya.',
      steps: [
        'Cliente te consulta',
        'Kristall ejecuta todo',
        'Vos cobrás tu precio',
        'Diferencia = tu margen',
      ],
      badgeLabel: 'Inversión',
      badgeVal: 'Cero stock',
      highlighted: true, // Marked as red-border highlight in PDF
    },
    {
      letter: 'C',
      title: 'Canal Arquitectura',
      desc: 'Si trabajás con estudios de arquitectura, Kristall presenta el producto directamente. Cuando ese arquitecto especifica film Kristall en un proyecto, vos participás del negocio — tanto en aberturas como en film. Ideal para obras nuevas o remodelaciones.',
      steps: [
        'Vidriería facilita contacto',
        'Kristall presenta al estudio',
        'Arquitecto especifica',
        'Ambos capturan negocio',
      ],
      badgeLabel: 'Perfil',
      badgeVal: 'Alto ticket',
      highlighted: false,
    },
  ]

  return (
    <section className="bg-[var(--bg)] py-20 px-6 md:px-10">
      <div className="max-w-[1160px] mx-auto">
        
        {/* Section Header */}
        <div
          ref={headerRef}
          className="mb-12 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(15px)',
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#CC0000] mb-3 block">
            01 · Cómo trabajamos juntos
          </span>
          <h2
            className="text-3xl md:text-4xl font-medium text-[#0A0A0A] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Tres modelos. Uno se adapta a vos.
          </h2>
          <p className="text-base text-[#5C5C5C] leading-relaxed max-w-[700px]">
            No todas las vidrierías son iguales. Por eso Kristall ofrece tres formas de incorporar film a tu operación — desde la más simple hasta la más integrada. Podés empezar con una y escalar a otra.
          </p>
        </div>

        {/* Models Grid/List */}
        <div ref={cardsRef} className="flex flex-col gap-6 mb-8">
          {models.map((model, i) => (
            <div
              key={model.letter}
              className={`relative bg-white rounded-xl shadow-[var(--shadow-card)] p-6 md:p-8 flex flex-col lg:flex-row justify-between gap-6 transition-all duration-500 ${
                model.highlighted
                  ? 'border-2 border-[#CC0000]'
                  : 'border border-[--border]'
              }`}
              style={{
                opacity: cardsInView ? 1 : 0,
                transform: cardsInView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 120}ms`,
              }}
            >
              {/* Highlight Ribbon */}
              {model.highlighted && (
                <span className="absolute top-0 right-8 -translate-y-1/2 bg-[#CC0000] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Recomendado para empezar
                </span>
              )}

              {/* Left Side: Letter Badge + Content */}
              <div className="flex gap-4 items-start flex-1">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-xl ${
                    model.highlighted
                      ? 'bg-[#CC0000] text-white'
                      : 'bg-[#0A0A0A] text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {model.letter}
                </div>
                <div className="flex-1">
                  <h3
                    className="text-xl font-semibold text-[#0A0A0A] mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {model.title}
                  </h3>
                  <p className="text-[15px] text-[#5C5C5C] leading-relaxed mb-6 max-w-[680px]">
                    {model.desc}
                  </p>

                  {/* Flow Steps Diagram */}
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                    {model.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2 md:gap-3">
                        <span
                          className={`px-3 py-1.5 rounded-lg border font-medium ${
                            model.highlighted && idx === model.steps.length - 1
                              ? 'bg-[#CC0000]/10 border-[#CC0000]/20 text-[#CC0000]'
                              : 'bg-[#F2F2F0] border-[--border] text-[#0A0A0A]'
                          }`}
                        >
                          {step}
                        </span>
                        {idx < model.steps.length - 1 && (
                          <span className="text-[#9A9A9A] font-semibold">➔</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Side: Quick Spec Indicator */}
              <div className="lg:w-48 flex-shrink-0 flex flex-col justify-center items-start lg:items-end border-t lg:border-t-0 lg:border-l border-[--border] pt-4 lg:pt-0 lg:pl-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#9A9A9A] mb-1">
                  {model.badgeLabel}
                </span>
                <span
                  className={`text-xl font-bold ${
                    model.highlighted ? 'text-[#CC0000]' : 'text-[#0A0A0A]'
                  }`}
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {model.badgeVal}
                </span>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Combinable Note */}
        <div
          ref={noteRef}
          className="bg-white border border-[--border] rounded-xl p-5 shadow-[var(--shadow-card)] transition-all duration-500"
          style={{
            opacity: noteInView ? 1 : 0,
            transform: noteInView ? 'translateY(0)' : 'translateY(16px)',
          }}
        >
          <p className="text-[14px] text-[#5C5C5C] leading-relaxed">
            <span className="font-semibold text-[#0A0A0A]">Los modelos son combinables:</span> Podés arrancar con el <strong className="text-[#CC0000]">Modelo B</strong> sin invertir en stock, y a medida que crecés el volumen, migrar al <strong className="text-[#0A0A0A]">Modelo A</strong> para capturar más margen. El <strong className="text-[#0A0A0A]">Modelo C</strong> aplica en paralelo a cualquiera de los otros dos.
          </p>
        </div>

      </div>
    </section>
  )
}
