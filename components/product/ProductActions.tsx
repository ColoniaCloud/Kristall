'use client'

import { useState } from 'react'
import { useCart } from '@/lib/cart'
import { ShoppingCart, MessageSquare, Check, ArrowRight } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface ProductActionsProps {
  sku: string
  name: string
  category: string
  inStock: boolean
}

type ModalStep = 'confirm' | 'form' | 'loading' | 'success'

export default function ProductActions({ sku, name, category, inStock }: ProductActionsProps) {
  const t = useTranslations('product_actions')

  const quoteSchema = z.object({
    name: z.string().min(2, t('error_name')),
    company: z.string().optional(),
    email: z.string().email(t('error_email')),
    phone: z.string().optional(),
    message: z.string().optional(),
  })
  type QuoteForm = z.infer<typeof quoteSchema>
  const { addItem, openCart, items } = useCart()
  const [modalOpen, setModalOpen] = useState(false)
  const [step, setStep] = useState<ModalStep>('confirm')
  const [addedToCart, setAddedToCart] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuoteForm>({
    resolver: zodResolver(quoteSchema),
  })

  const handleAddToCart = () => {
    addItem({ sku, name, category })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleOpenModal = () => {
    setStep('confirm')
    setModalOpen(true)
  }

  const handleConfirmAddMore = () => {
    setModalOpen(false)
    addItem({ sku, name, category })
    openCart()
  }

  const handleContinueToForm = () => {
    setStep('form')
  }

  const onSubmit = async (data: QuoteForm) => {
    setStep('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'cotizacion',
          message: data.message || `Consulta de cotización para producto: ${name} (${sku})`,
          cartItems: [{ productName: name, quantity: 1 }],
        }),
      })
      if (!res.ok) throw new Error()
      setStep('success')
      reset()
    } catch {
      setStep('form')
    }
  }

  const handleClose = () => {
    setModalOpen(false)
    setTimeout(() => setStep('confirm'), 300)
  }

  if (!inStock) {
    return (
      <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)] sticky top-24">
        <div className="text-center py-4">
          <span className="text-xs bg-amber-50 border border-amber-200 text-amber-600 rounded-full px-3 py-1">
            {t('coming_soon_badge')}
          </span>
          <p className="text-xs text-[#9A9A9A] mt-4 leading-relaxed">
            {t('coming_soon_body')}
          </p>
          <button
            onClick={handleOpenModal}
            className="w-full mt-4 border border-[#E4E4E2] text-[#5C5C5C] px-4 py-3 rounded-lg text-sm hover:border-[#0A0A0A] hover:text-[#0A0A0A] transition-all"
          >
            {t('consult_availability')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white border border-[#E4E4E2] rounded-xl p-6 shadow-[var(--shadow-card)] sticky top-24 flex flex-col gap-3">

        <div className="pb-4 border-b border-[#F2F2F0] mb-2">
          <p className="text-[11px] uppercase tracking-widest text-[#9A9A9A] mb-1">{category.toUpperCase()}</p>
          <p className="text-sm font-medium text-[#0A0A0A]">{name}</p>
          <p className="text-sm text-[#9A9A9A] mt-0.5">{t('ref_label')} {sku}</p>
        </div>

        <button
          onClick={handleOpenModal}
          className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:opacity-85 transition-opacity"
        >
          <MessageSquare size={15} />
          {t('request_quote')}
        </button>

        <button
          onClick={handleAddToCart}
          className={`w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all border ${
            addedToCart
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'border-[#C8C8C4] text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white hover:border-[#0A0A0A]'
          }`}
        >
          {addedToCart ? (
            <><Check size={15} /> {t('added_to_list')}</>
          ) : (
            <><ShoppingCart size={15} /> {t('add_to_list')}</>
          )}
        </button>

        {items.length > 0 && (
          <p className="text-[11px] text-[#9A9A9A] text-center">
            {items.length === 1 ? t('items_in_list_one') : t('items_in_list_other', { count: items.length })}
          </p>
        )}

        <p className="text-[11px] text-[#9A9A9A] text-center leading-relaxed mt-1">
          {t('no_charge')}
        </p>
      </div>

      <Dialog open={modalOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md bg-white rounded-2xl p-0 overflow-hidden">

          {step === 'confirm' && (
            <div className="p-6">
              <DialogHeader className="mb-5">
                <DialogTitle className="font-display text-lg font-medium">
                  {t('modal_title')}
                </DialogTitle>
                <p className="text-xs text-[#5C5C5C] mt-1 leading-relaxed">
                  {t('modal_quote_for', { name, sku })}
                </p>
              </DialogHeader>

              <div className="bg-[#F2F2F0] rounded-xl p-4 mb-5">
                <p className="text-sm font-medium text-[#0A0A0A] mb-1">
                  {t('modal_confirm_question')}
                </p>
                <p className="text-xs text-[#5C5C5C] leading-relaxed">
                  {t('modal_confirm_body')}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmAddMore}
                  className="w-full flex items-center justify-between border border-[#E4E4E2] rounded-xl px-4 py-3.5 text-sm text-[#0A0A0A] hover:border-[#0A0A0A] transition-all group"
                >
                  <div className="text-left">
                    <p className="font-medium">{t('modal_yes_label')}</p>
                    <p className="text-xs text-[#9A9A9A] mt-0.5">{t('modal_yes_sub')}</p>
                  </div>
                  <ArrowRight size={15} className="text-[#9A9A9A] group-hover:text-[#0A0A0A] transition-colors" />
                </button>

                <button
                  onClick={handleContinueToForm}
                  className="w-full flex items-center justify-between bg-[#0A0A0A] rounded-xl px-4 py-3.5 text-sm text-white hover:opacity-85 transition-opacity group"
                >
                  <div className="text-left">
                    <p className="font-medium">{t('modal_no_label')}</p>
                    <p className="text-xs text-white/50 mt-0.5">{t('modal_no_sub')}</p>
                  </div>
                  <ArrowRight size={15} className="text-white/60 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
          )}

          {step === 'form' && (
            <div className="p-6">
              <DialogHeader className="mb-5">
                <button
                  onClick={() => setStep('confirm')}
                  className="text-xs text-[#9A9A9A] hover:text-[#0A0A0A] mb-3 flex items-center gap-1 transition-colors"
                >
                  {t('back')}
                </button>
                <DialogTitle className="font-display text-lg font-medium">
                  {t('form_title')}
                </DialogTitle>
                <p className="text-xs text-[#5C5C5C] mt-1">
                  {t('form_quote_for')} <strong>{name}</strong>
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] block mb-1">{t('field_name')}</label>
                  <input
                    {...register('name')}
                    placeholder={t('field_name_placeholder')}
                    className="w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] block mb-1">{t('field_company')}</label>
                  <input
                    {...register('company')}
                    placeholder={t('field_company_placeholder')}
                    className="w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] block mb-1">{t('field_email')}</label>
                  <input
                    {...register('email')}
                    type="email"
                    placeholder={t('field_email_placeholder')}
                    className="w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] block mb-1">{t('field_phone')}</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder={t('field_phone_placeholder')}
                    className="w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#0A0A0A] block mb-1">{t('field_message')}</label>
                  <textarea
                    {...register('message')}
                    rows={3}
                    placeholder={t('field_message_placeholder')}
                    className="w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-sm bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0A0A0A] text-white px-4 py-3 rounded-lg text-[15px] font-medium hover:opacity-85 transition-opacity mt-1"
                >
                  {t('submit')}
                </button>
              </form>
            </div>
          )}

          {step === 'loading' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[200px] gap-3">
              <div className="w-6 h-6 border-2 border-[#E4E4E2] border-t-[#0A0A0A] rounded-full animate-spin" />
              <p className="text-[15px] text-[#5C5C5C]">{t('submitting')}</p>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[240px] text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center">
                <Check size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-[#0A0A0A] mb-1">{t('success_title')}</p>
                <p className="text-sm text-[#5C5C5C] leading-relaxed max-w-[260px]">
                  {t('success_body', { name })}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-2 text-sm text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
              >
                {t('close')}
              </button>
            </div>
          )}

        </DialogContent>
      </Dialog>
    </>
  )
}
