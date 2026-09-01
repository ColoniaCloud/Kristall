'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Play, Check, PackageCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import type {
  WorkOrderDetail,
  WorkOrderStatus,
  EfectosDeTerminar,
} from '@/lib/client-portal/workshop'
import { toNumber } from '@/lib/client-portal/taller-format'

/**
 * Los botones de estado de una OT.
 *
 * Es la parte de la pantalla que se usa **parado al lado del auto, con una
 * mano**: por eso son botones grandes y hay como mucho dos acciones visibles a
 * la vez. La máquina de estados del CRM permite más transiciones (se puede
 * volver atrás antes de TERMINADA), pero ofrecer las seis opciones acá
 * convertiría la pantalla en un formulario. Las que faltan se hacen desde la
 * ficha, que es donde uno está sentado.
 *
 * El botón principal es el paso natural siguiente; cancelar queda aparte y con
 * confirmación.
 */

interface Accion {
  to: WorkOrderStatus
  label: string
  icon: typeof Play
  /** Pide el precio final antes de mandar. */
  pidePrecio?: boolean
}

function accionesDe(status: WorkOrderStatus): Accion[] {
  switch (status) {
    case 'PRESUPUESTADA':
    case 'AGENDADA':
      return [{ to: 'EN_PROCESO', label: 'Empezar el trabajo', icon: Play }]
    case 'EN_PROCESO':
      return [{ to: 'TERMINADA', label: 'Terminar', icon: Check, pidePrecio: true }]
    case 'TERMINADA':
      return [{ to: 'ENTREGADA', label: 'Entregar', icon: PackageCheck }]
    default:
      // ENTREGADA y CANCELADA son terminales: no hay nada que ofrecer.
      return []
  }
}

/**
 * Le cuenta al instalador qué pasó al terminar.
 *
 * Terminar una orden dispara tres cosas invisibles —se genera la garantía, se
 * activa, se manda el mail— y cualquiera de ellas puede no salir. Que la
 * pantalla se limpie sin decir nada sería lo peor: el instalador se entera un
 * mes después, cuando el cliente reclama y no hay garantía.
 *
 * Los toasts son varios y no uno solo a propósito: un problema de rollo y un
 * mail que no salió son cosas distintas, se resuelven distinto, y mezclarlas en
 * un párrafo hace que no se lea ninguna.
 */
function avisarEfectos(efectos: EfectosDeTerminar | undefined) {
  if (!efectos) {
    toast.success('Orden terminada')
    return
  }

  if (efectos.garantias.length === 1) {
    toast.success(`Orden terminada. Garantía ${efectos.garantias[0].installationCode} activada.`)
  } else if (efectos.garantias.length > 1) {
    toast.success(
      `Orden terminada. Se activaron ${efectos.garantias.length} garantías, una por cada rollo que usaste.`
    )
  } else if (efectos.problemas.length === 0) {
    // Sin lámina no hay garantía, y está bien: un pulido no lleva.
    toast.success('Orden terminada')
  }

  for (const p of efectos.problemas) {
    toast.warning(`Sin garantía para el rollo ${p.fullRollCode}: ${p.motivo}. Avisale a Kristall.`, {
      duration: 12000,
    })
  }

  if (efectos.garantias.length > 0 && !efectos.mail.enviado) {
    toast.warning(`No se le mandó el mail al cliente: ${efectos.mail.motivo}.`, { duration: 12000 })
  }
}

export default function WorkOrderActions({ order }: { order: WorkOrderDetail }) {
  const router = useRouter()
  const [enviando, setEnviando] = useState<WorkOrderStatus | null>(null)
  const [terminar, setTerminar] = useState(false)
  const [cancelar, setCancelar] = useState(false)
  const [precioFinal, setPrecioFinal] = useState(
    String(toNumber(order.priceFinal) ?? toNumber(order.priceQuoted) ?? '')
  )

  const acciones = accionesDe(order.status)
  const puedeCancelar = !['TERMINADA', 'ENTREGADA', 'CANCELADA'].includes(order.status)

  async function transicionar(to: WorkOrderStatus, priceFinal?: string) {
    setEnviando(to)
    try {
      const res = await fetch(`/api/portal/workshop/orders/${order.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, priceFinal: priceFinal ?? null }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        // El mensaje del CRM explica exactamente por qué no se puede
        // ("No se puede pasar de TERMINADA a EN_PROCESO"). Mostrarlo tal cual
        // es más útil que traducirlo a un genérico.
        toast.error(body.error ?? 'No pudimos cambiar el estado')
        return
      }
      setTerminar(false)
      setCancelar(false)
      if (to === 'TERMINADA') avisarEfectos(body.efectos)
      router.refresh()
    } catch {
      toast.error('Sin conexión. Probá de nuevo en un momento.')
    } finally {
      setEnviando(null)
    }
  }

  if (acciones.length === 0 && !puedeCancelar) {
    return null
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row">
        {acciones.map((a) => (
          <Button
            key={a.to}
            size="lg"
            className="h-14 flex-1 text-base"
            disabled={enviando !== null}
            onClick={() => (a.pidePrecio ? setTerminar(true) : transicionar(a.to))}
          >
            {enviando === a.to ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <a.icon className="size-5" />
            )}
            {a.label}
          </Button>
        ))}
        {puedeCancelar && (
          <Button
            variant="outline"
            size="lg"
            className="h-14 text-base sm:w-auto"
            disabled={enviando !== null}
            onClick={() => setCancelar(true)}
          >
            <X className="size-5" />
            Cancelar
          </Button>
        )}
      </div>

      <Dialog open={terminar} onOpenChange={setTerminar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Terminar la orden</DialogTitle>
            <DialogDescription>
              Poné cuánto salió al final. Después de terminar la orden ya no se puede volver
              atrás ni cancelarla.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="precioFinal">Precio final ({order.currency})</Label>
            <Input
              id="precioFinal"
              type="number"
              inputMode="decimal"
              min="0"
              value={precioFinal}
              onChange={(e) => setPrecioFinal(e.target.value)}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">
              Podés dejarlo vacío y cargarlo después desde la ficha.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTerminar(false)}>
              Volver
            </Button>
            <Button
              disabled={enviando !== null}
              onClick={() => transicionar('TERMINADA', precioFinal)}
            >
              {enviando === 'TERMINADA' && <Loader2 className="size-4 animate-spin" />}
              Terminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelar} onOpenChange={setCancelar}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar la orden {order.orderNumber}?</DialogTitle>
            <DialogDescription>
              Se libera el turno y la orden queda como cancelada. El material que hubieras
              cargado vuelve a contar como disponible. No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelar(false)}>
              Volver
            </Button>
            <Button
              variant="destructive"
              disabled={enviando !== null}
              onClick={() => transicionar('CANCELADA')}
            >
              {enviando === 'CANCELADA' && <Loader2 className="size-4 animate-spin" />}
              Cancelar la orden
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
