'use client'

import { useRef, useState } from 'react'
import { Camera, Loader2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ProductCategory } from '@/lib/client-portal/product-category'
import {
  achicarFoto,
  CLAIM_ISSUE_LABELS,
  issueTypesPara,
  MAX_FOTOS_RECLAMO,
  type ClaimIssueType,
  type FotoReclamo,
} from '@/lib/reclamos'

export interface ValoresReclamo {
  issueType: ClaimIssueType | ''
  affectedPanes: string
  fotos: FotoReclamo[]
}

export const RECLAMO_EN_BLANCO: ValoresReclamo = { issueType: '', affectedPanes: '', fotos: [] }

/**
 * Qué pasó, cuántos paños y fotos: lo que tienen en común los tres formularios
 * de reclamo (link de garantía, sesión con código y portal del taller).
 *
 * El tipo de problema se elige con botones y es obligatorio en pantalla —lo
 * valida quien usa esto—. Con eso el Centro de Garantías puede filtrar, y la
 * rotura del vidrio llega marcada para evaluarla con los datos de la obra.
 *
 * Las fotos se achican en el navegador antes de mandarlas. Son las que más
 * visitas ahorran: una burbuja o una rajadura se ven en una foto.
 */
export default function CamposReclamo({
  categoria,
  valores,
  cambiar,
  error,
}: {
  categoria: ProductCategory | null | undefined
  valores: ValoresReclamo
  cambiar: (v: ValoresReclamo) => void
  /** Error del tipo de problema, si el formulario se intentó mandar sin elegirlo. */
  error?: string
}) {
  const inputFile = useRef<HTMLInputElement>(null)
  const [procesando, setProcesando] = useState(false)
  const [errorFoto, setErrorFoto] = useState('')
  const esArquitectura = categoria === 'ARCHITECTURAL'
  const lleno = valores.fotos.length >= MAX_FOTOS_RECLAMO

  async function agregarFotos(files: FileList | null) {
    if (!files?.length) return
    setErrorFoto('')
    setProcesando(true)
    try {
      const lugar = MAX_FOTOS_RECLAMO - valores.fotos.length
      const nuevas = await Promise.all(Array.from(files).slice(0, lugar).map(achicarFoto))
      cambiar({ ...valores, fotos: [...valores.fotos, ...nuevas] })
    } catch {
      setErrorFoto('No pudimos leer esa imagen. Probá con otra.')
    } finally {
      setProcesando(false)
      if (inputFile.current) inputFile.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>¿Qué pasó?</Label>
        <div className="flex flex-wrap gap-2">
          {issueTypesPara(categoria).map((t) => {
            const activo = valores.issueType === t
            return (
              <button
                key={t}
                type="button"
                aria-pressed={activo}
                onClick={() => cambiar({ ...valores, issueType: t })}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  activo ? 'border-primary bg-primary/10' : 'border-border hover:bg-muted/50'
                }`}
              >
                {CLAIM_ISSUE_LABELS[t]}
              </button>
            )
          })}
        </div>
        {/* Sin prometer cobertura: se sacó a pedido el 2026-10-07, igual que la
            línea del certificado. Se evalúa caso por caso desde el CRM. */}
        {valores.issueType === 'ROTURA_VIDRIO' && (
          <p className="text-xs text-muted-foreground">
            Si podés, mandá una foto de la rajadura entera.
          </p>
        )}
        {error && <span className="text-sm text-destructive">{error}</span>}
      </div>

      {esArquitectura && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="affectedPanes">¿Cuántos paños tienen el problema? (opcional)</Label>
          <Input
            id="affectedPanes"
            inputMode="numeric"
            placeholder="1"
            className="w-24"
            value={valores.affectedPanes}
            onChange={(e) => cambiar({ ...valores, affectedPanes: e.target.value.replace(/\D/g, '') })}
          />
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label>Fotos (opcional, hasta {MAX_FOTOS_RECLAMO})</Label>
        <div className="flex flex-wrap gap-2">
          {valores.fotos.map((f, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura local, un data URI */}
              <img src={f.preview} alt={`Foto ${i + 1}`} className="size-20 rounded-md border object-cover" />
              <button
                type="button"
                aria-label={`Quitar foto ${i + 1}`}
                onClick={() => cambiar({ ...valores, fotos: valores.fotos.filter((_, j) => j !== i) })}
                className="absolute -top-2 -right-2 rounded-full border bg-background p-0.5"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {!lleno && (
            <button
              type="button"
              onClick={() => inputFile.current?.click()}
              disabled={procesando}
              className="flex size-20 flex-col items-center justify-center gap-1 rounded-md border border-dashed text-xs text-muted-foreground hover:bg-muted/50"
            >
              {procesando ? <Loader2 className="size-5 animate-spin" /> : <Camera className="size-5" />}
              Agregar
            </button>
          )}
        </div>
        <input
          ref={inputFile}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => agregarFotos(e.target.files)}
        />
        {errorFoto && <span className="text-sm text-destructive">{errorFoto}</span>}
      </div>
    </div>
  )
}
