'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { WorkshopClient } from '@/lib/client-portal/workshop'

/**
 * Alta y edición de un cliente final.
 *
 * Solo el nombre es obligatorio. El email no lo es, pero el aviso de abajo
 * explica por qué conviene: es a donde va a ir el mail de garantía cuando la
 * orden se termine.
 */
export default function WorkshopClientForm({
  client,
  trigger,
}: {
  client?: WorkshopClient
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    name: client?.name ?? '',
    email: client?.email ?? '',
    phone: client?.phone ?? '',
    dni: client?.dni ?? '',
    address: client?.address ?? '',
    notes: client?.notes ?? '',
  })

  const set = (campo: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Poné al menos el nombre')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch(
        client
          ? `/api/portal/workshop/clients/${client.id}`
          : '/api/portal/workshop/clients',
        {
          method: client ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos guardar el cliente')
        return
      }
      toast.success(client ? 'Cliente actualizado' : 'Cliente agregado')
      setAbierto(false)
      if (!client) setForm({ name: '', email: '', phone: '', dni: '', address: '', notes: '' })
      router.refresh()
    } catch {
      toast.error('Sin conexión. Probá de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Dialog open={abierto} onOpenChange={setAbierto}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{client ? 'Editar cliente' : 'Nuevo cliente'}</DialogTitle>
          <DialogDescription>
            Es un cliente tuyo, del taller. No se carga en el sistema de Kristall.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={guardar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" value={form.name} onChange={set('name')} autoFocus />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" inputMode="tel" value={form.phone} onChange={set('phone')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dni">Documento</Label>
              <Input id="dni" value={form.dni} onChange={set('dni')} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set('email')} />
            <p className="text-xs text-muted-foreground">
              Sin email no le vamos a poder mandar la garantía cuando termines el trabajo.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Dirección</Label>
            <Input id="address" value={form.address} onChange={set('address')} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notas</Label>
            <Textarea id="notes" rows={3} value={form.notes} onChange={set('notes')} />
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
