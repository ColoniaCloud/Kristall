'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

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

const benefits = [
  'Incorporás un servicio con excelentes márgenes.',
  'Incrementás la rentabilidad de cada proyecto de aberturas.',
  'Ofrecés productos premium con Garantía Digital Kristall.',
  'Contás con respaldo técnico y comercial permanente.',
  'Accedés a instaladores certificados si no tenés equipo propio.',
]

export default function PropuestaVidrieriasBenefits() {
  const { ref, inView } = useInView(0.2)

  return (
    <section className="bg-white py-20 px-6 md:px-10 border-t border-[--border]">
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-medium text-[#0A0A0A]" style={{ fontFamily: 'var(--font-display)' }}>
            ¿POR QUÉ SUMAR KRISTALL?
          </h2>
        </div>

        {/* Desktop / tablet: static grid */}
        <div className="hidden gap-4 md:grid md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="group rounded-[20px] border border-[--border] bg-[#FAFAF8] p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${index * 90}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a] flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-[16px] leading-relaxed text-[#222222]">{benefit}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: parallax stack — first card stays put, the rest pile on top of it */}
        <div className="relative min-h-[1180px] md:hidden">
          {benefits.map((benefit, index) => (
            <div
              key={benefit}
              className="sticky top-24 rounded-[20px] border border-[--border] bg-[#FAFAF8] p-5 shadow-[0_18px_40px_rgba(0,0,0,0.1)]"
              style={{
                marginTop: index === 0 ? 0 : `${index * 20}px`,
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 500ms ease ${index * 90}ms, transform 500ms ease ${index * 90}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#16a34a]/10 text-[#16a34a] flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-[16px] leading-relaxed text-[#222222]">{benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
