'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm'],
  })

type FormData = z.infer<typeof schema>

/**
 * Contraseña nueva.
 *
 * No abre sesión al terminar: el Cliente entra por el login normal. Así el link
 * del mail, por sí solo, nunca alcanza para quedar adentro de la cuenta.
 */
export default function ResetForm({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

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
        body: JSON.stringify({ token, password: data.password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'No pudimos cambiar la contraseña.')
        setStatus('error')
        return
      }
      setStatus('done')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h2 className="font-heading text-lg font-semibold">Listo</h2>
        <p className="text-sm text-muted-foreground">Ya podés ingresar con tu contraseña nueva.</p>
        <Button asChild className="mt-2 w-full">
          <Link href="/cliente/ingresar">Ingresar</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña nueva</Label>
        <Input id="password" type="password" autoComplete="new-password" {...register('password')} />
        {errors.password && <span className="text-sm text-destructive">{errors.password.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm">Repetila</Label>
        <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} />
        {errors.confirm && <span className="text-sm text-destructive">{errors.confirm.message}</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Cambiar contraseña'}
      </Button>
    </form>
  )
}
