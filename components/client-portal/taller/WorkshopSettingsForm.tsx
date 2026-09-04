'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { WorkshopSettings } from '@/lib/client-portal/workshop'

/**
 * Configuración del taller.
 *
 * El logo es lo que justifica esta pantalla: aparece **al lado del de Kristall**
 * en la página donde el cliente final activa su garantía, y en el mail que
 * recibe después. Sin logo va el nombre del taller, así que nunca queda un
 * hueco — pero con logo se ve como lo que es: un trabajo respaldado por los dos.
 *
 * La imagen se achica en el navegador antes de subirla. Un logo exportado de
 * Canva puede pesar 2 MB, y ese peso después viaja en cada mail: los clientes
 * de correo recortan los mensajes largos, así que un logo pesado se lleva
 * puesto el resto del mensaje.
 */

const MAX_LADO = 400
const TIPOS = ['image/png', 'image/jpeg', 'image/webp']

/** Redimensiona y recomprime en el navegador. Devuelve un data URI. */
async function achicar(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, MAX_LADO / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * escala)
  const h = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, w, h)

  // PNG y no JPG: un logo suele tener fondo transparente, y pasarlo a JPG le
  // pondría un fondo negro justo arriba del mail.
  return canvas.toDataURL('image/png')
}

export default function WorkshopSettingsForm({
  settings,
  logoSrc,
}: {
  settings: WorkshopSettings
  /** Ruta ya resuelta hacia el logo actual, si hay. */
  logoSrc: string | null
}) {
  const router = useRouter()
  const inputFile = useRef<HTMLInputElement>(null)
  const [guardando, setGuardando] = useState(false)
  const [subiendo, setSubiendo] = useState(false)
  const [preview, setPreview] = useState<string | null>(logoSrc)
  // `null` = todavía no eligió. Se distingue de CLARO a propósito: la pregunta
  // es obligatoria, y un valor por defecto la respondería sola.
  const [fondo, setFondo] = useState<'CLARO' | 'OSCURO' | null>(
    settings.tieneLogo ? settings.logoBackground : null
  )
  const [form, setForm] = useState({
    workshopName: settings.workshopName ?? '',
    openingTime: settings.openingTime ?? '09:00',
    closingTime: settings.closingTime ?? '18:00',
    autoSendWarrantyEmail: settings.autoSendWarrantyEmail,
  })

  async function guardar(patch: Record<string, unknown>, mensaje: string) {
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
  }

  async function elegirLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!TIPOS.includes(file.type)) {
      toast.error('Tiene que ser PNG, JPG o WEBP')
      return
    }
    if (!fondo) {
      toast.error('Antes decinos sobre qué fondo se ve mejor tu logo.')
      return
    }
    setSubiendo(true)
    try {
      const dataUri = await achicar(file)
      // El fondo viaja junto con el logo: son una sola decisión, y guardarlos
      // por separado deja una ventana en la que el logo está publicado sobre un
      // fondo que nadie eligió.
      const ok = await guardar({ logo: dataUri, logoBackground: fondo }, 'Logo actualizado')
      if (ok) setPreview(dataUri)
    } catch {
      toast.error('No pudimos procesar esa imagen. Probá con otra.')
    } finally {
      setSubiendo(false)
    }
  }

  async function quitarLogo() {
    const ok = await guardar({ logo: null }, 'Logo quitado')
    if (ok) setPreview(null)
  }

  async function guardarDatos(e: React.FormEvent) {
    e.preventDefault()
    setGuardando(true)
    try {
      await guardar(form, 'Configuración guardada')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
        <div>
          <h2 className="font-heading text-lg font-semibold">Logo del taller</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aparece junto al de Kristall en la garantía que ve tu cliente y en el mail que recibe.
            Si no cargás ninguno, va el nombre de tu taller.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-24 w-44 items-center justify-center rounded-md border border-dashed border-border bg-muted/30 p-2">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="Logo del taller" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-xs text-muted-foreground">Sin logo</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={inputFile}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={elegirLogo}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={subiendo}
              onClick={() => inputFile.current?.click()}
            >
              {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              {preview ? 'Cambiar logo' : 'Subir logo'}
            </Button>
            {preview && (
              <Button type="button" variant="ghost" size="sm" onClick={quitarLogo}>
                <Trash2 className="size-4" />
                Quitar
              </Button>
            )}
            <p className="max-w-[22rem] text-xs text-muted-foreground">
              PNG, JPG o WEBP. Se achica solo — no hace falta que lo prepares.
            </p>
          </div>
        </div>

        {/* La pregunta va acá, pegada al logo, y no en otra sección: es parte de
            subirlo. Un logo de trazo oscuro sobre fondo negro desaparece, y uno
            blanco sobre fondo blanco también — no hay forma confiable de
            deducirlo mirando los píxeles, así que se pregunta. */}
        <fieldset className="flex flex-col gap-2 border-t border-border pt-4">
          <legend className="sr-only">Fondo del logo</legend>
          <p className="text-sm font-medium">
            ¿Tu logo queda mejor sobre fondo claro u oscuro?
            {!fondo && <span className="ml-1 text-destructive">*</span>}
          </p>
          <p className="text-xs text-muted-foreground">
            Define el color de la cabecera de tu página. El resto es claro siempre.
          </p>
          <div className="mt-1 flex flex-wrap gap-2">
            {(
              [
                { v: 'CLARO' as const, t: 'Claro', muestra: 'bg-white text-neutral-900 border-border' },
                { v: 'OSCURO' as const, t: 'Oscuro', muestra: 'bg-neutral-900 text-white border-neutral-700' },
              ]
            ).map((o) => (
              <button
                key={o.v}
                type="button"
                aria-pressed={fondo === o.v}
                onClick={() => {
                  setFondo(o.v)
                  // Si ya hay logo, el cambio se guarda solo: es una decisión de
                  // un clic y mandarlo a buscar un botón «guardar» es fricción.
                  if (settings.tieneLogo) {
                    guardar({ logoBackground: o.v }, 'Listo, así se va a ver tu cabecera')
                  }
                }}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${o.muestra} ${
                  fondo === o.v ? 'ring-2 ring-sky-500 ring-offset-1 ring-offset-background' : ''
                }`}
              >
                <span className="font-medium">{o.t}</span>
              </button>
            ))}
          </div>
          {!fondo && (
            <p className="text-xs text-destructive">
              Elegí una opción para poder subir tu logo.
            </p>
          )}
        </fieldset>
      </section>

      <form
        onSubmit={guardarDatos}
        className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6"
      >
        <h2 className="font-heading text-lg font-semibold">Datos del taller</h2>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workshopName">Nombre del taller</Label>
          <Input
            id="workshopName"
            value={form.workshopName}
            onChange={(e) => setForm({ ...form, workshopName: e.target.value })}
            placeholder="Como querés que te vean tus clientes"
          />
          <p className="text-xs text-muted-foreground">
            Es el que firma las garantías. Si lo dejás vacío se usa tu razón social.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="openingTime">Abre</Label>
            <Input
              id="openingTime"
              type="time"
              value={form.openingTime}
              onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="closingTime">Cierra</Label>
            <Input
              id="closingTime"
              type="time"
              value={form.closingTime}
              onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
            />
          </div>
        </div>

        <label className="flex items-start gap-3 rounded-md border border-border p-3">
          <input
            type="checkbox"
            className="mt-1 size-4"
            checked={form.autoSendWarrantyEmail}
            onChange={(e) => setForm({ ...form, autoSendWarrantyEmail: e.target.checked })}
          />
          <span className="text-sm">
            <span className="font-medium">Mandar la garantía por mail al terminar una orden</span>
            <span className="mt-0.5 block text-muted-foreground">
              Si lo apagás, la garantía se genera igual y se la mandás vos cuando quieras.
            </span>
          </span>
        </label>

        <Button type="submit" disabled={guardando} className="self-start">
          {guardando && <Loader2 className="size-4 animate-spin" />}
          Guardar
        </Button>
      </form>
    </div>
  )
}
