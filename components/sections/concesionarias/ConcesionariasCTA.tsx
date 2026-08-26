'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { GridVignetteBackground } from '@/components/ui/vignette-grid-background'
import { trackLead } from '@/lib/analytics'

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

const recap = [
  'Sin exclusividad: sumás margen sin cambiar tu operación.',
  'Te equipamos el salón con muestrario, tótem y capacitación.',
  'Garantía digital en cada 0km entregado.',
]

type FormState = { nombre: string; email: string; telefono: string }

function ContactForm() {
  const [form, setForm] = useState<FormState>({ nombre: '', email: '', telefono: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.email.trim()) {
      setError('Nombre y email son requeridos.')
      return
    }
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nombre,
          email: form.email,
          phone: form.telefono,
          source: 'concesionarias',
          message: 'Solicitud de reunión desde el programa de concesionarias.',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      trackLead('concesionarias-reunion')
    } catch {
      setError('Hubo un error. Intentá de nuevo.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-md">
      {sent ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 rounded-full bg-[#E6A800]/15 flex items-center justify-center mx-auto mb-4">
            <span className="text-[#E6A800] text-xl">✓</span>
          </div>
          <p className="text-white font-medium mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            ¡Solicitud enviada!
          </p>
          <p className="text-[16px] text-white/50">Te contactamos a la brevedad para coordinar la reunión.</p>
        </div>
      ) : (
        <>
          <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-white/30 mb-2">
            PROGRAMA CONCESIONARIAS
          </p>
          <h3
            className="text-xl font-medium text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Coordinemos una reunión
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm(f => ({ ...f, nombre: e.target.value }))}
                placeholder="Tu nombre"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="tu@concesionaria.com"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-white/50 mb-1.5 uppercase tracking-wide">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm(f => ({ ...f, telefono: e.target.value }))}
                placeholder="+54 11 0000-0000"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {error && <p className="text-[13px] text-[#CC0000]">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="btn-primary text-white px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 mt-2"
            >
              {sending ? 'Enviando...' : 'Confirmar reunión'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function ConcesionariasCTA() {
  const { ref, inView } = useInView(0.15)

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-[88px] px-10">
      <GridVignetteBackground
        x={50}
        y={50}
        intensity={60}
        horizontalVignetteSize={80}
        verticalVignetteSize={60}
      />

      <div
        ref={ref}
        className="relative z-10 max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start"
      >
        {/* LEFT COLUMN: content */}
        <div className="text-left">
          <span
            className="text-[12px] font-medium uppercase tracking-[0.1em] text-white/30 mb-4 block transition-all duration-1000"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)' }}
          >
            EL PRÓXIMO PASO
          </span>
          <h2
            className="font-medium text-white mb-4 leading-tight transition-all duration-1000"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.925rem, 3vw, 2.8rem)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '80ms',
            }}
          >
            Sumá Kristall a tu salón y empezá a capturar ese margen.
          </h2>
          <p
            className="text-[16px] text-white/50 leading-relaxed mb-10 max-w-[480px] transition-all duration-1000"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(12px)', transitionDelay: '160ms' }}
          >
            Te equipamos el salón, capacitamos a tu equipo y coordinamos con tu instalador.
            Vos solo lo ofrecés en cada entrega.
          </p>

          <div
            className="flex flex-col gap-3 max-w-[480px] transition-all duration-1000"
            style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '240ms' }}
          >
            {recap.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[#E6A800] mt-0.5 flex-shrink-0" />
                <p className="text-[15px] text-white/70 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: form */}
        <div
          className="transition-all duration-1000"
          style={{ opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(20px)', transitionDelay: '300ms' }}
        >
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
