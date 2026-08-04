'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string(),
    whatsapp: z.string().min(6, 'Ingresá un número válido').max(30),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

/**
 * Paso 2 del alta: contraseña y confirmación del WhatsApp.
 *
 * Si el CRM ya tiene un número cargado se muestra para que el Cliente confirme
 * o corrija, en vez de pedirlo en blanco (18 de 22 clientes ya lo tienen). Lo
 * que cargue acá **no pisa** el número de su ficha en el CRM: si difiere, un
 * operador decide cuál vale.
 */
export default function ActivateForm({
  token,
  whatsappActual,
}: {
  token: string
  whatsappActual: string | null
}) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { whatsapp: whatsappActual ?? '' },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/portal/auth/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: data.password, whatsapp: data.whatsapp }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'No pudimos activar la cuenta.')
        setStatus('error')
        return
      }
      // La activación ya deja la sesión abierta: no hace falta que vuelva a
      // escribir la contraseña que acaba de elegir.
      router.push('/cliente/dashboard')
      router.refresh()
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Elegí tu contraseña</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">Repetila</Label>
        <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} />
        {errors.confirm && <span className="text-sm text-destructive">{errors.confirm.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="whatsapp">WhatsApp</Label>
        <Input id="whatsapp" type="tel" inputMode="tel" {...register('whatsapp')} placeholder="1125835244" />
        <p className="text-xs text-muted-foreground">
          {whatsappActual
            ? 'Este es el número que tenemos registrado. Si cambió, corregilo acá.'
            : 'No tenemos un número tuyo. Dejanos uno para avisarte de tus compras y vencimientos.'}
        </p>
        {errors.whatsapp && <span className="text-sm text-destructive">{errors.whatsapp.message}</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Crear mi cuenta'}
      </Button>
    </form>
  )
}
