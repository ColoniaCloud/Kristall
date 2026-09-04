'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, X, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CopyableCode from '@/components/client-portal/CopyableCode'
import type { WorkshopSettings } from '@/lib/client-portal/workshop'

/**
 * La página pública del taller: el nombre de usuario y los datos de contacto
 * que se muestran.
 *
 * El handle es una identidad pública y se elige una sola vez en la práctica:
 * cambiarlo rompe cualquier tarjeta o link que el instalador ya haya repartido.
 * Por eso la pantalla insiste con la disponibilidad antes de guardar y no
 * después, y por eso muestra la URL completa mientras se escribe.
 *
 * La dirección se pide acá y **no se hereda de la ficha del CRM**: el domicilio
 * fiscal no siempre es el local donde se atiende, y una dirección de negocio
 * publicada sin que nadie la haya confirmado es una fuga, no una función.
 */

const BASE_PUBLICA = 'polariz.ar'

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'consultando' }
  | { tipo: 'libre' }
  | { tipo: 'ocupado'; motivo: string }

/** La respuesta del servidor, atada al handle que se preguntó. */
type Respuesta = { handle: string; disponible: boolean; motivo: string | null }

export default function PublicPageForm({ settings }: { settings: WorkshopSettings }) {
  const router = useRouter()
  const [handle, setHandle] = useState(settings.handle ?? '')
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [guardando, setGuardando] = useState(false)
  const [form, setForm] = useState({
    publicAddress: settings.publicAddress ?? '',
    publicPhone: settings.publicPhone ?? '',
    publicEmail: settings.publicEmail ?? '',
  })

  // El handle guardado es el que ya es suyo: no tiene sentido consultarlo.
  const sinCambios = handle === (settings.handle ?? '')

  // El estado se DERIVA, no se guarda. Guardarlo obligaba a un setState dentro
  // del efecto, que dispara un render en cascada por cada tecla — y además abría
  // la puerta a mostrar «libre» de una consulta vieja mientras se escribe otra
  // cosa. Atando la respuesta al handle que se preguntó, eso no puede pasar:
  // si no coinciden, todavía estamos consultando.
  const estado: Estado =
    !handle || sinCambios
      ? { tipo: 'inicial' }
      : respuesta?.handle !== handle
        ? { tipo: 'consultando' }
        : respuesta.disponible
          ? { tipo: 'libre' }
          : { tipo: 'ocupado', motivo: respuesta.motivo ?? 'No se puede usar.' }

  const publicable = Boolean(settings.handle) || estado.tipo === 'libre'

  // Sugerencias solo si todavía no eligió. Al que ya tiene handle, ofrecerle
  // otros lo invita a cambiarlo, que es justo lo que no queremos.
  useEffect(() => {
    if (settings.handle) return
    fetch('/api/portal/workshop/handle')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.sugerencias?.length) return
        setSugerencias(d.sugerencias)
        setHandle((actual) => actual || d.sugerencias[0])
      })
      .catch(() => {})
  }, [settings.handle])

  // Debounce de 400 ms. Sin esto se consulta en cada tecla, y el rate limit del
  // CRM es por api key y lo comparte todo el portal: escribir un handle largo
  // se comería la cuota de todos.
  useEffect(() => {
    if (!handle || sinCambios) return
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portal/workshop/handle?handle=${encodeURIComponent(handle)}`)
        const d = await res.json()
        setRespuesta({ handle, disponible: Boolean(d.disponible), motivo: d.motivo ?? null })
      } catch {
        // Sin respuesta se queda en «consultando», que es honesto: no sabemos.
      }
    }, 400)
    return () => clearTimeout(t)
  }, [handle, sinCambios])

  async function guardar(patch: Record<string, unknown>, mensaje: string) {
    setGuardando(true)
    try {
      const res = await fetch('/api/portal/workshop/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos guardar')
        return false
      }
      toast.success(mensaje)
      router.refresh()
      return true
    } finally {
      setGuardando(false)
    }
  }

  const urlCompleta = `${BASE_PUBLICA}/${settings.handle ?? handle}`

  return (
    <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-4 md:p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Tu página pública</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Una página con tu logo y tus servicios, donde tus clientes te piden turno.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="handle">Nombre de usuario</Label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">{BASE_PUBLICA}/</span>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="tallercarlos"
            className="font-mono"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <Disponibilidad estado={estado} />
        </div>

        {estado.tipo === 'ocupado' && (
          <span className="text-sm text-destructive">{estado.motivo}</span>
        )}

        {sugerencias.length > 0 && !settings.handle && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Sugerencias:</span>
            {sugerencias.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHandle(s)}
                className="rounded-full border border-border px-2 py-0.5 font-mono text-xs hover:border-sky-500 hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {settings.handle
            ? 'Si lo cambiás, los links que ya repartiste dejan de funcionar.'
            : 'Elegilo con cuidado: es la dirección que vas a repartir, y cambiarla rompe los links viejos.'}
        </p>

        {!sinCambios && (
          <Button
            type="button"
            size="sm"
            className="mt-1 self-start"
            disabled={guardando || estado.tipo !== 'libre'}
            onClick={() => guardar({ handle }, 'Nombre de usuario guardado')}
          >
            {guardando && <Loader2 className="size-4 animate-spin" />}
            Guardar nombre
          </Button>
        )}
      </div>

      {settings.handle && (
        <CopyableCode value={urlCompleta} label="La dirección de tu página" />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicAddress">Dirección que se muestra</Label>
          <Input
            id="publicAddress"
            value={form.publicAddress}
            onChange={(e) => setForm({ ...form, publicAddress: e.target.value })}
            placeholder="Av. Siempreviva 742, Springfield"
          />
          <p className="text-xs text-muted-foreground">
            Es la que ven tus clientes. Puede ser distinta de la que tenemos en tu ficha.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicPhone">Teléfono que se muestra</Label>
          <Input
            id="publicPhone"
            type="tel"
            value={form.publicPhone}
            onChange={(e) => setForm({ ...form, publicPhone: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Con este armamos el botón de WhatsApp de tu página.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicEmail">Email que se muestra</Label>
          <Input
            id="publicEmail"
            type="email"
            value={form.publicEmail}
            onChange={(e) => setForm({ ...form, publicEmail: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            No es el de tu cuenta: es el de atención al público.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={guardando}
          onClick={() => guardar(form, 'Datos de contacto guardados')}
        >
          Guardar datos
        </Button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={settings.publicPageEnabled}
            disabled={guardando || !publicable}
            onChange={(e) =>
              guardar(
                { publicPageEnabled: e.target.checked },
                e.target.checked ? 'Tu página está publicada' : 'Tu página dejó de mostrarse'
              )
            }
          />
          <span className={publicable ? undefined : 'text-muted-foreground'}>
            Publicar mi página
          </span>
        </label>

        {settings.publicPageEnabled && settings.handle && (
          <a
            href={`https://${urlCompleta}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline dark:text-sky-400"
          >
            Verla <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {!publicable && (
        <p className="text-xs text-muted-foreground">
          Elegí un nombre de usuario para poder publicarla.
        </p>
      )}
    </section>
  )
}

function Disponibilidad({ estado }: { estado: Estado }) {
  if (estado.tipo === 'consultando') {
    return <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
  }
  if (estado.tipo === 'libre') return <Check className="size-4 shrink-0 text-emerald-600" />
  if (estado.tipo === 'ocupado') return <X className="size-4 shrink-0 text-destructive" />
  return <span className="size-4 shrink-0" />
}
