'use client'

import { useEffect, useRef, useState } from 'react'
import { Home, Sparkles } from 'lucide-react'

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

export default function PropuestaVidrieriasProductos() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2)
  const { ref: autoRef, inView: autoInView } = useInView(0.05)
  const { ref: arqRef, inView: arqInView } = useInView(0.05)
  const { ref: diffRef, inView: diffInView } = useInView(0.1)

  const automotor = [
    {
      name: 'HP05 / HP15',
      type: 'Film Solar Básico',
      desc: 'Control de luz y privacidad. Ideal para el cliente que busca polarizado estándar a buen precio.',
      badge: 'ENTRADA',
      badgeColor: 'bg-white/10 text-white/80 border-white/20',
    },
    {
      name: 'IR0590 / IR1590 / IR8080',
      type: 'Film Infrarrojo IR',
      desc: 'Bloqueo de calor por tecnología infrarroja. Mayor confort térmico sin oscurecer el vidrio.',
      badge: 'PERFORMANCE',
      badgeColor: 'bg-[#CC0000]/10 text-[#FF4D4D] border-[#CC0000]/20',
    },
    {
      name: 'HT05100 / HT15100',
      type: 'Film Cerámico HT',
      desc: 'Tecnología cerámica de alta gama. Bloqueo térmico e infrarrojo superior sin interferencia de señal.',
      badge: 'PREMIUM',
      badgeColor: 'bg-[#CC0000]/10 text-[#FF4D4D] border-[#CC0000]/20',
    },
    {
      name: 'TPU-PC150',
      type: 'Protección de Pintura PPF',
      desc: 'Film de poliuretano para protección total de carrocería. Alta demanda en vehículos nuevos y de alta gama.',
      badge: 'ALTA GAMA',
      badgeColor: 'bg-[#CC0000]/15 text-[#FF4D4D] border-[#CC0000]/30',
    },
  ]

  const arquitectura = [
    {
      name: 'HSF15100',
      type: 'Film Cerámico HSF — Arquitectura',
      desc: 'Film de alta performance para ventanas de edificios, oficinas y locales comerciales. Control solar, privacidad y reducción de temperatura interior.',
      badge: 'ARQUITECTURA',
      badgeColor: 'bg-[#E6A800]/15 text-[#E6A800] border-[#E6A800]/30',
    },
    {
      name: 'IR Series — Architectural',
      type: 'Film Infrarrojo para Vidrios',
      desc: 'Aplicación en aberturas residenciales y comerciales. Compatible con vidrio simple y DVH. Ideal para especificación en proyectos de obra.',
      badge: 'PROYECTOS',
      badgeColor: 'bg-[#E6A800]/15 text-[#E6A800] border-[#E6A800]/30',
    },
  ]

  return (
    <section className="relative overflow-hidden py-20 px-6 md:px-10 bg-[#0A0A0A]">
      {/* Background Vitral Image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-VITRAL.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-black/90" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        
        {/* Header Block */}
        <div
          ref={headerRef}
          className="mb-16 transition-all duration-700"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(15px)',
          }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#CC0000] mb-3 block">
            02 · Línea de productos
          </span>
          <h2
            className="text-3xl md:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Film para cada tipo de proyecto.
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[650px]">
            Kristall tiene línea automotor y línea arquitectura. Como vidriería o empresa de aberturas, podés ofrecer ambas — para autos de tus clientes y para los vidrios de sus obras o locales.
          </p>
        </div>

        {/* LÍNEA AUTOMOTOR */}
        <div ref={autoRef} className="mb-14">
          <h3
            className="text-white text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 text-white/50"
          >
            <span>LÍNEA AUTOMOTOR</span>
            <div className="h-px bg-white/10 flex-1" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automotor.map((prod, i) => (
              <div
                key={prod.name}
                className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-500 hover:bg-white/[0.08] hover:border-white/20"
                style={{
                  opacity: autoInView ? 1 : 0,
                  transform: autoInView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="text-white text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                    {prod.name}
                  </h4>
                  <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border ${prod.badgeColor}`}>
                    {prod.badge}
                  </span>
                </div>
                <p className="text-xs text-white/40 mb-2 font-medium">{prod.type}</p>
                <p className="text-sm text-white/60 leading-relaxed">{prod.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* LÍNEA ARQUITECTURA */}
        <div ref={arqRef} className="mb-10">
          <h3
            className="text-white text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 text-[#E6A800]/70"
          >
            <span>LÍNEA ARQUITECTURA</span>
            <div className="h-px bg-[#E6A800]/10 flex-1" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {arquitectura.map((prod, i) => (
              <div
                key={prod.name}
                className="backdrop-blur-md bg-black/40 border border-[#E6A800]/25 rounded-xl p-6 transition-all duration-500 hover:bg-black/55 hover:border-[#E6A800]/45"
                style={{
                  opacity: arqInView ? 1 : 0,
                  transform: arqInView ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <div className="flex justify-between items-start gap-4 mb-3">
                  <h4 className="text-[#E6A800] text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                    {prod.name}
                  </h4>
                  <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border ${prod.badgeColor}`}>
                    {prod.badge}
                  </span>
                </div>
                <p className="text-xs text-white/55 mb-2 font-medium">{prod.type}</p>
                <p className="text-sm text-white/70 leading-relaxed">{prod.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CALLOUT CARD: OPORTUNIDAD DIFERENCIAL */}
        <div
          ref={diffRef}
          className="backdrop-blur-md bg-gradient-to-r from-[#E6A800]/10 to-transparent border border-[#E6A800]/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start transition-all duration-500"
          style={{
            opacity: diffInView ? 1 : 0,
            transform: diffInView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '150ms',
          }}
        >
          <div className="w-12 h-12 rounded-xl bg-[#E6A800] flex items-center justify-center flex-shrink-0">
            <Home className="text-[#0A0A0A] w-5 h-5" />
          </div>
          <div>
            <h4
              className="text-white text-lg font-medium mb-2 uppercase tracking-wide flex items-center gap-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span>Film para arquitectura: La Oportunidad Diferencial</span>
              <Sparkles className="w-4 h-4 text-[#E6A800]" />
            </h4>
            <p className="text-sm text-white/70 leading-relaxed">
              El mercado de film para edificios y locales comerciales en Argentina está subdesarrollado. Una vidriería con contactos en estudios de arquitectura tiene acceso directo a proyectos de alto volumen que ningún taller automotor puede alcanzar. Kristall te acompaña con presentaciones técnicas y muestras para especificación.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
