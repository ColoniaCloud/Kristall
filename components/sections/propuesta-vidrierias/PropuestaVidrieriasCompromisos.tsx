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

const compromisos = [
  'Presentar soluciones Kristall cuando el cliente necesite control solar o seguridad para vidrios.',
  'Instalar únicamente mediante personal certificado por Kristall, ya sea propio, tercerizado o perteneciente a nuestra red.',
  'Registrar cada instalación para emitir el Certificado Digital de Instalación Kristall.',
  'Compartir fotografías de los trabajos realizados para control de calidad y soporte.',
  'Mantener los estándares de atención e instalación definidos por la marca.',
]

export default function PropuestaVidrieriasCompromisos() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2)
  const { ref: gridRef, inView: gridInView } = useInView(0.05)

  return (
    <section className="relative overflow-hidden py-20 px-6 md:px-10 bg-[#0A0A0A]">
      {/* Background KARBON Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-KARBON.jpg)',
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
          className="mb-14 transition-all duration-1000"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            COMPROMISOS PARA MANTENER LA CERTIFICACIÓN
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[680px]">
            Para garantizar una experiencia premium y proteger el prestigio de la marca, los Socios Autorizados Kristall se comprometen a:
          </p>
        </div>

        {/* Compromisos Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {compromisos.map((compromiso, i) => (
            <div
              key={compromiso}
              className="relative backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-700 hover:bg-white/[0.08] hover:border-white/20"
              style={{
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#E6A800]/15 text-[#E6A800] flex-shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed">{compromiso}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
