'use client'

import Image from 'next/image'
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

function useParallax(range = 20) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight || 1
      const progress = (rect.top + rect.height / 2 - viewportH / 2) / viewportH
      setOffset(Math.max(-1, Math.min(1, progress)) * range)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [range])
  return { ref, offset }
}

type Model = {
  letter: string
  title: string
  image: string
  intro: string
  leadIn: string
  bullets: string[]
  closing: string
}

const models: Model[] = [
  {
    letter: 'A',
    title: 'Ya ofrecés polarizado',
    image: '/cat/top-VITRAL.jpg',
    intro: 'Si actualmente trabajás con láminas y contás con un instalador propio o tercerizado, certificamos a tu equipo bajo el estándar Kristall.',
    leadIn: 'Vos seguís realizando las instalaciones y nosotros aportamos:',
    bullets: [
      'Film Kristall.',
      'Capacitación y certificación.',
      'Garantía Digital Kristall.',
      'Soporte técnico permanente.',
      'Material comercial personalizado.',
    ],
    closing: 'Cada instalación queda respaldada oficialmente por Kristall.',
  },
  {
    letter: 'B',
    title: 'Querés incorporar este servicio',
    image: '/builds.jpg',
    intro: 'Si todavía no ofrecés polarizados, nosotros hacemos que puedas empezar de inmediato.\nVos mantenés la relación comercial con tu cliente y definís el precio final.',
    leadIn: 'Nosotros nos ocupamos de:',
    bullets: [
      'Instalación mediante nuestra red certificada.',
      'Provisión del film.',
      'Garantía Digital Kristall.',
      'Soporte técnico permanente.',
    ],
    closing: 'Así podés incorporar un nuevo servicio sin necesidad de contratar instaladores propios.',
  },
]

function ModelCard({ model, index, cardsInView }: { model: Model; index: number; cardsInView: boolean }) {
  const { ref: parallaxRef, offset } = useParallax(20)

  return (
    <div
      className="grid gap-6 rounded-xl border border-[--border] bg-white p-6 shadow-[var(--shadow-card)] transition-all duration-500 md:grid-cols-[280px_1fr] md:p-8"
      style={{
        opacity: cardsInView ? 1 : 0,
        transform: cardsInView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div
        ref={parallaxRef}
        className="relative h-[200px] w-full overflow-hidden rounded-lg md:h-full"
        style={{
          opacity: cardsInView ? 1 : 0,
          transform: cardsInView ? 'scale(1)' : 'scale(0.95)',
          transition: `opacity 700ms ease ${index * 120 + 120}ms, transform 700ms ease ${index * 120 + 120}ms`,
        }}
      >
        <Image
          src={model.image}
          alt={model.title}
          fill
          className="object-cover"
          style={{ transform: `translateY(${offset}px) scale(1.15)` }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span
          className="pointer-events-none absolute bottom-1 left-3 text-[64px] font-bold leading-none text-white/90 drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)] md:bottom-2 md:left-4 md:text-[100px]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {model.letter}
        </span>
      </div>

      <div>
        <h3
          className="mb-3 text-2xl font-semibold text-[#0A0A0A] md:text-[28px]"
          style={{
            fontFamily: 'var(--font-display)',
            opacity: cardsInView ? 1 : 0,
            transform: cardsInView ? 'translateX(0)' : 'translateX(-18px)',
            transition: `opacity 600ms ease ${index * 120 + 150}ms, transform 600ms ease ${index * 120 + 150}ms`,
          }}
        >
          {model.title}
        </h3>

        <div
          style={{
            opacity: cardsInView ? 1 : 0,
            transform: cardsInView ? 'translateY(0)' : 'translateY(16px)',
            transition: `opacity 650ms ease ${index * 120 + 380}ms, transform 650ms ease ${index * 120 + 380}ms`,
          }}
        >
          {model.intro.split('\n').map((paragraph) => (
            <p key={paragraph} className="mb-3 text-[16px] leading-relaxed text-[#5C5C5C]">
              {paragraph}
            </p>
          ))}
        </div>

        <p className="mb-3 text-[16px] leading-relaxed text-[#5C5C5C]">{model.leadIn}</p>

        <ul className="mb-4 list-disc space-y-1.5 pl-5">
          {model.bullets.map((bullet) => (
            <li key={bullet} className="text-[16px] leading-relaxed text-[#0A0A0A]">
              {bullet}
            </li>
          ))}
        </ul>

        <p className="text-[16px] leading-relaxed text-[#5C5C5C]">{model.closing}</p>
      </div>
    </div>
  )
}

export default function PropuestaVidrieriasModelos() {
  const { ref: headerRef, inView: headerInView } = useInView(0.2)
  const { ref: cardsRef, inView: cardsInView } = useInView(0.05)

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
          <h2
            className="text-3xl md:text-4xl font-medium text-[#0A0A0A]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            DOS FORMAS DE TRABAJAR JUNTOS
          </h2>
        </div>

        {/* Models */}
        <div ref={cardsRef} className="flex flex-col gap-6">
          {models.map((model, i) => (
            <ModelCard key={model.letter} model={model} index={i} cardsInView={cardsInView} />
          ))}
        </div>

      </div>
    </section>
  )
}
