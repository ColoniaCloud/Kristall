'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  BUILDING_USE_LABELS,
  BUILDING_USES,
  FILM_SIDE_LABELS,
  FILM_SIDES,
  GLASS_TYPE_LABELS,
  GLASS_TYPES,
} from '@/lib/obra'

/**
 * Los datos de una obra, tal como los carga el instalador: dirección,
 * superficie, vidrio, lado y uso. Los usan el alta de instalación desde Stock
 * y el alta de una superficie en Mi Taller, que terminan en la misma garantía.
 *
 * Controlado y en strings: cada pantalla guarda el estado a su manera
 * (react-hook-form una, useState la otra) y convierte al mandar — ver
 * `obraParaEnviar`.
 *
 * En arquitectura el instalador es el único que sabe sobre qué vidrio puso la
 * lámina y de qué lado: el dueño de la casa casi nunca. Por eso esto se pide
 * acá y no en la activación.
 */
export interface ValoresObra {
  siteAddress: string
  areaM2: string
  paneCount: string
  glassType: string
  filmSide: string
  buildingUse: string
}

export const OBRA_EN_BLANCO: ValoresObra = {
  siteAddress: '',
  areaM2: '',
  paneCount: '',
  glassType: '',
  filmSide: '',
  buildingUse: '',
}

/** «12,5» o «12.5» → 12.5. Vacío o basura → undefined (no se manda). */
function numero(v: string): number | undefined {
  const n = Number(v.replace(',', '.'))
  return v.trim() && Number.isFinite(n) && n > 0 ? n : undefined
}

/**
 * Lo que viaja al CRM. Los vacíos no se mandan: un string vacío guardado es
 * peor que un campo nulo, porque después no cae en ningún fallback.
 */
export function obraParaEnviar(v: ValoresObra) {
  const panos = numero(v.paneCount)
  return {
    siteAddress: v.siteAddress.trim() || undefined,
    areaM2: numero(v.areaM2),
    paneCount: panos ? Math.round(panos) : undefined,
    glassType: v.glassType || undefined,
    filmSide: v.filmSide || undefined,
    buildingUse: v.buildingUse || undefined,
  }
}

export default function CamposObra({
  valores,
  cambiar,
}: {
  valores: ValoresObra
  cambiar: (campo: keyof ValoresObra, valor: string) => void
}) {
  const texto = (campo: keyof ValoresObra) => ({
    value: valores[campo],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => cambiar(campo, e.target.value),
  })

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="siteAddress">Dirección de la obra</Label>
        <Input id="siteAddress" maxLength={191} placeholder="Av. Córdoba 1850, piso 4, CABA" {...texto('siteAddress')} />
        <p className="text-xs text-muted-foreground">
          Es lo que en un auto es la patente: con esto se encuentra la garantía cuando llaman. En el
          link público de la garantía se muestra sin altura ni piso.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="areaM2">Superficie (m²)</Label>
          <Input id="areaM2" inputMode="decimal" placeholder="12,5" {...texto('areaM2')} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="paneCount">Paños</Label>
          <Input id="paneCount" inputMode="numeric" placeholder="6" {...texto('paneCount')} />
        </div>
      </div>

      <Opciones
        etiqueta="Tipo de vidrio"
        ayuda="Es lo primero que se mira si un vidrio se rompe: no todas las láminas van sobre cualquier vidrio."
        opciones={GLASS_TYPES.map((v) => [v, GLASS_TYPE_LABELS[v]])}
        valor={valores.glassType}
        onChange={(v) => cambiar('glassType', v)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Opciones
          etiqueta="Lámina del lado"
          opciones={FILM_SIDES.map((v) => [v, FILM_SIDE_LABELS[v]])}
          valor={valores.filmSide}
          onChange={(v) => cambiar('filmSide', v)}
        />
        <Opciones
          etiqueta="Uso"
          opciones={BUILDING_USES.map((v) => [v, BUILDING_USE_LABELS[v]])}
          valor={valores.buildingUse}
          onChange={(v) => cambiar('buildingUse', v)}
        />
      </div>
    </div>
  )
}

/**
 * Un grupo de botones de los que se elige uno, con el mismo aspecto que los
 * del tipo de vehículo. Tocar el elegido lo desmarca: todo esto es opcional, y
 * sin eso no habría forma de volver atrás un toque de más.
 */
function Opciones({
  etiqueta,
  ayuda,
  opciones,
  valor,
  onChange,
}: {
  etiqueta: string
  ayuda?: string
  opciones: [string, string][]
  valor: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{etiqueta}</Label>
      <div className="flex flex-wrap gap-2">
        {opciones.map(([v, texto]) => {
          const activo = valor === v
          return (
            <button
              key={v}
              type="button"
              aria-pressed={activo}
              onClick={() => onChange(activo ? '' : v)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                activo ? 'border-primary bg-primary/10' : 'border-border hover:border-sky-500/50 hover:bg-muted/50'
              }`}
            >
              {texto}
            </button>
          )
        })}
      </div>
      {ayuda && <p className="text-xs text-muted-foreground">{ayuda}</p>}
    </div>
  )
}
