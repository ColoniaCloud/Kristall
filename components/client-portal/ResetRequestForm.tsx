'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MailCheck } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({ email: z.string().email() })
type FormData = z.infer<typeof schema>

/**
 * "Olvidé mi contraseña".
 *
 * A diferencia del alta, la respuesta es siempre la misma exista o no la
 * cuenta: acá confirmar que un email está registrado no le sirve a nadie salvo
 * a quien esté probando direcciones.
 */
export default function ResetRequestForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    try {
      const res = await fetch('/api/portal/auth/recuperar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setMessage(body.error ?? 'No pudimos procesar el pedido.')
        setStatus('error')
        return
      }
      setMessage(body.message ?? '')
      setStatus('sent')
    } catch {
      setMessage('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-10 text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">El link vence en 1 hora.</p>
        <Link href="/cliente/ingresar" className="text-sm underline hover:text-foreground">
          Volver a ingresar
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Tu email</Label>
        <Input id="email" type="email" autoComplete="username" placeholder="tu@empresa.com" {...register('email')} />
        {errors.email && <span className="text-sm text-destructive">Ingresá un email válido</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{message}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Enviarme el link'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/cliente/ingresar" className="underline hover:text-foreground">
          Volver a ingresar
        </Link>
      </p>
    </form>
  )
}
