'use client'

import { useState } from 'react'
import { Loader2, Mail } from 'lucide-react'
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
 * Reenvía al cliente final el mail con su garantía.
 *
 * Es lo que hace que "si el mail falla, se reintenta" sea cierto y no una
 * promesa: cuando el envío automático no sale —o cuando el cliente no había
 * dejado email y lo deja después—, el taller lo manda con un toque.
 *
 * El link de la garantía nunca pasa por acá. El CRM lo tiene en su base y arma
 * el mail de su lado; desde el navegador solo viaja la orden y, si hace falta,
 * una dirección.
 */
export default function ResendWarrantyEmail({
  orderId,
  emailDelCliente,
}: {
  orderId: string
  emailDelCliente: string | null
}) {
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [email, setEmail] = useState(emailDelCliente ?? '')

  async function enviar() {
    setEnviando(true)
    try {
      const res = await fetch(`/api/portal/workshop/orders/${orderId}/warranty-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Sin dirección escrita, el CRM usa la del cliente final.
        body: JSON.stringify(email.trim() ? { email: email.trim() } : {}),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos enviar el mail')
        return
      }
      toast.success(`Mail enviado a ${body.destinatario}`)
      setAbierto(false)
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
          <Mail className="size-4" />
          {emailDelCliente ? 'Reenviar mail' : 'Mandar la garantía'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mandarle la garantía al cliente</DialogTitle>
          <DialogDescription>
            {emailDelCliente
              ? 'Se le vuelve a mandar el link de su garantía.'
              : 'Este cliente no tiene email cargado. Escribí uno y se le manda.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mail-garantia">Email</Label>
          <Input
            id="mail-garantia"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="cliente@ejemplo.com"
            autoFocus={!emailDelCliente}
          />
          {emailDelCliente && (
            <p className="text-xs text-muted-foreground">
              Podés cambiarlo si te lo dio mal. Esto no le cambia el email de la ficha.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setAbierto(false)}>
            Cancelar
          </Button>
          <Button disabled={enviando} onClick={enviar}>
            {enviando && <Loader2 className="size-4 animate-spin" />}
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
