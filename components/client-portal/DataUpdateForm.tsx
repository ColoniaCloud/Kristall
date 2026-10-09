'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MailCheck } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { DataUpdateInfo } from '@/lib/client-portal/api'

const schema = z.object({
  email: z.string().trim().email('Ingresá un email válido'),
  firstName: z.string().trim().min(1, 'Falta el nombre').max(191),
  lastName: z.string().trim().max(191),
  company: z.string().trim().max(191),
  phone: z.string().trim().max(191),
  address: z.string().trim().max(191),
  city: z.string().trim().max(191),
  state: z.string().trim().max(191),
})

type FormData = z.infer<typeof schema>

const CAMPOS: { name: Exclude<keyof FormData, 'email'>; label: string; autoComplete: string; type?: string }[] = [
  { name: 'firstName', label: 'Nombre', autoComplete: 'given-name' },
  { name: 'lastName', label: 'Apellido', autoComplete: 'family-name' },
  { name: 'company', label: 'Empresa', autoComplete: 'organization' },
  { name: 'phone', label: 'Teléfono', autoComplete: 'tel', type: 'tel' },
  { name: 'address', label: 'Dirección', autoComplete: 'street-address' },
  { name: 'city', label: 'Ciudad', autoComplete: 'address-level2' },
  { name: 'state', label: 'Provincia', autoComplete: 'address-level1' },
]

/**
 * El formulario del link de WhatsApp. Al mandarlo, los datos quedan guardados
 * y al email le llega un mail para confirmarlo: hasta entonces no entra a la
 * ficha. Si se equivocó de email puede volver a mandar el formulario.
 */
export default function DataUpdateForm({ token, info }: { token: string; info: DataUpdateInfo }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [enviadoA, setEnviadoA] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: info.pendingEmail ?? info.email ?? '',
      firstName: info.firstName,
      lastName: info.lastName,
      company: info.company ?? '',
      phone: info.phone ?? '',
      address: info.address ?? '',
      city: info.city ?? '',
      state: info.state ?? '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/portal/mis-datos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...data }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(body.error ?? 'No pudimos guardar tus datos.')
        setStatus('error')
        return
      }
      setEnviadoA(body.emailSentTo ?? data.email)
      setStatus('idle')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (enviadoA) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <MailCheck className="size-10 text-primary" />
        <h2 className="font-heading text-lg font-semibold">Revisá tu correo</h2>
        <p className="text-sm text-muted-foreground">
          Guardamos tus datos. Te mandamos un mail a <span className="text-foreground">{enviadoA}</span> para
          confirmar que es tuyo: abrilo y tocá el botón. Si no lo ves, buscalo en spam.
        </p>
        <button
          type="button"
          onClick={() => setEnviadoA(null)}
          className="text-sm underline hover:text-foreground"
        >
          Me equivoqué de email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {info.pendingEmail && (
        <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
          Ya te mandamos un mail a <span className="text-foreground">{info.pendingEmail}</span>. Si no te llegó o
          está mal, corregilo y volvé a enviar.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" inputMode="email" {...register('email')} />
        <p className="text-xs text-muted-foreground">Ahí te van a llegar tus comprobantes y garantías.</p>
        {errors.email && <span className="text-sm text-destructive">{errors.email.message}</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CAMPOS.map((c) => (
          <div key={c.name} className="flex flex-col gap-1.5">
            <Label htmlFor={c.name}>{c.label}</Label>
            <Input id={c.name} type={c.type ?? 'text'} autoComplete={c.autoComplete} {...register(c.name)} />
            {errors[c.name] && <span className="text-sm text-destructive">{errors[c.name]?.message}</span>}
          </div>
        ))}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Guardar mis datos'}
      </Button>
    </form>
  )
}
