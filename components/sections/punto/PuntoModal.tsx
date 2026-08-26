'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { trackLead } from '@/lib/analytics'

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
  const t = useTranslations('punto_modal')
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
      if (res.ok) trackLead('punto-kristall')
    } catch {
      setStatus('error')
    }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-lg border border-[#E4E4E2] bg-white text-sm text-[#0A0A0A] placeholder:text-[#9A9A9A] focus:outline-none focus:border-[#0A0A0A] transition-colors duration-200"
  const labelCls = "block text-xs font-medium text-[#5C5C5C] mb-1.5"

  return (
    <div
      ref={overlayRef}
      className="fixed inset-x-0 bottom-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:pt-20"
      style={{ top: '56px' }}
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[calc(100dvh-72px)] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#E4E4E2]">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-[#E6A800]">{t('eyebrow')}</p>
            <h3 className="text-lg font-semibold text-[#0A0A0A] mt-0.5" style={{ fontFamily: 'var(--font-display)' }}>
              {t('title')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#9A9A9A] hover:text-[#0A0A0A] hover:bg-[#F2F2F0] transition-colors"
            aria-label={t('close_aria')}
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
            <h4 className="text-base font-semibold text-[#0A0A0A] mb-2">{t('success_title')}</h4>
            <p className="text-sm text-[#5C5C5C]">{t('success_body')}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#0A0A0A] text-white rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
            >
              {t('close_button')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
            {/* Row: Nombre */}
            <div>
              <label htmlFor="punto-nombre" className={labelCls}>{t('label_name')}</label>
              <input id="punto-nombre" required type="text" placeholder={t('placeholder_name')} value={form.nombre} onChange={set('nombre')} className={inputCls} />
            </div>

            {/* Row: Teléfono + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="punto-telefono" className={labelCls}>{t('label_phone')}</label>
                <input id="punto-telefono" required type="tel" placeholder={t('placeholder_phone')} value={form.telefono} onChange={set('telefono')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="punto-email" className={labelCls}>{t('label_email')}</label>
                <input id="punto-email" required type="email" placeholder={t('placeholder_email')} value={form.email} onChange={set('email')} className={inputCls} />
              </div>
            </div>

            {/* Row: Provincia + Ciudad */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="punto-provincia" className={labelCls}>{t('label_provincia')}</label>
                <input id="punto-provincia" required type="text" placeholder={t('placeholder_provincia')} value={form.provincia} onChange={set('provincia')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="punto-ciudad" className={labelCls}>{t('label_ciudad')}</label>
                <input id="punto-ciudad" required type="text" placeholder={t('placeholder_ciudad')} value={form.ciudad} onChange={set('ciudad')} className={inputCls} />
              </div>
            </div>

            {/* Nombre del taller */}
            <div>
              <label htmlFor="punto-taller" className={labelCls}>{t('label_taller')}</label>
              <input id="punto-taller" required type="text" placeholder={t('placeholder_taller')} value={form.taller} onChange={set('taller')} className={inputCls} />
            </div>

            {/* Flujo */}
            <div>
              <label htmlFor="punto-flujo" className={labelCls}>{t('label_flujo')}</label>
              <input id="punto-flujo" required type="text" placeholder={t('placeholder_flujo')} value={form.flujo} onChange={set('flujo')} className={inputCls} />
            </div>

            {/* Separador opcionales */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-px bg-[#E4E4E2]" />
              <span className="text-[12px] uppercase tracking-widest text-[#9A9A9A]">{t('optional_divider')}</span>
              <div className="flex-1 h-px bg-[#E4E4E2]" />
            </div>

            {/* Opcionales */}
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label htmlFor="punto-instagram" className={labelCls}>{t('label_instagram')}</label>
                <input id="punto-instagram" type="text" placeholder={t('placeholder_instagram')} value={form.instagram} onChange={set('instagram')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="punto-facebook" className={labelCls}>{t('label_facebook')}</label>
                <input id="punto-facebook" type="text" placeholder={t('placeholder_facebook')} value={form.facebook} onChange={set('facebook')} className={inputCls} />
              </div>
              <div>
                <label htmlFor="punto-sitio" className={labelCls}>{t('label_sitio')}</label>
                <input id="punto-sitio" type="url" placeholder={t('placeholder_sitio')} value={form.sitio} onChange={set('sitio')} className={inputCls} />
              </div>
            </div>

            {status === 'error' && (
              <p className="text-sm text-[#CC0000]">{t('error')}</p>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full bg-[#0A0A0A] text-white py-3 rounded-lg text-sm font-medium hover:opacity-85 transition-opacity disabled:opacity-50 mt-1"
            >
              {status === 'sending' ? t('submitting') : t('submit')}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
