'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

const schema = z.object({
  assetType: z.enum(['VEHICLE', 'WINDOW', 'BUILDING', 'OTHER']),
  assetDescription: z.string().optional(),
  clientName: z.string().min(2, 'Ingresá tu nombre'),
  clientEmail: z.string().email('Ingresá un email válido'),
  clientPhone: z.string().optional(),
  clientDni: z.string().optional(),
  installerName: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const ASSET_LABELS: Record<FormData['assetType'], string> = {
  VEHICLE: 'Vehículo',
  WINDOW: 'Ventana',
  BUILDING: 'Inmueble',
  OTHER: 'Otro',
}

interface Props {
  token: string
  onActivated: (expiresAt: string) => void
  /** Datos que ya cargó el taller. Prellenan el formulario. */
  precargado?: {
    installerName?: string | null
    clientEmail?: string | null
    /** Ya elegido por el taller: si vino, no se vuelve a preguntar. */
    assetTypeFijo?: boolean
  }
}

export default function ActivationForm({ token, onActivated, precargado }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // El taller no se elige: lo sabe el sistema, porque la garantía cuelga
      // del rollo que ESE taller compró. Preguntarlo con el logo del taller
      // arriba de la pantalla era pedirle a la persona que confirmara algo que
      // ya estaba a la vista, y dejaba abierto que escribiera cualquier cosa.
      installerName: precargado?.installerName ?? '',
      clientEmail: precargado?.clientEmail ?? '',
      ...(precargado?.assetTypeFijo ? { assetType: 'VEHICLE' as const } : {}),
    },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/garantia/${token}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(body.error ?? 'Error al activar la garantía')
        setStatus('error')
        return
      }
      onActivated(body.expiresAt)
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Si el taller ya cargó el vehículo, esto está resuelto y se muestra en
          la ficha de arriba — volver a preguntarlo solo da lugar a que se
          conteste distinto. */}
      {!precargado?.assetTypeFijo && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="assetType">Tipo de instalación</Label>
          <Select
            onValueChange={(v) => setValue('assetType', v as FormData['assetType'], { shouldValidate: true })}
          >
            <SelectTrigger id="assetType" className="w-full">
              <SelectValue placeholder="Elegí una opción" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(ASSET_LABELS) as FormData['assetType'][]).map((value) => (
                <SelectItem key={value} value={value}>
                  {ASSET_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.assetType && <span className="text-sm text-destructive">Elegí un tipo</span>}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assetDescription">Descripción (opcional)</Label>
        <Input
          id="assetDescription"
          placeholder="Ej: Toyota Corolla 2022, patente AB123CD"
          {...register('assetDescription')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientName">Tu nombre</Label>
        <Input id="clientName" {...register('clientName')} />
        {errors.clientName && <span className="text-sm text-destructive">{errors.clientName.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientEmail">Email</Label>
        <Input id="clientEmail" type="email" {...register('clientEmail')} />
        {errors.clientEmail && <span className="text-sm text-destructive">{errors.clientEmail.message}</span>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientPhone">Teléfono (opcional)</Label>
        <Input id="clientPhone" type="tel" {...register('clientPhone')} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="clientDni">DNI (opcional, recomendado)</Label>
        <Input id="clientDni" {...register('clientDni')} />
        <p className="text-xs text-muted-foreground">
          Te va a servir para reclamar después si no recordás el email exacto que usaste.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="installerName">Taller que instaló</Label>
        {/* `readOnly` y no `disabled`: un campo deshabilitado no se envía, y
            queremos que el nombre viaje tal cual. */}
        <Input
          id="installerName"
          readOnly={Boolean(precargado?.installerName)}
          className={precargado?.installerName ? 'bg-muted text-muted-foreground' : undefined}
          {...register('installerName')}
        />
      </div>

      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

      <Button type="submit" disabled={status === 'loading'} className="mt-2">
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Activar garantía'}
      </Button>
    </form>
  )
}
