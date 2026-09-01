'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus } from 'lucide-react'
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
  DialogTrigger,
} from '@/components/ui/dialog'

/**
 * Registra lo que el cliente final le pagó al taller.
 *
 * El aviso del diálogo no es decorativo: hay dos "cuentas" en el portal y son
 * distintas. Esta es la del taller con su cliente; la de la sección "Cuenta
 * corriente" es la del taller con Kristall. Confundirlas sería el peor error
 * posible de este módulo.
 */
export default function WorkOrderPaymentForm({
  orderId,
  currency,
}: {
  orderId: string
  currency: string
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState('')

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    const monto = Number(amount)
    if (!Number.isFinite(monto) || monto <= 0) {
      toast.error('Poné un monto mayor a cero')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch(`/api/portal/workshop/orders/${orderId}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: monto, method }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos registrar el cobro')
        return
      }
      toast.success('Cobro registrado')
      setAbierto(false)
      setAmount('')
      setMethod('')
      router.refresh()
    } catch {
      toast.error('Sin conexión. Probá de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="size-4" />
          Registrar cobro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar un cobro</DialogTitle>
          <DialogDescription>
            Lo que te pagó tu cliente por este trabajo. No tiene nada que ver con tu cuenta
            corriente con Kristall.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={guardar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="monto">Monto ({currency})</Label>
            <Input
              id="monto"
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="metodo">Forma de pago</Label>
            <Input
              id="metodo"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              placeholder="Efectivo, transferencia…"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAbierto(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando}>
              {enviando && <Loader2 className="size-4 animate-spin" />}
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
