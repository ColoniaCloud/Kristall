'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { VEHICLE_TYPES } from '@/lib/vehicle-types'
import type { StockRoll, CreatedInstallation } from '@/lib/client-portal/api'

/**
 * Los datos del trabajo, cargados por el instalador en el momento.
 *
 * El instalador tiene el auto adelante y al cliente al lado: es el único
 * momento en que la patente se lee bien y el mail se pregunta en voz alta. Si
 * no se carga acá, lo termina tipeando el cliente final desde el celular, y ahí
 * es donde aparecen las patentes con ceros que son o y los mails con un punto
 * de más — que después rompen el reclamo, porque el reclamo matchea por mail.
 *
 * Igual todo es opcional salvo el tipo de vehículo: un taller apurado tiene que
 * poder generar la instalación y seguir. Lo que falte lo completa el cliente.
 *
 * **Qué se pide depende de la lámina, no de una pregunta.** El rollo cuelga de
 * un producto que está clasificado como automotriz o arquitectónico desde que
 * existe, así que para un rollo de arquitectura este diálogo no muestra
 * siluetas de autos ni patente: muestra un campo para describir el trabajo. El
 * CRM aplica la misma regla del otro lado y descarta lo que no corresponda.
 */

const schema = z.object({
  clientName: z.string().trim().optional(),
  clientEmail: z.string().trim().email('Revisá el email').or(z.literal('')).optional(),
  clientPhone: z.string().trim().optional(),
  vehicleType: z.string().optional(),
  plate: z.string().trim().optional(),
  assetDescription: z.string().trim().optional(),
})

type FormData = z.infer<typeof schema>

export default function NewInstallationDialog({
  roll,
  open,
  onOpenChange,
  onCreated,
}: {
  roll: StockRoll
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (installation: CreatedInstallation) => void
}) {
  const [status, setStatus] = useState<'idle' | 'loading'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { vehicleType: '' } })

  // PPF queda del lado de los autos: es otro producto, pero va sobre un auto y
  // tiene patente.
  const esArquitectura = roll.product.category === 'ARCHITECTURAL'
  const elegido = watch('vehicleType')

  const onSubmit = async (data: FormData) => {
    // El tipo de vehículo es obligatorio solo cuando la lámina va sobre un auto.
    // Se valida acá y no en el schema porque el schema no sabe de qué rollo se
    // trata, y hacerlo condicional adentro lo volvería ilegible.
    if (!esArquitectura && !data.vehicleType) {
      setErrorMsg('Elegí el tipo de vehículo')
      return
    }
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`/api/portal/rolls/${roll.fullRollCode}/installations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Los vacíos no se mandan: un string vacío guardado es peor que un
        // campo nulo, porque después no cae en ningún fallback.
        body: JSON.stringify({
          clientName: data.clientName || undefined,
          clientEmail: data.clientEmail || undefined,
          clientPhone: data.clientPhone || undefined,
          // Cada rubro manda lo suyo. El CRM igual descarta lo que no
          // corresponde mirando el producto del rollo, pero mandar basura para
          // que la filtren del otro lado es confiar en que nadie cambie esa
          // línea.
          vehicleType: esArquitectura ? undefined : data.vehicleType,
          plate: esArquitectura ? undefined : data.plate || undefined,
          assetDescription: esArquitectura ? data.assetDescription || undefined : undefined,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(body.error ?? 'No pudimos generar la instalación')
        setStatus('idle')
        return
      }
      reset()
      onCreated(body as CreatedInstallation)
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('idle')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="crm-theme max-h-[90vh] gap-5 overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nueva instalación</DialogTitle>
          <DialogDescription>
            Rollo {roll.fullRollCode} · {roll.product.name}. Cargá los datos del trabajo — el cliente los
            confirma después al activar la garantía.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {esArquitectura ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="assetDescription">¿Qué se laminó?</Label>
              <Input
                id="assetDescription"
                placeholder="Ventanal del living, 6 paños"
                {...register('assetDescription')}
              />
              <p className="text-xs text-muted-foreground">
                Con esto tu cliente reconoce su trabajo en la garantía. Un inmueble no tiene patente,
                así que esto ocupa su lugar.
              </p>
            </div>
          ) : (
          <div className="flex flex-col gap-2">
            <Label>Tipo de vehículo</Label>
            {/* Botones con el dibujo y no un <select> de texto: el instalador
                reconoce la silueta más rápido de lo que lee «Van / Minibús», y
                acá se elige con el cliente esperando. */}
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {VEHICLE_TYPES.map((v) => {
                const activo = elegido === v.slug
                return (
                  <button
                    key={v.slug}
                    type="button"
                    onClick={() => setValue('vehicleType', v.slug, { shouldValidate: true })}
                    aria-pressed={activo}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 text-center transition-colors ${
                      activo
                        ? 'border-sky-500 bg-sky-500/10'
                        : 'border-border hover:border-sky-500/50 hover:bg-muted/50'
                    }`}
                  >
                    <Image
                      src={v.icon}
                      alt=""
                      width={44}
                      height={30}
                      className="h-8 w-auto object-contain dark:invert"
                    />
                    <span className="text-[11px] leading-tight">{v.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {!esArquitectura && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="plate">Patente</Label>
                <Input id="plate" placeholder="AB 123 CD" className="uppercase" {...register('plate')} />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientName">Nombre del cliente</Label>
              <Input id="clientName" {...register('clientName')} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientEmail">Email</Label>
              <Input id="clientEmail" type="email" {...register('clientEmail')} />
              {errors.clientEmail && (
                <span className="text-sm text-destructive">{errors.clientEmail.message}</span>
              )}
              <p className="text-xs text-muted-foreground">
                Es a donde le llega la garantía, y con lo que después reclama.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="clientPhone">WhatsApp</Label>
              <Input id="clientPhone" type="tel" placeholder="11 2345 6789" {...register('clientPhone')} />
            </div>
          </div>

          {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}

          <div className="flex items-center gap-2">
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="bg-sky-500 text-white hover:bg-sky-600"
            >
              {status === 'loading' && <Loader2 className="size-4 animate-spin" />}
              Generar instalación
            </Button>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
