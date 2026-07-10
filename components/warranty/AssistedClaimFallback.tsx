'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(2, 'Ingresá tu nombre'),
  email: z.string().email('Ingresá un email válido'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
  installationCode: string
  productName: string
}

export default function AssistedClaimFallback({ installationCode, productName }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          source: 'garantia-asistido',
          message: `Reclamo de garantía sin link original. Código: ${installationCode}. Producto: ${productName}.`,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setErrorMsg('Error al enviar la solicitud. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm font-medium text-emerald-700">
        Listo, recibimos tu solicitud. Un asesor de Kristall te va a contactar para ayudarte con el reclamo.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="af-name">Tu nombre</Label>
        <Input id="af-name" {...register('name')} />
        {errors.name && <span className="text-sm text-destructive">{errors.name.message}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="af-email">Email</Label>
        <Input id="af-email" type="email" {...register('email')} />
        {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="af-phone">Teléfono (opcional)</Label>
        <Input id="af-phone" type="tel" {...register('phone')} />
      </div>
      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}
      <Button type="submit" disabled={status === 'loading'} size="sm" className="w-fit">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Enviar solicitud'}
      </Button>
    </form>
  )
}
