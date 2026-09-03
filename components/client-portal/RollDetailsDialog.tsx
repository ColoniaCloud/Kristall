'use client'

import StatusBadge from '@/components/common/StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { formatGarantia, formatFecha } from '@/lib/client-portal/taller-format'
import { vehicleLabel } from '@/lib/vehicle-types'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'

/**
 * Toda la ficha del rollo, en un popup.
 *
 * Es donde fue a parar lo que se sacó de la tabla de stock. La tabla se usa
 * para decidir de qué rollo cortar; esto se abre cuando hay una duda concreta
 * —cuánto queda, de qué lote salió, a qué autos se le puso— y esas dudas
 * aparecen de a una, no en cada fila.
 */
export default function RollDetailsDialog({
  roll,
  open,
  onOpenChange,
}: {
  roll: WorkshopStockRoll
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="crm-theme max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-mono text-base">{roll.fullRollCode}</DialogTitle>
          <DialogDescription>
            {roll.product.name}
            {roll.product.sku && ` · ${roll.product.sku}`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <section className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
            <Dato etiqueta="Estado">
              <StatusBadge status={roll.status} />
            </Dato>
            <Dato etiqueta="Lote">{roll.lot.lotNumber}</Dato>
            <Dato etiqueta="Categoría">{roll.product.category}</Dato>
            <Dato etiqueta="Garantía">{formatGarantia(roll.product.warrantyConfig)}</Dato>
            <Dato etiqueta="Instalaciones activas">
              {roll._count.installations} de {roll.product.warrantyConfig?.maxInstallations ?? 15}
            </Dato>
            <Dato etiqueta="Medidas">
              {roll.product.width && roll.product.length
                ? `${roll.product.width} × ${roll.product.length} m`
                : 'Sin cargar'}
            </Dato>
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Lámina</h3>
            {roll.totalM2 === null ? (
              // null no es 0: no sabemos cuánto queda porque el producto no
              // tiene medidas. Decir "0 m²" sería afirmar que está vacío.
              <p className="text-sm text-muted-foreground">
                El producto no tiene medidas cargadas, así que no podemos calcular los metros.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Metro etiqueta="Total" valor={roll.totalM2} />
                <Metro etiqueta="Cortado" valor={roll.usedM2} />
                <Metro etiqueta="Comprometido" valor={roll.reservedM2} />
                <Metro etiqueta="Disponible" valor={roll.availableM2} destacado />
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold">Instalaciones ({roll.installations.length})</h3>
            {roll.installations.length === 0 ? (
              <p className="text-sm text-muted-foreground">Todavía no generaste ninguna.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border rounded-md border border-border">
                {roll.installations.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2 text-sm">
                    <span className="font-mono">{i.installationCode}</span>
                    <StatusBadge status={i.status} />
                    {vehicleLabel(i.vehicleType) && (
                      <span className="text-muted-foreground">{vehicleLabel(i.vehicleType)}</span>
                    )}
                    {i.plate && <span className="font-medium">{i.plate}</span>}
                    <span className="ml-auto text-xs text-muted-foreground">
                      {i.activatedAt ? `Activada ${formatFecha(i.activatedAt)}` : 'Sin activar'}
                      {i.expiresAt && ` · vence ${formatFecha(i.expiresAt)}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Dato({ etiqueta, children }: { etiqueta: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{etiqueta}</span>
      <span className="text-sm">{children}</span>
    </div>
  )
}

function Metro({
  etiqueta,
  valor,
  destacado,
}: {
  etiqueta: string
  valor: number | null
  destacado?: boolean
}) {
  return (
    <div className={`rounded-md border p-2 ${destacado ? 'border-sky-500/40 bg-sky-500/5' : 'border-border'}`}>
      <span className="block text-xs text-muted-foreground">{etiqueta}</span>
      <span className="block text-lg font-semibold tabular-nums">
        {valor === null ? '—' : `${valor} m²`}
      </span>
    </div>
  )
}
