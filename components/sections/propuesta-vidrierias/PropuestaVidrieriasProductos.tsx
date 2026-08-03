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

  const beneficios = [
    {
      name: 'Línea completa de films',
      type: 'Control solar, seguridad y decoración',
      desc: 'Accedé a toda la gama Kristall para control solar, seguridad y decoración, junto con muestrarios profesionales para presentar cada solución con claridad y profesionalismo.',
      badge: 'GAMA',
      badgeColor: 'bg-white/10 text-white/80 border-white/20',
    },
    {
      name: 'Certificación de instaladores',
      type: 'Capacitación y estándar Kristall',
      desc: 'Si ya contás con equipo propio, lo capacitamos y certificamos para que cada trabajo se ejecute con el mismo nivel de calidad.',
      badge: 'CERTIFICACIÓN',
      badgeColor: 'bg-[#CC0000]/10 text-[#FF4D4D] border-[#CC0000]/20',
    },
    {
      name: 'Red de instaladores certificados',
      type: 'Sin necesidad de armar tu propio equipo',
      desc: 'Si todavía no ofrecés este servicio, ponemos a disposición nuestra red para ejecutar cada trabajo con respaldo de la marca.',
      badge: 'RED',
      badgeColor: 'bg-[#CC0000]/10 text-[#FF4D4D] border-[#CC0000]/20',
    },
    {
      name: 'Herramientas para vender más',
      type: 'Demostradores y material comercial',
      desc: 'Disponés de tótem demostrador solar, medidor infrarrojo y material comercial personalizado para reforzar tus ventas. Estas herramientas pueden adquirirse por separado o bonificarse según el volumen de compra.',
      badge: 'VENTA',
      badgeColor: 'bg-[#CC0000]/15 text-[#FF4D4D] border-[#CC0000]/30',
    },
  ]

  const soporte = [
    {
      name: 'Soporte técnico y comercial',
      type: 'Acompañamiento antes, durante y después',
      desc: 'Nuestro equipo te acompaña en cada etapa para que puedas vender más, resolver dudas y sostener la relación con tus clientes. No solo proveemos film: trabajamos para ayudarte a vender más.',
      badge: 'SOPORTE',
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
          className="mb-16 transition-all duration-1000"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(15px)',
          }}
        >
          <h2
            className="text-3xl md:text-4xl font-medium text-white mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Qué recibís como socio Kristall.
          </h2>
          <p className="text-base text-white/60 leading-relaxed max-w-[680px]">
            El programa reúne producto, capacitación, herramientas de venta y respaldo digital para que tu empresa pueda ofrecer soluciones premium de control solar y seguridad con la confianza de la marca.
          </p>
        </div>

        {/* LÍNEA AUTOMOTOR */}
        <div ref={autoRef} className="mb-14">
          <h3
            className="text-white text-sm font-semibold uppercase tracking-wider mb-6 flex items-center gap-2 text-white/50"
          >
            <span>LO QUE RECIBÍS</span>
            <div className="h-px bg-white/10 flex-1" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beneficios.map((prod, i) => (
              <div
                key={prod.name}
                className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-700 hover:bg-white/[0.08] hover:border-white/20"
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
            <span>RESPALDO Y SOPORTE</span>
            <div className="h-px bg-[#E6A800]/10 flex-1" />
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {soporte.map((prod, i) => (
              <div
                key={prod.name}
                className="backdrop-blur-md bg-black/40 border border-[#E6A800]/25 rounded-xl p-6 transition-all duration-700 hover:bg-black/55 hover:border-[#E6A800]/45"
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
          className="backdrop-blur-md bg-gradient-to-r from-[#E6A800]/10 to-transparent border border-[#E6A800]/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start transition-all duration-700"
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
              <span>El certificado digital marca la diferencia</span>
              <Sparkles className="w-4 h-4 text-[#E6A800]" />
            </h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Cuando un cliente no recibe el Certificado Digital de Instalación Kristall, pierde la posibilidad de verificar su garantía y el respaldo que corresponde a una instalación original. Esto protege al cliente, fortalece a cada socio y diferencia tu propuesta en el mercado.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
