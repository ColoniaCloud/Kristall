'use client'

import { useEffect, useRef, useState } from 'react'

const cards = [
  {
    title: 'Ingresos premium',
    text: 'Sumá una nueva unidad de negocio con márgenes atractivos y un producto que se vende con valor de marca.',
    bg: '#111111',
    textColor: 'text-white',
  },
  {
    title: 'Soporte real',
    text: 'Te acompañamos desde la primera reunión con capacitación, respaldo técnico y herramientas para vender mejor.',
    bg: '#CC0000',
    textColor: 'text-white',
  },
  {
    title: 'Garantía y confianza',
    text: 'Cada instalación queda respaldada con el Certificado Digital de Instalación Kristall.',
    bg: '#E6A800',
    textColor: 'text-[#111111]',
  },
]

export default function PropuestaVidrieriasStackCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateActive = () => {
      const rect = container.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const cards = Array.from(container.querySelectorAll<HTMLElement>('[data-card]'))

      let nearestIndex = 0
      let nearestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect()
        const cardCenter = cardRect.top + cardRect.height / 2
        const distance = Math.abs(cardCenter - center)

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestIndex = index
        }
      })

      setActiveIndex(nearestIndex)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [])

  return (
    <section className="bg-[#F5F2EB] py-16 px-6 md:px-10 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-10 max-w-[720px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#CC0000] mb-3">
            Más que un producto
          </p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Un modelo de negocio que crece con vos.
          </h2>
          <p className="text-[16px] md:text-base text-[#5C5C5C] leading-relaxed">
            Las ventajas de trabajar con Kristall se consolidan en tres pilares: ingresos, soporte y confianza. Cada una se presenta como una capa que acompaña la evolución de tu empresa.
          </p>
        </div>

        <div ref={containerRef} className="relative min-h-[760px]">
          {cards.map((card, index) => {
            const offset = index * 24
            const isActive = index === activeIndex
            return (
              <article
                key={card.title}
                data-card
                className={`sticky top-24 rounded-[24px] p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.12)] transition-all duration-500 ${isActive ? 'scale-[1.005] shadow-[0_24px_60px_rgba(0,0,0,0.16)]' : 'scale-[0.985] opacity-90'}`}
                style={{
                  marginTop: `${offset}px`,
                  backgroundColor: card.bg,
                }}
              >
                <div className={`h-[220px] flex flex-col justify-between ${card.textColor}`}>
                  <div>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.24em] mb-3 ${card.textColor === 'text-white' ? 'text-white/70' : 'text-[#111111]/70'}`}>
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </p>
                    <h3 className="text-2xl font-medium mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                      {card.title}
                    </h3>
                    <p className={`text-sm md:text-[16px] leading-relaxed max-w-[560px] ${card.textColor === 'text-white' ? 'text-white/85' : 'text-[#111111]/85'}`}>
                      {card.text}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] ${card.textColor === 'text-white' ? 'text-white/75' : 'text-[#111111]/70'}`}>
                    <span>Kristall</span>
                    <span className={card.textColor === 'text-white' ? 'text-white/40' : 'text-[#111111]/40'}>•</span>
                    <span>Socios autorizados</span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
