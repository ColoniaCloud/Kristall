'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import type { Installation } from '@/lib/client-portal/api'

const schema = z.object({
  installationId: z.string().min(1, 'Elegí una instalación'),
  reporterName: z.string().min(2, 'Ingresá tu nombre'),
  reporterEmail: z.string().email('Ingresá un email válido'),
  reporterPhone: z.string().optional(),
  description: z.string().min(10, 'Contanos un poco más (mínimo 10 caracteres)'),
})

type FormData = z.infer<typeof schema>

export default function ClaimForm({ installations }: { installations: Installation[] }) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const activeInstallations = installations.filter((i) => i.status === 'ACTIVE')

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/portal/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'Error al enviar el reclamo')
        setStatus('error')
        return
      }
      router.push('/cliente/reclamos')
      router.refresh()
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (activeInstallations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No tenés instalaciones con garantía activa para reclamar todavía.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-lg flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="installationId">Instalación</Label>
        <Select onValueChange={(v) => setValue('installationId', v, { shouldValidate: true })}>
          <SelectTrigger id="installationId" className="w-full">
            <SelectValue placeholder="Elegí una instalación" />
          </SelectTrigger>
          <SelectContent>
            {activeInstallations.map((i) => (
              <SelectItem key={i.id} value={i.id}>
                {i.installationCode} — {i.roll.product.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.installationId && <span className="text-sm text-destructive">{errors.installationId.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterName">Tu nombre</Label>
        <Input id="reporterName" {...register('reporterName')} />
        {errors.reporterName && <span className="text-sm text-destructive">{errors.reporterName.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterEmail">Email de contacto</Label>
        <Input id="reporterEmail" type="email" {...register('reporterEmail')} />
        {errors.reporterEmail && <span className="text-sm text-destructive">{errors.reporterEmail.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="reporterPhone">Teléfono (opcional)</Label>
        <Input id="reporterPhone" type="tel" {...register('reporterPhone')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción del problema</Label>
        <Textarea id="description" rows={4} {...register('description')} />
        {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2 w-fit">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Enviar reclamo'}
      </Button>
    </form>
  )
}
