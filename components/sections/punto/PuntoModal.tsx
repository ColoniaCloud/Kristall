'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'

type FormData = {
  nombre: string
  telefono: string
  email: string
  provincia: string
  ciudad: string
  taller: string
  flujo: string
  instagram: string
  facebook: string
  sitio: string
}

const EMPTY: FormData = {
  nombre: '', telefono: '', email: '', provincia: '',
  ciudad: '', taller: '', flujo: '',
  instagram: '', facebook: '', sitio: '',
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function PuntoModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormData>(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.nombre,
          email: form.email,
          phone: form.telefono,
          message: [
            `Provincia: ${form.provincia}`,
            `Ciudad: ${form.ciudad}`,
            `Taller: ${form.taller}`,
            `Autos por mes: ${form.flujo}`,
            form.instagram ? `Instagram: ${form.instagram}` : '',
            form.facebook  ? `Facebook: ${form.facebook}`   : '',
            form.sitio     ? `Sitio web: ${form.sitio}`     : '',
          ].filter(Boolean).join('\n'),
          source: 'punto-kristall',
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-[#E4E4E2] bg-white text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#0A0A0A] transition-colors duration-200"
  const labelCls = "block text-xs font-medium text-[#5C5C5C] mb-1.5"

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90dvh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E4E4E2]">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800]">Programa Punto Kristall</p>
            <h3 className="text-lg font-semibold text-[#0A0A0A] mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              Registrá tu taller
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#0A0A0A] hover:bg-[#F2F2F0] transition-colors"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        {status === 'success' ? (
          <div className="px-6 py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 10l5 5 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-[#0A0A0A] mb-2">¡Solicitud enviada!</h4>
            <p className="text-sm text-[#5C5C5C]">Un asesor de Kristall te contactará a la brevedad.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#0A0A0A] text-white rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            {/* Row: Nombre */}
            <div>
              <label className={labelCls}>Nombre completo *</label>
              <input required type="text" placeholder="Tu nombre completo" value={form.nombre} onChange={set('nombre')} className={inputCls} />
            </div>

            {/* Row: Teléfono + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Teléfono *</label>
                <input required type="tel" placeholder="+54 11 0000-0000" value={form.telefono} onChange={set('telefono')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email *</label>
                <input required type="email" placeholder="tu@email.com" value={form.email} onChange={set('email')} className={inputCls} />
              </div>
            </div>

            {/* Row: Provincia + Ciudad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Provincia *</label>
                <input required type="text" placeholder="Buenos Aires" value={form.provincia} onChange={set('provincia')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Ciudad *</label>
                <input required type="text" placeholder="CABA" value={form.ciudad} onChange={set('ciudad')} className={inputCls} />
              </div>
            </div>

            {/* Nombre del taller */}
            <div>
              <label className={labelCls}>Nombre del taller *</label>
              <input required type="text" placeholder="Polarizados Ejemplo" value={form.taller} onChange={set('taller')} className={inputCls} />
            </div>

            {/* Flujo */}
            <div>
              <label className={labelCls}>Flujo aproximado de autos por mes *</label>
              <input required type="text" placeholder="Ej: 20-30 autos" value={form.flujo} onChange={set('flujo')} className={inputCls} />
            </div>

            {/* Separador opcionales */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-[#E4E4E2]" />
              <span className="text-[11px] uppercase tracking-widest text-[#9A9A9A]">Opcional</span>
              <div className="flex-1 h-px bg-[#E4E4E2]" />
            </div>

            {/* Opcionales */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className={labelCls}>Instagram</label>
                <input type="text" placeholder="@tutaller" value={form.instagram} onChange={set('instagram')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                <input type="text" placeholder="facebook.com/tutaller" value={form.facebook} onChange={set('facebook')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Sitio web</label>
                <input type="url" placeholder="https://tutaller.com" value={form.sitio} onChange={set('sitio')} className={inputCls} />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-sm text-[#CC0000]">Hubo un error al enviar. Intentá de nuevo.</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#0A0A0A] text-white py-3 rounded-lg text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-50 mt-1"
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar solicitud'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
