'use client'

import { useEffect, useRef, useState } from 'react'
import { TrendingUp } from 'lucide-react'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

const steps = [
  {
    num: '01',
    title: 'Lo ofrecés en la entrega',
    body: 'Sumás el polarizado Kristall a la venta del 0km, con muestrario y demo en el escritorio.',
  },
  {
    num: '02',
    title: 'El cliente lo siente y elige',
    body: 'Con el medidor de calor comprueba la diferencia al instante y compra.',
  },
  {
    num: '03',
    title: 'Tu instalador coloca',
    body: 'Tu instalador habitual instala Kristall. Vos activás la garantía digital en el sistema con los datos del vehículo y de tu cliente, y capturás el margen adicional premium en cada entrega.',
  },
]

function HeaderBlock() {
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref}>
      <span
        className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#E6A800] mb-3 block transition-all duration-1000"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '0ms' }}
      >
        01 · EL NEGOCIO
      </span>
      <h2
        className="text-3xl font-medium text-white mb-3 transition-all duration-1000"
        style={{ fontFamily: 'var(--font-display)', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '80ms' }}
      >
        Más margen, sin cambiar tu operación
      </h2>
      <p
        className="text-[17px] text-white leading-relaxed mb-12 max-w-[600px] transition-all duration-1000"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '160ms' }}
      >
        Tu instalador habitual sigue colocando como hasta hoy. La diferencia es que ahora
        trabaja con lámina Kristall: el cliente pide la marca y su garantía digital, y vos
        capturás un upsell premium en cada entrega.
      </p>
    </div>
  )
}

function StepCard({ num, title, body, delay }: { num: string; title: string; body: string; delay: number }) {
  const { ref, inView } = useInView(0.1)
  return (
    <AnimatedBorderCard borderRadius={16} color="white">
      <div
        ref={ref}
        className="relative rounded-2xl p-6 flex flex-col h-full backdrop-blur-md bg-white/[0.07] border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transitionDelay: `${delay}ms` }}
      >
        <span
          className="text-3xl font-medium text-[#E6A800] block mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {num}
        </span>
        <p className="text-[17px] font-semibold text-white mb-2">{title}</p>
        <p className="text-[17px] text-white leading-relaxed">{body}</p>
      </div>
    </AnimatedBorderCard>
  )
}

function CalloutBlock() {
  const { ref, inView } = useInView(0.1)
  return (
    <AnimatedBorderCard borderRadius={16} color="white">
      <div
        ref={ref}
        className="relative rounded-2xl p-6 flex items-start gap-5 backdrop-blur-md bg-white/[0.06] border border-white/10 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '200ms' }}
      >
        <div className="w-12 h-12 rounded-xl bg-[#E6A800] flex items-center justify-center flex-shrink-0">
          <TrendingUp size={22} className="text-[#0A0A0A]" />
        </div>
        <div>
          <p
            className="text-xl font-medium text-white mb-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Más margen{' '}
            <span className="text-[#E6A800]">en cada auto.</span>
          </p>
          <p className="text-[17px] text-white leading-relaxed">
            El posicionamiento premium alemán y las herramientas de demostración justifican un
            mejor precio de venta. Eso es más margen para tu concesionaria en cada 0km que
            sale del salón.
          </p>
        </div>
      </div>
    </AnimatedBorderCard>
  )
}

export default function ConcesionariasNegocio() {
  return (
    <section className="relative overflow-hidden py-16 px-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-KERAMX.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/85" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <HeaderBlock />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {steps.map(({ num, title, body }, i) => (
            <StepCard key={num} num={num} title={title} body={body} delay={i * 100} />
          ))}
        </div>
        <CalloutBlock />
      </div>
    </section>
  )
}
