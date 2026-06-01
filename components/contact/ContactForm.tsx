'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Clock, Loader2, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

const SLIDES = [
  '/cat/top-VITRAL.jpg',
  '/cat/top-PPF.jpg',
  '/cat/top-KRYPTON.jpg',
  '/cat/top-KLAR.jpg',
  '/cat/top-KERAMX.jpg',
  '/cat/top-KARBON.jpg',
]

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [slideIndex, setSlideIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % SLIDES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contacto' }),
      })
      if (!res.ok) throw new Error(t('error_server'))
      setStatus('success')
      reset()
    } catch {
      setErrorMsg(t('error'))
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-[15px] bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors'

  const infoCards = [
    { Icon: Mail, labelKey: 'info_email_label', valueKey: 'info_email_value' },
    { Icon: Clock, labelKey: 'info_time_label', valueKey: 'info_time_value' },
  ] as const

  return (
    <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {/* Columna izquierda */}
        <div className="flex flex-col">
          <div className="section-label mb-4">
            {t('label')}
          </div>
          <h1
            className="text-[#0A0A0A] mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3vw, 2.8rem)',
              fontWeight: 500,
            }}
          >
            {t('headline')}
          </h1>
          <p className="text-[15px] text-[#5C5C5C] leading-relaxed mb-8">
            {t('body')}
          </p>

          <div className="flex flex-col gap-3">
            {infoCards.map(({ Icon, labelKey, valueKey }) => (
              <div
                key={labelKey}
                className="bg-white border border-[#E4E4E2] rounded-xl p-4 flex items-start gap-3 shadow-[var(--shadow-card)]"
              >
                <Icon size={16} className="text-[#9A9A9A] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9A9A9A] mb-0.5">
                    {t(labelKey)}
                  </div>
                  <div className="text-sm font-medium text-[#0A0A0A]">{t(valueKey)}</div>                </div>
              </div>
            ))}
          </div>

          {/* Slider de imágenes */}
          <div className="mt-4 relative flex-1 min-h-[12rem] rounded-xl overflow-hidden">
            {SLIDES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt=""
                fill
                className="object-cover transition-opacity duration-700"
                style={{ opacity: i === slideIndex ? 1 : 0 }}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSlideIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slideIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="bg-white border border-[#E4E4E2] rounded-2xl p-6 shadow-[var(--shadow-card)]">
          {status === 'success' ? (
            <div className="bg-[#F0FFF4] border border-green-200 rounded-xl p-6 text-center">
              <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
              <div className="text-[15px] font-medium text-[#0A0A0A] mb-1">{t('success_title')}</div>
              <div className="text-sm text-[#5C5C5C]">{t('success_body')}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-medium text-[#0A0A0A]">{t('field_name')}</label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder={t('field_name_placeholder')}
                  className={inputClass}
                />
                {errors.name && (
                  <span className="text-sm text-red-500">{errors.name.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-medium text-[#0A0A0A]">{t('field_company')}</label>
                <input
                  {...register('company')}
                  type="text"
                  placeholder={t('field_company_placeholder')}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-medium text-[#0A0A0A]">{t('field_email')}</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder={t('field_email_placeholder')}
                  className={inputClass}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">{errors.email.message}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-medium text-[#0A0A0A]">{t('field_phone')}</label>
                <input
                  {...register('phone')}
                  type="tel"
                  placeholder={t('field_phone_placeholder')}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-6">
                <label className="text-sm font-medium text-[#0A0A0A]">{t('field_message')}</label>
                <textarea
                  {...register('message')}
                  rows={4}
                  placeholder={t('field_message_placeholder')}
                  className={inputClass}
                />
                {errors.message && (
                  <span className="text-sm text-red-500">{errors.message.message}</span>
                )}
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-xs text-red-600">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full text-white px-6 py-3 rounded-lg text-[15px] font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  t('submit')
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
