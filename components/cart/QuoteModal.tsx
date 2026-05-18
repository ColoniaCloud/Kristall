'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useCart } from '@/lib/cart'
import { useTranslations } from 'next-intl'

const schema = z.object({
  name: z.string().min(2),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface QuoteModalProps {
  open: boolean
  onClose: () => void
}

export default function QuoteModal({ open, onClose }: QuoteModalProps) {
  const { items, clearCart } = useCart()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const t = useTranslations('cart')
  const tc = useTranslations('contact')

  const formSchema = z.object({
    name: z.string().min(2, tc('error_name')),
    company: z.string().optional(),
    email: z.string().email(tc('error_email')),
    phone: z.string().optional(),
    message: z.string().optional(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(formSchema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const cartItems = items.map(i => ({ productName: i.name, quantity: i.quantity }))
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'cotizacion', cartItems }),
      })
      if (!res.ok) throw new Error(tc('error_server'))
      setStatus('success')
      reset()
      setTimeout(() => {
        clearCart()
        onClose()
        setStatus('idle')
      }, 2000)
    } catch {
      setErrorMsg(t('quote_submitting'))
      setStatus('error')
    }
  }

  const inputClass =
    'w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[480px] p-6 bg-white">
        <DialogHeader>
          <DialogTitle
            className="text-base font-medium text-[#0A0A0A]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {t('quote_title')}
          </DialogTitle>
          <DialogDescription className="text-xs text-[#5C5C5C] leading-relaxed">
            {t('quote_subtitle')}
          </DialogDescription>
        </DialogHeader>

        {/* Lista productos */}
        <div className="bg-[#F2F2F0] rounded-xl p-3 mb-4">
          {items.map(i => (
            <div key={i.sku} className="flex justify-between text-xs py-1">
              <span className="text-[#0A0A0A]">{i.name}</span>
              <span className="text-[#9A9A9A]">×{i.quantity}</span>
            </div>
          ))}
        </div>

        {status === 'success' ? (
          <div className="bg-[#F0FFF4] border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-[#0A0A0A] mb-1">{t('quote_title')} ✓</div>
            <div className="text-xs text-[#5C5C5C]">{t('quote_success')}</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#0A0A0A]">{tc('field_name')}</label>
              <input {...register('name')} type="text" placeholder={tc('field_name_placeholder')} className={inputClass} />
              {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#0A0A0A]">{tc('field_company')}</label>
              <input {...register('company')} type="text" placeholder={tc('field_company_placeholder')} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#0A0A0A]">{tc('field_email')}</label>
              <input {...register('email')} type="email" placeholder={tc('field_email_placeholder')} className={inputClass} />
              {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#0A0A0A]">{tc('field_phone')}</label>
              <input {...register('phone')} type="tel" placeholder={tc('field_phone_placeholder')} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-[#0A0A0A]">{tc('field_message')}</label>
              <textarea {...register('message')} rows={3} placeholder={tc('field_message_placeholder')} className={inputClass} />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  {t('quote_submitting')}
                </>
              ) : (
                t('quote_submit')
              )}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
