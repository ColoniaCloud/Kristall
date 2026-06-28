'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'

export default function PropuestaVidrieriasHero() {
  const [mounted, setMounted] = useState(false)
  
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  const item = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
  })

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] min-h-[90vh] flex flex-col justify-center">
      {/* Background Image */}
      <Image
        src="/builds.jpg"
        alt="Vidrierías y Aberturas"
        fill
        className="absolute inset-0 object-cover object-center opacity-25"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/35" />

      <div className="relative z-10 max-w-[1160px] w-full mx-auto px-6 md:px-10 pt-24 pb-16">
        
        {/* Flag Ribbons and Confidential Eyebrow */}
        <div className="flex items-center gap-3 mb-6" style={item(0)}>
          <div className="flex h-[14px] w-6 overflow-hidden rounded-[2px] flex-shrink-0">
            <div className="flex-1 bg-[#1A1A1A]" />
            <div className="flex-1 bg-[#CC0000]" />
            <div className="flex-1 bg-[#E6A800]" />
          </div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#E6A800]">
            Propuesta Comercial Confidencial
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-semibold leading-tight text-white mb-6 max-w-[850px]"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            ...item(100),
          }}
        >
          Sumá Kristall a tu{' '}
          <span className="text-[#CC0000] inline-block relative">
            negocio
          </span>{' '}
          de aberturas.
        </h1>

        {/* Subtitle */}
        <p
          className="text-base md:text-lg text-white/70 leading-relaxed mb-10 max-w-[680px]"
          style={item(200)}
        >
          Tres formas de trabajar juntos. Vos elegís cómo involucrarte — nosotros ponemos el producto, la red de instalación y el respaldo de marca.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 flex-wrap mb-16" style={item(300)}>
          <a
            href="#contacto"
            className="btn-primary text-white px-7 py-3 rounded-lg text-sm font-medium transition-all inline-block bg-white text-black hover:opacity-90"
          >
            Quiero sumar Kristall
          </a>
          <Link
            href="/productos"
            className="border border-white/20 text-white/60 px-7 py-3 rounded-lg text-sm hover:text-white hover:border-white/40 transition-all"
          >
            Ver gama de productos
          </Link>
        </div>

        {/* Bento/Grid Cards from PDF Page 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" style={item(400)}>
          
          {/* Card 1: Revendedor */}
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20">
            <span className="text-xs font-semibold text-[#CC0000] uppercase tracking-wider block mb-2">
              Revendedor
            </span>
            <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Esquema Mayorista
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Comprás el film y ofrecés instalación con nuestra red o tu propio equipo.
            </p>
          </div>

          {/* Card 2: Servicio */}
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20">
            <span className="text-xs font-semibold text-[#E6A800] uppercase tracking-wider block mb-2">
              Servicio
            </span>
            <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Llave en Mano
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Nosotros ejecutamos todo, vos marcás tu margen de ganancia arriba del costo.
            </p>
          </div>

          {/* Card 3: Arquitectura */}
          <div className="backdrop-blur-md bg-white/[0.05] border border-white/10 rounded-xl p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-white/20">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-2">
              Arquitectura
            </span>
            <h3 className="text-white text-lg font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              Canal de Especificación
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Acceso a estudios de arquitectura como canal de especificación en proyectos.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
