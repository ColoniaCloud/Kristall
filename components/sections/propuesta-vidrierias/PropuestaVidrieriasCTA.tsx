'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageSquare, User, ShieldCheck } from 'lucide-react'
import { GridVignetteBackground } from '@/components/ui/vignette-grid-background'
import { trackLead } from '@/lib/analytics'

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
          source: 'propuesta-vidrierias',
          message: 'Solicitud de reunión comercial desde página de propuesta de aberturas.',
        }),
      })
      if (!res.ok) throw new Error()
      setSent(true)
      trackLead('propuesta-vidrierias')
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
          <p className="text-[14px] text-white/50">Te contactaremos a la brevedad para coordinar la reunión.</p>
        </div>
      ) : (
        <>
          <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-white/30 mb-2">
            PROPUESTA ABERTURAS
          </p>
          <h3
            className="text-xl font-medium text-white mb-6"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Coordinemos una reunión
          </h3>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Nombre *
              </label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                placeholder="Tu nombre o empresa"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Email *
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="tu@empresa.com"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">
                Teléfono
              </label>
              <input
                type="tel"
                value={form.telefono}
                onChange={(e) => setForm((f) => ({ ...f, telefono: e.target.value }))}
                placeholder="+54 11 0000-0000"
                className="w-full px-3.5 py-2.5 bg-white/[0.06] border border-white/10 rounded-lg text-[16px] text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {error && <p className="text-[13px] text-[#CC0000]">{error}</p>}

            <button
              type="submit"
              disabled={sending}
              className="btn-primary text-white px-6 py-3 rounded-lg text-sm font-medium transition-all disabled:opacity-50 mt-2 bg-white text-black hover:opacity-90 cursor-pointer"
            >
              {sending ? 'Enviando...' : 'Confirmar reunión'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default function PropuestaVidrieriasCTA() {
  const { ref, inView } = useInView(0.15)

  return (
    <section id="contacto" className="relative overflow-hidden bg-[#0A0A0A] py-[88px] px-6 md:px-10 border-t border-white/10">
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
            className="text-[12px] font-semibold uppercase tracking-[0.15em] text-white/30 mb-4 block transition-all duration-1000"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
            }}
          >
            EL PRÓXIMO PASO
          </span>

          <h2
            className="font-medium text-white mb-4 leading-tight transition-all duration-1000"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.125rem, 3.5vw, 3rem)',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '120ms',
            }}
          >
            ¿Querés sumar Kristall a tu negocio?
          </h2>

          <p
            className="text-[16px] text-white/50 leading-relaxed mb-10 max-w-[520px] transition-all duration-1000"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: '180ms',
            }}
          >
            En una reunión breve analizamos tu empresa, definimos el modelo que mejor encaja y te mostramos cómo incorporar Kristall como una nueva unidad de negocio rentable y diferenciadora.
          </p>

          {/* Contact details */}
          <div
            className="flex flex-col gap-4 max-w-[420px] transition-all duration-1000"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '240ms',
            }}
          >
            {/* WHATSAPP */}
            <a
              href="https://wa.me/5491160484312"
              target="_blank"
              rel="noopener noreferrer"
              className="backdrop-blur-md bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:bg-white/[0.06] hover:border-white/10 transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-2 text-white/40">
                <MessageSquare className="w-4 h-4 text-[#E6A800]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">WHATSAPP</span>
              </div>
              <p className="text-white text-[16px] font-semibold group-hover:text-[#E6A800] transition-colors">
                +54 9 11 6048-4312
              </p>
            </a>

            {/* REPRESENTANTE */}
            <div className="backdrop-blur-md bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-white/40">
                <User className="w-4 h-4 text-[#CC0000]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">REPRESENTANTE</span>
              </div>
              <p className="text-white text-[16px] font-semibold">
                Carlos Arrúa
              </p>
              <p className="text-[12px] text-white/40">Representante Kristall</p>
            </div>

            {/* MARCA */}
            <div className="backdrop-blur-md bg-white/[0.03] border border-white/5 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-white/40">
                <ShieldCheck className="w-4 h-4 text-white/60" />
                <span className="text-[10px] font-bold uppercase tracking-wider">MARCA</span>
              </div>
              <p className="text-white text-[16px] font-semibold">
                Kristall Window Films
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: form */}
        <div
          className="transition-all duration-1000"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '300ms',
          }}
        >
          <ContactForm />
        </div>
      </div>
    </section>
  )
}
