'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatMoney } from '@/lib/client-portal/taller-format'
import type { WorkshopService } from '@/lib/client-portal/workshop'

/**
 * El catálogo de servicios del taller.
 *
 * Es lo que ve el cliente en la página pública y entre lo que elige al pedir
 * turno. Dos decisiones que se notan en la pantalla:
 *
 * **El precio es opcional.** En polarizado depende del vehículo, así que
 * obligar a poner un número llevaría a inventar uno y a discutirlo después —
 * justo la conversación que la página tendría que ahorrar.
 *
 * **La duración no lo es.** Sin ella no se pueden calcular los huecos libres de
 * la agenda, y el turno degrada a «mandame un mensaje». Tiene un valor por
 * defecto para que no frene a nadie.
 */

const VACIO = { name: '', description: '', priceFrom: '', durationMinutes: '60' }

export default function ServicesForm({ services }: { services: WorkshopService[] }) {
  const router = useRouter()
  const [editando, setEditando] = useState<string | null>(null)
  const [creando, setCreando] = useState(false)
  const [form, setForm] = useState(VACIO)
  const [guardando, setGuardando] = useState(false)

  const activos = services.filter((s) => s.active)
  const inactivos = services.filter((s) => !s.active)

  function abrirNuevo() {
    setForm(VACIO)
    setEditando(null)
    setCreando(true)
  }

  function abrirEdicion(s: WorkshopService) {
    setForm({
      name: s.name,
      description: s.description ?? '',
      priceFrom: s.priceFrom !== null ? String(s.priceFrom) : '',
      durationMinutes: String(s.durationMinutes),
    })
    setCreando(false)
    setEditando(s.id)
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const precio = form.priceFrom.trim()
    const cuerpo = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      // Vacío es "no publico precio", que no es lo mismo que cero.
      priceFrom: precio === '' ? null : Number(precio),
      durationMinutes: Number(form.durationMinutes) || 60,
    }
    if (cuerpo.priceFrom !== null && !Number.isFinite(cuerpo.priceFrom)) {
      toast.error('El precio tiene que ser un número')
      return
    }

    setGuardando(true)
    try {
      const url = editando
        ? `/api/portal/workshop/services/${editando}`
        : '/api/portal/workshop/services'
      const res = await fetch(url, {
        method: editando ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos guardar el servicio')
        return
      }
      toast.success(editando ? 'Servicio actualizado' : 'Servicio agregado')
      setCreando(false)
      setEditando(null)
      setForm(VACIO)
      router.refresh()
    } finally {
      setGuardando(false)
    }
  }

  async function cambiarActivo(s: WorkshopService) {
    // Quitar desactiva, no borra: un servicio borrado se llevaría puesto el
    // pedido de turno que lo originó.
    const res = await fetch(`/api/portal/workshop/services/${s.id}`, {
      method: s.active ? 'DELETE' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      ...(s.active ? {} : { body: JSON.stringify({ active: true }) }),
    })
    if (!res.ok) {
      toast.error('No pudimos cambiar el servicio')
      return
    }
    toast.success(s.active ? 'Servicio quitado de tu página' : 'Servicio vuelto a publicar')
    router.refresh()
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold">Servicios</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lo que ofrecés. Aparecen en tu página y tu cliente elige uno al pedir turno.
          </p>
        </div>
        {!creando && !editando && (
          <Button type="button" size="sm" onClick={abrirNuevo}>
            <Plus className="size-4" />
            Agregar
          </Button>
        )}
      </div>

      {(creando || editando) && (
        <form onSubmit={enviar} className="flex flex-col gap-4 rounded-md border border-border p-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-name">Nombre</Label>
            <Input
              id="s-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Polarizado completo"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="s-desc">Descripción (opcional)</Label>
            <Input
              id="s-desc"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Cuatro puertas, luneta y parabrisas"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-price">Precio desde (opcional)</Label>
              <Input
                id="s-price"
                inputMode="decimal"
                value={form.priceFrom}
                onChange={(e) => setForm({ ...form, priceFrom: e.target.value })}
                placeholder="85000"
              />
              <p className="text-xs text-muted-foreground">
                Si lo dejás vacío, tu página no muestra precio para este servicio.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="s-dur">Cuánto te lleva (minutos)</Label>
              <Input
                id="s-dur"
                type="number"
                min={15}
                max={480}
                step={15}
                value={form.durationMinutes}
                onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Con esto calculamos qué horarios ofrecerle a tu cliente.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit" disabled={guardando}>
              {guardando && <Loader2 className="size-4 animate-spin" />}
              {editando ? 'Guardar cambios' : 'Agregar servicio'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setCreando(false)
                setEditando(null)
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {services.length === 0 && !creando && (
        <p className="text-sm text-muted-foreground">
          Todavía no cargaste ninguno. Sin servicios, tu página no tiene qué ofrecer.
        </p>
      )}

      {activos.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
          {activos.map((s) => (
            <Fila key={s.id} service={s} onEditar={abrirEdicion} onCambiar={cambiarActivo} />
          ))}
        </ul>
      )}

      {inactivos.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Quitados de tu página ({inactivos.length})
          </h3>
          <ul className="flex flex-col divide-y divide-border rounded-md border border-dashed border-border">
            {inactivos.map((s) => (
              <Fila key={s.id} service={s} onEditar={abrirEdicion} onCambiar={cambiarActivo} />
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

function Fila({
  service: s,
  onEditar,
  onCambiar,
}: {
  service: WorkshopService
  onEditar: (s: WorkshopService) => void
  onCambiar: (s: WorkshopService) => void
}) {
  return (
    <li className={`flex flex-wrap items-center gap-x-3 gap-y-1 p-3 ${s.active ? '' : 'opacity-60'}`}>
      <div className="min-w-0 flex-1">
        <p className="font-medium">{s.name}</p>
        {s.description && (
          <p className="truncate text-sm text-muted-foreground">{s.description}</p>
        )}
      </div>
      <span className="text-sm tabular-nums text-muted-foreground">{s.durationMinutes} min</span>
      <span className="w-24 text-right text-sm font-medium tabular-nums">
        {s.priceFrom !== null ? formatMoney(s.priceFrom, s.currency) : '—'}
      </span>
      <div className="flex items-center gap-1">
        <Button type="button" variant="ghost" size="sm" onClick={() => onEditar(s)}>
          <Pencil className="size-3.5" />
          <span className="sr-only">Editar {s.name}</span>
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => onCambiar(s)}>
          {s.active ? <Trash2 className="size-3.5" /> : <Plus className="size-3.5" />}
          <span className="sr-only">
            {s.active ? `Quitar ${s.name}` : `Volver a publicar ${s.name}`}
          </span>
        </Button>
      </div>
    </li>
  )
}
