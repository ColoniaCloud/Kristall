'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

type FormData = z.infer<typeof schema>

export default function LoginForm() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
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
      const res = await fetch('/api/portal/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(
          res.status === 401
            ? 'Email o contraseña incorrectos. Si nunca creaste tu contraseña, activá tu cuenta.'
            : (body.error ?? 'Error al iniciar sesión')
        )
        setStatus('error')
        return
      }
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
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="username" {...register('email')} placeholder="tu@empresa.com" />
        {errors.email && <span className="text-sm text-destructive">Ingresá un email válido</span>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password && <span className="text-sm text-destructive">Ingresá tu contraseña</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Ingresar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/cliente/recuperar" className="underline hover:text-foreground">
          Olvidé mi contraseña
        </Link>
      </p>
      <p className="text-center text-sm text-muted-foreground">
        ¿Primera vez?{' '}
        <Link href="/cliente/activar" className="underline hover:text-foreground">
          Activá tu cuenta
        </Link>
      </p>
    </form>
  )
}
