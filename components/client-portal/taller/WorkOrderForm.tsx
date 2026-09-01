'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type {
  WorkshopClient,
  WorkshopAsset,
  WorkshopStockRoll,
} from '@/lib/client-portal/workshop'
import { describirAsset } from '@/lib/client-portal/taller-format'

/**
 * Alta rápida de una orden: cliente → vehículo → trabajo → turno.
 *
 * El orden de los campos es el de la conversación real en el mostrador, no el
 * del modelo de datos. Por eso el cliente va primero y el turno último: cuando
 * alguien llama para pedir precio, se carga la mitad de arriba y listo.
 *
 * Los vehículos se filtran por el cliente elegido y llegan todos precargados
 * desde el servidor: son pocos por taller, y hacer una llamada al cambiar el
 * select agregaría una espera justo en el medio del flujo.
 */

interface LineaForm {
  key: number
  description: string
  rollId: string
  squareMetersUsed: string
  price: string
}

let contador = 0
const nuevaLinea = (): LineaForm => ({
  key: contador++,
  description: '',
  rollId: '',
  squareMetersUsed: '',
  price: '',
})

export default function WorkOrderForm({
  clients,
  assetsByClient,
  rolls,
}: {
  clients: WorkshopClient[]
  assetsByClient: Record<string, WorkshopAsset[]>
  rolls: WorkshopStockRoll[]
}) {
  const router = useRouter()
  const [enviando, setEnviando] = useState(false)
  const [clientId, setClientId] = useState('')
  const [assetId, setAssetId] = useState('')
  const [scheduledAt, setScheduledAt] = useState('')
  const [priceQuoted, setPriceQuoted] = useState('')
  const [notes, setNotes] = useState('')
  const [lineas, setLineas] = useState<LineaForm[]>([nuevaLinea()])

  const assets = useMemo(() => assetsByClient[clientId] ?? [], [assetsByClient, clientId])

  // Solo rollos con material declarado o sin medidas conocidas. Un rollo en 0
  // sigue apareciendo pero avisado: puede quedar un recorte que el sistema no
  // sabe, y bloquearlo obligaría a mentir en los metros para poder cargar.
  const rollosUsables = rolls.filter((r) => r.status !== 'VOIDED')

  function setLinea(key: number, campo: keyof Omit<LineaForm, 'key'>, valor: string) {
    setLineas((ls) => ls.map((l) => (l.key === key ? { ...l, [campo]: valor } : l)))
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) {
      toast.error('Elegí un cliente')
      return
    }
    setEnviando(true)
    try {
      const res = await fetch('/api/portal/workshop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workshopClientId: clientId,
          assetId: assetId || null,
          // datetime-local da hora local sin zona; el Date lo interpreta como
          // local y lo serializa en UTC, que es lo que el CRM espera.
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          priceQuoted,
          notes,
          items: lineas.map((l) => ({
            description: l.description,
            rollId: l.rollId || null,
            productId: rolls.find((r) => r.id === l.rollId)?.product.id ?? null,
            squareMetersUsed: l.squareMetersUsed,
            price: l.price,
          })),
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos crear la orden')
        return
      }
      toast.success(`Orden ${body.orderNumber} creada`)
      router.push(`/cliente/taller/ordenes/${body.id}`)
      router.refresh()
    } catch {
      toast.error('Sin conexión. Probá de nuevo en un momento.')
    } finally {
      setEnviando(false)
    }
  }

  if (clients.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-6">
        <p className="font-medium">Primero cargá un cliente</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Una orden siempre es para alguien. Agregá tu primer cliente y volvé.
        </p>
        <Button asChild className="mt-4">
          <Link href="/cliente/taller/clientes">Ir a clientes</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={guardar} className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Para quién</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cliente">Cliente *</Label>
          <Select
            value={clientId}
            onValueChange={(v) => {
              setClientId(v)
              setAssetId('')
            }}
          >
            <SelectTrigger id="cliente">
              <SelectValue placeholder="Elegí un cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {c.phone ? ` · ${c.phone}` : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="vehiculo">Vehículo</Label>
          <Select value={assetId} onValueChange={setAssetId} disabled={!clientId}>
            <SelectTrigger id="vehiculo">
              <SelectValue
                placeholder={
                  !clientId
                    ? 'Elegí primero el cliente'
                    : assets.length === 0
                      ? 'Este cliente no tiene vehículos cargados'
                      : 'Elegí un vehículo'
                }
              />
            </SelectTrigger>
            <SelectContent>
              {assets.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {describirAsset(a)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Podés dejarlo para después, pero lo vas a necesitar para terminar la orden.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Qué se hace</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLineas((ls) => [...ls, nuevaLinea()])}
          >
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>

        {lineas.map((l) => (
          <div key={l.key} className="flex flex-col gap-3 rounded-md border border-border p-3">
            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label htmlFor={`desc-${l.key}`}>Trabajo</Label>
                <Input
                  id={`desc-${l.key}`}
                  value={l.description}
                  onChange={(e) => setLinea(l.key, 'description', e.target.value)}
                  placeholder="Parabrisas, laterales, luneta…"
                />
              </div>
              {lineas.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Quitar esta línea"
                  onClick={() => setLineas((ls) => ls.filter((x) => x.key !== l.key))}
                >
                  <Trash2 className="size-4" />
                </Button>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex flex-col gap-1.5 sm:col-span-3">
                <Label htmlFor={`rollo-${l.key}`}>Rollo</Label>
                <Select
                  value={l.rollId}
                  onValueChange={(v) => setLinea(l.key, 'rollId', v)}
                >
                  <SelectTrigger id={`rollo-${l.key}`}>
                    <SelectValue placeholder="Sin rollo asignado" />
                  </SelectTrigger>
                  <SelectContent>
                    {rollosUsables.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.product.name} · {r.fullRollCode}
                        {r.remainingM2 !== null ? ` · quedan ${r.remainingM2} m²` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`m2-${l.key}`}>m² usados</Label>
                <Input
                  id={`m2-${l.key}`}
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={l.squareMetersUsed}
                  onChange={(e) => setLinea(l.key, 'squareMetersUsed', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor={`precio-${l.key}`}>Precio</Label>
                <Input
                  id={`precio-${l.key}`}
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={l.price}
                  onChange={(e) => setLinea(l.key, 'price', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
        <h2 className="font-heading text-lg font-semibold">Cuándo y cuánto</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="turno">Turno</Label>
            <Input
              id="turno"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Si le ponés turno, la orden queda agendada. Si no, queda como presupuesto.
            </p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="presupuesto">Presupuesto</Label>
            <Input
              id="presupuesto"
              type="number"
              inputMode="decimal"
              min="0"
              value={priceQuoted}
              onChange={(e) => setPriceQuoted(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notas">Notas</Label>
          <Textarea
            id="notas"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Lo que haga falta recordar del trabajo"
          />
        </div>
      </section>

      <Button type="submit" size="lg" className="h-14 text-base" disabled={enviando}>
        {enviando && <Loader2 className="size-5 animate-spin" />}
        Crear la orden
      </Button>
    </form>
  )
}
