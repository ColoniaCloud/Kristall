'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, BadgeCheck, Handshake, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/routing'

export default function PropuestaVidrieriasHero() {
  const [mounted, setMounted] = useState(false)
  const [visibleWords, setVisibleWords] = useState(0)

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return

    const words = 'Programa de socios Kristall'.split(' ')

    const interval = window.setInterval(() => {
      setVisibleWords((prev) => {
        const next = prev + 1
        if (next >= words.length) window.clearInterval(interval)
        return next
      })
    }, 150)

    return () => window.clearInterval(interval)
  }, [mounted])

  const item = (delay: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(20px)',
    transition: `opacity 1000ms ease ${delay}ms, transform 1000ms ease ${delay}ms`,
  })

  const introPoints = [
    'Generá una nueva fuente de ingresos para tu empresa ofreciendo soluciones premium de control solar y seguridad para vidrios, con el respaldo de Kristall.',
    'Convertite en un Socio Autorizado Kristall y sumá una unidad de negocio de alto valor sin importar si ya trabajás con láminas o si querés comenzar desde cero.',
    'Diseñamos un programa pensado para acompañarte desde el primer día, con soporte técnico, comercial y una marca que respalda cada instalación.',
    'La incorporación al programa es simple y rápida. Te acompañamos paso a paso para que puedas empezar a vender sin complicaciones.',
  ]

  const titleWords = 'Programa de socios Kristall'.split(' ')

  return (
    <>
      <section className="relative overflow-hidden bg-[#0A0A0A]">
        <div className="absolute inset-0">
          <Image
            src="/builds.jpg"
            alt="Propuesta Aberturas"
            fill
            className="absolute inset-0 object-cover object-center opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/30" />
        </div>

        <div className="relative z-10 max-w-[1400px] w-full mx-auto px-6 md:px-10 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] gap-10 lg:gap-14 items-center">
            <div className="max-w-[760px]">
              <div className="flex items-center gap-3 mb-6" style={item(0)}>
                <div className="flex h-[14px] w-6 overflow-hidden rounded-[2px] flex-shrink-0">
                  <div className="flex-1 bg-[#1A1A1A]" />
                  <div className="flex-1 bg-[#CC0000]" />
                  <div className="flex-1 bg-[#E6A800]" />
                </div>
                <span className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#E6A800]">
                  Para empresas de aberturas
                </span>
              </div>

              <h1
                className="font-semibold leading-tight text-white mb-6 max-w-[820px]"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.425rem, 4.5vw, 4rem)',
                  ...item(100),
                }}
              >
                {titleWords.map((word, index) => (
                  <span
                    key={`${word}-${index}`}
                    className={`mr-2 inline-block transition-all duration-1000 ${index < visibleWords ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
                  >
                    {word}
                  </span>
                ))}
              </h1>

              <ul className="space-y-4 mb-10" style={item(200)}>
                {introPoints.map((point, index) => {
                  const iconMap = [
                    <Sparkles key="sparkles" className="w-5 h-5 text-[#E6A800]" />,
                    <Handshake key="handshake" className="w-5 h-5 text-[#CC0000]" />,
                    <BadgeCheck key="badge" className="w-5 h-5 text-[#E6A800]" />,
                    <ArrowRight key="arrow" className="w-5 h-5 text-[#CC0000]" />,
                  ]

                  return (
                    <li key={point} className="flex items-start gap-3 text-white/80 text-[16px] md:text-[17px] leading-relaxed">
                      <span className="mt-1 flex-shrink-0">{iconMap[index]}</span>
                      <p>{point}</p>
                    </li>
                  )
                })}
              </ul>

              <div className="flex flex-col items-center gap-4 flex-wrap sm:flex-row sm:justify-start" style={item(300)}>
                <a
                  href="#contacto"
                  className="btn-primary text-white px-7 py-3 rounded-lg text-sm font-medium transition-all inline-block bg-white text-black hover:opacity-90 w-full text-center sm:w-auto"
                >
                  Quiero sumar mi empresa
                </a>
                <Link
                  href="/productos"
                  className="border border-white/20 text-white/60 px-7 py-3 rounded-lg text-sm hover:text-white hover:border-white/40 transition-all w-full text-center sm:w-auto"
                >
                  Ver gama de productos
                </Link>
              </div>
            </div>

            <div className="relative min-h-[320px] lg:min-h-[560px] rounded-[28px] overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.35)]" style={item(250)}>
              <Image
                src="/builds.jpg"
                alt="Soluciones Kristall para aberturas"
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#E6A800] mb-2">
                  Programa de socios
                </p>
                <p className="text-white text-lg font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                  Una unidad de negocio premium con respaldo técnico, comercial y digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
