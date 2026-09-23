'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import type { WorkshopPhoto } from '@/lib/client-portal/workshop'

/**
 * El álbum de fotos de la página pública: aparece al lado del botón de
 * reservar turno y como fondo de la sección de cierre.
 *
 * Reordenar es con botones "subir/bajar" y no drag-and-drop — no hay ninguna
 * librería de arrastre en el portal, y agregar una solo para esto no se
 * justifica.
 */

const MAX_FOTOS = 12
const TIPOS = ['image/png', 'image/jpeg', 'image/webp']
/** Más chico que el hero (1600px): estas son miniaturas de un slider, no el fondo a pantalla completa. */
const LADO_MAX = 1200

/** Redimensiona y recomprime en el navegador. Devuelve un data URI JPEG. */
async function achicarFoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, LADO_MAX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * escala)
  const h = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, w, h)

  return canvas.toDataURL('image/jpeg', 0.82)
}

export default function PhotoAlbumForm({ photos }: { photos: WorkshopPhoto[] }) {
  const router = useRouter()
  const inputFile = useRef<HTMLInputElement>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [actuandoSobre, setActuandoSobre] = useState<string | null>(null)

  async function elegirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!TIPOS.includes(file.type)) {
      toast.error('Tiene que ser PNG, JPG o WEBP')
      return
    }
    setSubiendo(true)
    try {
      const dataUri = await achicarFoto(file)
      const res = await fetch('/api/portal/workshop/photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUri }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos subir la foto')
        return
      }
      toast.success('Foto agregada')
      router.refresh()
    } catch {
      toast.error('No pudimos procesar esa imagen. Probá con otra.')
    } finally {
      setSubiendo(false)
    }
  }

  async function mover(photoId: string, direccion: 'arriba' | 'abajo') {
    setActuandoSobre(photoId)
    try {
      const res = await fetch(`/api/portal/workshop/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direccion }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(body.error ?? 'No pudimos reordenar el álbum')
        return
      }
      router.refresh()
    } finally {
      setActuandoSobre(null)
    }
  }

  /**
   * Guarda al salir del campo y solo si cambió: escribir una descripción son
   * treinta pulsaciones, y mandar treinta PATCH — uno por letra — sería
   * ruido sobre el CRM sin ningún beneficio para quien escribe.
   */
  async function describir(photoId: string, texto: string, anterior: string) {
    if (texto.trim() === (anterior ?? '').trim()) return
    try {
      const res = await fetch(`/api/portal/workshop/photos/${photoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: texto }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(body.error ?? 'No pudimos guardar la descripción')
        return
      }
      router.refresh()
    } catch {
      toast.error('No pudimos guardar la descripción')
    }
  }

  async function borrar(photoId: string) {
    setActuandoSobre(photoId)
    try {
      const res = await fetch(`/api/portal/workshop/photos/${photoId}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        toast.error(body.error ?? 'No pudimos borrar la foto')
        return
      }
      toast.success('Foto quitada')
      router.refresh()
    } finally {
      setActuandoSobre(null)
    }
  }

  const lleno = photos.length >= MAX_FOTOS

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 md:p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Álbum de fotos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Fotos de trabajos que hiciste. Se muestran en tu página pública, al lado del botón de
          reservar turno. Escribí qué se ve en cada una: es lo que lee Google para mostrarlas en
          las búsquedas, y lo único que escucha alguien que navega sin ver la pantalla.
        </p>
      </div>

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">Todavía no subiste ninguna foto.</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p, i) => (
            <div key={p.id} className="flex flex-col gap-1.5">
              <div className="overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.url}
                  alt={p.description ?? ''}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <input
                type="text"
                maxLength={160}
                defaultValue={p.description ?? ''}
                placeholder="¿Qué se ve?"
                aria-label={`Descripción de la foto ${i + 1}`}
                onBlur={(e) => describir(p.id, e.target.value, p.description ?? '')}
                className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <div className="flex items-center justify-between gap-1">
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={i === 0 || actuandoSobre !== null}
                    onClick={() => mover(p.id, 'arriba')}
                    aria-label="Subir"
                  >
                    <ArrowUp className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={i === photos.length - 1 || actuandoSobre !== null}
                    onClick={() => mover(p.id, 'abajo')}
                    aria-label="Bajar"
                  >
                    <ArrowDown className="size-3.5" />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  disabled={actuandoSobre !== null}
                  onClick={() => borrar(p.id)}
                  aria-label="Borrar"
                >
                  {actuandoSobre === p.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputFile}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={elegirFoto}
      />
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={subiendo || lleno}
          onClick={() => inputFile.current?.click()}
        >
          {subiendo ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Agregar foto
        </Button>
        <span className="text-xs text-muted-foreground">
          {photos.length} de {MAX_FOTOS}
        </span>
      </div>
      {lleno && (
        <p className="text-xs text-muted-foreground">
          Llegaste al máximo. Borrá alguna foto para poder subir otra.
        </p>
      )}
    </section>
  )
}
