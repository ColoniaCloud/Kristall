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
 * Paso 1 del alta: el Cliente pone el email que Kristall tiene en su ficha.
 *
 * Si coincide, se le avisa en pantalla y se le manda el link por mail. Mostrar
 * si la cuenta existe o no es intencional (así el Cliente sabe si seguir o
 * llamar); el CRM limita a 3 intentos cada 15 minutos para que no se pueda
 * usar como forma de averiguar quién le compra a Kristall.
 */
export default function ActivateRequestForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'active' | 'notfound' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setMessage('')
    try {
      const res = await fetch('/api/portal/auth/activar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })
      const body = await res.json().catch(() => ({}))

      if (!res.ok) {
        setMessage(body.error ?? 'No pudimos procesar el pedido. Intentá de nuevo.')
        setStatus('error')
        return
      }

      setMessage(body.message ?? '')
      if (!body.found) setStatus('notfound')
      else if (body.alreadyActive) setStatus('active')
      else setStatus('sent')
    } catch {
      setMessage('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-10 text-primary" />
        <h2 className="font-heading text-lg font-semibold">Encontramos tu cuenta</h2>
        <p className="text-sm text-muted-foreground">{message}</p>
        <p className="text-sm text-muted-foreground">
          Revisá tu correo. El link vence en 24 horas y se usa una sola vez.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Tu email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="username"
          placeholder="tu@empresa.com"
          {...register('email')}
        />
        <p className="text-xs text-muted-foreground">
          Usá el mismo que le diste a Kristall cuando compraste.
        </p>
        {errors.email && <span className="text-sm text-destructive">Ingresá un email válido</span>}
      </div>

      {(status === 'notfound' || status === 'active' || status === 'error') && (
        <p className={status === 'error' ? 'text-sm text-destructive' : 'text-sm text-muted-foreground'}>
          {message}
        </p>
      )}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Continuar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tenés cuenta?{' '}
        <Link href="/cliente/ingresar" className="underline hover:text-foreground">
          Ingresar
        </Link>
      </p>
    </form>
  )
}
