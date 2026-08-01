'use client'

import { useEffect, useRef, useState } from 'react'
import { ShieldCheck, Mail, ArrowRight } from 'lucide-react'

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

export default function PropuestaVidrieriasGarantia() {
  const { ref: leftRef, inView: leftInView } = useInView(0.15)
  const { ref: rightRef, inView: rightInView } = useInView(0.1)

  return (
    <section className="bg-white py-20 px-6 md:px-10 border-t border-[--border] border-b border-[--border]">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Column (Text) */}
        <div
          ref={leftRef}
          className="md:col-span-6 transition-all duration-700"
          style={{
            opacity: leftInView ? 1 : 0,
            transform: leftInView ? 'translateY(0)' : 'translateY(15px)',
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-medium text-[#0A0A0A] mb-5 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Cada instalación con garantía digital Kristall.
          </h2>
          <p className="text-base text-[#5C5C5C] leading-relaxed mb-6">
            Cada instalación original Kristall genera automáticamente un Certificado Digital de Instalación. Ese documento registra el trabajo realizado, los metros instalados y la cobertura asociada, y se envía al cliente final para reforzar la confianza y la trazabilidad.
          </p>
          <div className="flex flex-col gap-3 text-sm text-[#5C5C5C]">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000] flex-shrink-0">
                <span className="text-xs font-bold">✓</span>
              </div>
              <p>Protege el respaldo de garantía y evita que el cliente quede sin verificación.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#CC0000]/10 flex items-center justify-center text-[#CC0000] flex-shrink-0">
                <span className="text-xs font-bold">✓</span>
              </div>
              <p>Fortalece la reputación de tu empresa y la diferencia frente a la competencia.</p>
            </div>
          </div>
        </div>

        {/* Right Column (Glass Card / Mock Certificate Box) */}
        <div
          ref={rightRef}
          className="md:col-span-6 transition-all duration-700"
          style={{
            opacity: rightInView ? 1 : 0,
            transform: rightInView ? 'translateX(0)' : 'translateX(24px)',
            transitionDelay: '100ms',
          }}
        >
          <div className="bg-[#F2F2F0] border border-[--border] rounded-xl p-6 md:p-8 shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] flex items-center justify-center text-[#E6A800] flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold text-[#0A0A0A]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  GARANTÍA DIGITAL KRISTALL
                </h3>
                <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9A9A9A]">
                  COBERTURA DE PRECISIÓN
                </span>
              </div>
            </div>

            <p className="text-sm text-[#5C5C5C] leading-relaxed mb-6">
              El cliente final recibe su certificado por email con los datos de la instalación, el producto y la cobertura. Vos como socio Kristall quedás asociado a cada garantía emitida, lo que te aporta trazabilidad total y un respaldo de marca visible en cada trabajo.
            </p>

            <div className="border-t border-[--border] pt-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex items-center gap-2 text-xs text-[#9A9A9A]">
                <Mail className="w-4 h-4" />
                <span>Envío directo automático</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-[#CC0000]">
                <span>Trazabilidad 100% digital</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
