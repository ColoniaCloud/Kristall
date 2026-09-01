'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { AssetType } from '@/lib/client-portal/workshop'
import { TIPO_LABEL } from '@/lib/client-portal/taller-format'

/**
 * Alta de un vehículo o superficie para un cliente final.
 *
 * Todos los campos son opcionales, incluida la patente: el instalador tiene que
 * poder cargar "el Corolla azul" y seguir trabajando. Los datos se completan
 * después, y el CRM solo exige tener el vehículo cargado —no completo— para
 * poder terminar una orden.
 *
 * No hay edición ni borrado todavía: quedaron fuera del contrato de esta fase
 * (ver CLIENT_PORTAL_API.md 4.10.4).
 */
export default function WorkshopAssetForm({
  clientId,
  trigger,
}: {
  clientId: string
  trigger: React.ReactNode
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [form, setForm] = useState({
    type: 'VEHICLE' as AssetType,
    identifier: '',
    brand: '',
    model: '',
    year: '',
    color: '',
  })

  const set = (campo: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      const res = await fetch(`/api/portal/workshop/clients/${clientId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, year: form.year || null }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos guardar el vehículo')
        return
      }
      toast.success('Vehículo agregado')
      setAbierto(false)
      setForm({ type: 'VEHICLE', identifier: '', brand: '', model: '', year: '', color: '' })
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo vehículo</DialogTitle>
          <DialogDescription>
            Cargá lo que tengas a mano. Después lo completás.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={guardar} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="type">Tipo</Label>
            <Select
              value={form.type}
              onValueChange={(v) => setForm((f) => ({ ...f, type: v as AssetType }))}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TIPO_LABEL) as AssetType[]).map((t) => (
                  <SelectItem key={t} value={t}>
                    {TIPO_LABEL[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="identifier">
              {form.type === 'VEHICLE' ? 'Patente' : 'Identificación'}
            </Label>
            <Input
              id="identifier"
              value={form.identifier}
              onChange={set('identifier')}
              placeholder={form.type === 'VEHICLE' ? 'AB 123 CD' : 'Vidriera del frente'}
              autoFocus
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" value={form.brand} onChange={set('brand')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" value={form.model} onChange={set('model')} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="year">Año</Label>
              <Input
                id="year"
                type="number"
                inputMode="numeric"
                min="1900"
                max="2100"
                value={form.year}
                onChange={set('year')}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="color">Color</Label>
              <Input id="color" value={form.color} onChange={set('color')} />
            </div>
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
