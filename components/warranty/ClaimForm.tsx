'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ProductCategory } from '@/lib/client-portal/product-category'
import { extrasParaEnviar } from '@/lib/reclamos'
import CamposReclamo, { RECLAMO_EN_BLANCO, type ValoresReclamo } from './CamposReclamo'

const schema = z
  .object({
    reporterName: z.string().min(2, 'Ingresá tu nombre'),
    reporterEmail: z.string().email('Ingresá un email válido').optional().or(z.literal('')),
    reporterDni: z.string().optional(),
    reporterPhone: z.string().optional(),
    description: z.string().min(10, 'Contanos un poco más (mínimo 10 caracteres)'),
  })
  .refine((data) => !!data.reporterEmail || !!data.reporterDni, {
    message: 'Ingresá el mismo email o DNI que usaste al activar',
    path: ['reporterEmail'],
  })

type FormData = z.infer<typeof schema>

export default function ClaimForm({
  token,
  categoria,
}: {
  token: string
  /** El rubro de la lámina: decide si se ofrece la rotura del vidrio y los paños. */
  categoria: ProductCategory | null
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [extras, setExtras] = useState<ValoresReclamo>(RECLAMO_EN_BLANCO)
  const [faltaTipo, setFaltaTipo] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (!extras.issueType) {
      setFaltaTipo(true)
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/garantia/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...extrasParaEnviar(categoria, extras), activationToken: token }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'Error al enviar el reclamo')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-medium text-emerald-800">Reclamo enviado</p>
        <p className="mt-1 text-sm text-emerald-700">Nos vamos a poner en contacto a la brevedad.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterName">Tu nombre</Label>
        <Input id="reporterName" {...register('reporterName')} />
        {errors.reporterName && <span className="text-sm text-destructive">{errors.reporterName.message}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterEmail">Email usado al activar</Label>
        <Input id="reporterEmail" type="email" {...register('reporterEmail')} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterDni">DNI usado al activar</Label>
        <Input id="reporterDni" {...register('reporterDni')} />
      </div>
      {errors.reporterEmail && <p className="-mt-2 text-sm text-destructive">{errors.reporterEmail.message}</p>}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterPhone">Teléfono (opcional)</Label>
        <Input id="reporterPhone" type="tel" {...register('reporterPhone')} />
      </div>
      <CamposReclamo
        categoria={categoria}
        valores={extras}
        cambiar={(v) => {
          setExtras(v)
          if (v.issueType) setFaltaTipo(false)
        }}
        error={faltaTipo ? 'Elegí qué pasó' : undefined}
      />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción del problema</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Enviar reclamo'}
      </Button>
    </form>
  )
}
