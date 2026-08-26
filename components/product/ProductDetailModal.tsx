'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { getLinea, productoNombre, productoDestacadaSrc, lineaDestacadaSrc, lineaLogoSrc, type Producto } from '@/lib/catalogo'
import { trackLead } from '@/lib/analytics'
import AddToCartControl from '@/components/cart/AddToCartControl'

interface ProductDetailModalProps {
  producto: Producto
  onClose: () => void
}

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  email: z.string().email(),
})

type FormData = z.infer<typeof schema>

export default function ProductDetailModal({ producto, onClose }: ProductDetailModalProps) {
  const t = useTranslations('product_modal')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  // Todavía no todos los productos tienen su propia foto; si la del
  // producto da 404, cae a la de línea (ver productoDestacadaSrc).
  const [imgSrc, setImgSrc] = useState(() => productoDestacadaSrc(producto))

  const linea = getLinea(producto.lineaSlug)
  const nombre = productoNombre(producto)

  // Bloquear scroll del body + cerrar con Escape
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'producto',
          message: `Consulta de producto: ${nombre} (${producto.codigo}).`,
        }),
      })
      if (!res.ok) throw new Error('error')
      setStatus('success')
      trackLead('producto')
    } catch {
      setStatus('error')
    }
  }

  const rows: { label: string; value: string; hint?: string }[] = []
  if (linea?.tecnologia) rows.push({ label: t('technology_label'), value: linea.tecnologia })
  if (producto.garantiaAnios != null) rows.push({ label: t('warranty_label'), value: t('warranty_years', { n: producto.garantiaAnios }) })
  if (producto.vlt != null) rows.push({ label: 'VLT', value: `${producto.vlt}%` })
  if (producto.ir != null) rows.push({ label: 'IR', value: `${producto.ir}%` })
  if (producto.uvr != null) rows.push({ label: 'UV', value: `${producto.uvr}%` })
  if (producto.espesor) {
    rows.push({
      label: t('spec_thickness'),
      value: `${producto.espesor.valor} ${producto.espesor.unidad}`,
      hint: producto.espesor.unidad === 'ply' ? t('thickness_hint_ply') : t('thickness_hint_mil'),
    })
  }
  rows.push({ label: t('code_label'), value: producto.codigo })

  const inputClass =
    'w-full border border-[#E4E4E2] rounded-lg px-3 py-2.5 text-base bg-[#F2F2F0] outline-none focus:border-[#0A0A0A] transition-colors'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Banner con foto + logo + categoría */}
        <div className="relative h-40">
          <Image
            src={imgSrc}
            alt={nombre}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, 448px"
            onError={() => setImgSrc(lineaDestacadaSrc(producto.lineaSlug))}
          />
          {linea && (
            <span className="absolute top-3 right-12 text-[10px] uppercase tracking-wider bg-white/90 text-[#0A0A0A] rounded-full px-2.5 py-0.5 font-medium">
              {t(`categoria_${linea.categoria}`)}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label={t('close')}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-[#0A0A0A] hover:bg-white transition-colors"
          >
            <X size={15} />
          </button>
          {linea && (
            <div className="absolute bottom-3 left-4 w-24 h-9">
              <Image src={lineaLogoSrc(linea.slug)} alt={linea.nombre} fill className="object-contain object-left brightness-0 invert" sizes="96px" />
            </div>
          )}
        </div>

        <div className="p-5">
          <p className="text-[12px] uppercase tracking-widest text-[#9A9A9A] mb-1">{t('detail_label')}</p>
          <h3 className="text-lg font-medium text-[#0A0A0A] mb-4" style={{ fontFamily: 'var(--font-display)' }}>{nombre}</h3>

          {/* Tabla de datos */}
          <div className="rounded-xl border border-[#E4E4E2] overflow-hidden mb-1">
            {rows.map((r, i) => (
              <div
                key={r.label}
                className={`grid grid-cols-[88px_1fr] text-sm ${i % 2 === 0 ? 'bg-[#F8F8F7]' : 'bg-white'}`}
              >
                <span className="px-3 py-2 text-[#9A9A9A] border-r border-[#E4E4E2]">{r.label}</span>
                <span className="px-3 py-2 text-[#0A0A0A] font-medium tabular-nums">{r.value}</span>
              </div>
            ))}
          </div>
          {rows.find((r) => r.hint) && (
            <p className="text-[11px] text-[#9A9A9A] leading-relaxed mb-4 px-1">
              {rows.find((r) => r.hint)?.hint}
            </p>
          )}

          {/* Agregar al carrito de cotización */}
          <div className="mb-5 pb-5 border-b border-[#E4E4E2]">
            <AddToCartControl producto={producto} nombre={nombre} />
          </div>

          {/* Formulario de consulta puntual (sin pasar por el carrito) */}
          {status === 'success' ? (
            <div className="bg-[#F0FFF4] border border-green-200 rounded-xl p-5 text-center">
              <CheckCircle size={20} className="text-green-500 mx-auto mb-2" />
              <div className="text-[16px] font-medium text-[#0A0A0A] mb-1">{t('success_title')}</div>
              <div className="text-sm text-[#5C5C5C]">{t('success_body')}</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <p className="text-sm font-medium text-[#0A0A0A] mb-3">{t('form_title')}</p>

              <div className="flex flex-col gap-3">
                <div>
                  <input {...register('name')} type="text" placeholder={t('field_name')} className={inputClass} />
                  {errors.name && <span className="text-xs text-red-500 mt-1 block">{t('error_name')}</span>}
                </div>
                <div>
                  <input {...register('phone')} type="tel" placeholder={t('field_phone')} className={inputClass} />
                </div>
                <div>
                  <input {...register('email')} type="email" placeholder={t('field_email')} className={inputClass} />
                  {errors.email && <span className="text-xs text-red-500 mt-1 block">{t('error_email')}</span>}
                </div>
              </div>

              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3 text-xs text-red-600">{t('error')}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full text-white px-6 py-3 rounded-lg text-[16px] font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
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
    </div>
  )
}
