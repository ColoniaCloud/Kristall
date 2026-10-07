'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ProductCategory } from '@/lib/client-portal/product-category'
import { extrasParaEnviar } from '@/lib/reclamos'
import CamposReclamo, { RECLAMO_EN_BLANCO, type ValoresReclamo } from './CamposReclamo'

/**
 * Reportar un problema desde la sesión de código corto.
 *
 * Antes acá decía «para reclamar necesitás el link original» y ofrecía un
 * formulario de contacto. O sea: la contraseña servía para mirar el estado de
 * la garantía y para nada más, que es la mitad menos útil — justo cuando la
 * persona tiene un problema es cuando menos ganas tiene de ir a buscar un mail
 * viejo.
 *
 * Ahora el reclamo se abre desde acá. **No hace falta el link ni el email de la
 * activación**: la identidad ya quedó probada al entrar con el código y la
 * contraseña, y el código de la garantía sale de la cookie firmada del lado del
 * servidor, no de esta pantalla.
 */

const schema = z.object({
  reporterName: z.string().min(2, 'Ingresá tu nombre'),
  reporterEmail: z.string().email('Ingresá un email válido').or(z.literal('')).optional(),
  reporterPhone: z.string().optional(),
  description: z.string().min(10, 'Contanos un poco más de lo que pasó'),
})

type FormData = z.infer<typeof schema>

interface Props {
  installationCode: string
  productName: string
  /** El rubro de la lámina: decide si se ofrece la rotura del vidrio y los paños. */
  categoria: ProductCategory | null
}

export default function MiGarantiaClaimBlock({ installationCode, productName, categoria }: Props) {
  const [abierto, setAbierto] = useState(false)
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
      const res = await fetch('/api/garantia/mi-garantia/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, ...extrasParaEnviar(categoria, extras) }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorMsg(body.error ?? 'No pudimos enviar tu reclamo')
        setStatus('error')
        return
      }
      setStatus('success')
    } catch {
      setErrorMsg('Error de conexión. Probá de nuevo en un momento.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="flex items-center gap-2 font-medium text-emerald-800">
          <CheckCircle2 className="size-5 shrink-0" />
          Recibimos tu reclamo
        </p>
        <p className="mt-1 text-sm text-emerald-700">
          Lo estamos revisando y te vamos a escribir con novedades. Guardá tu código{' '}
          <span className="font-medium">{installationCode}</span> por las dudas.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="mb-2 text-sm font-medium">¿Tenés un problema con tu {productName}?</p>

      {!abierto ? (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Contanos qué pasó y lo revisamos. No necesitás buscar ningún link.
          </p>
          <Button variant="outline" size="sm" onClick={() => setAbierto(true)}>
            Reportar un problema
          </Button>
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reporterName">Tu nombre</Label>
            <Input id="reporterName" {...register('reporterName')} />
            {errors.reporterName && (
              <span className="text-sm text-destructive">{errors.reporterName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reporterEmail">Email (opcional)</Label>
            <Input id="reporterEmail" type="email" {...register('reporterEmail')} />
            <p className="text-xs text-muted-foreground">
              Si lo dejás, te escribimos ahí cuando haya novedades.
            </p>
            {errors.reporterEmail && (
              <span className="text-sm text-destructive">{errors.reporterEmail.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="reporterPhone">Teléfono (opcional)</Label>
            <Input id="reporterPhone" inputMode="tel" {...register('reporterPhone')} />
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
            <Label htmlFor="description">Contanos un poco más</Label>
            <Textarea id="description" rows={4} {...register('description')} />
            {errors.description && (
              <span className="text-sm text-destructive">{errors.description.message}</span>
            )}
          </div>

          {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={status === 'loading'}>
              {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
              Enviar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
