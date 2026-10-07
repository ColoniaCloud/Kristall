'use client'

import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SendWarrantyEmailDialog from './SendWarrantyEmailDialog'
import NewInstallationDialog from './NewInstallationDialog'
import RollDetailsDialog from './RollDetailsDialog'
import type { CreatedInstallation } from '@/lib/client-portal/api'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'
import { limiteDeInstalaciones } from '@/lib/client-portal/product-category'
import { formatM2 } from '@/lib/obra'

/**
 * Las dos acciones de una fila de stock: ver la ficha del rollo y generar una
 * instalación.
 *
 * Generar dejó de ser un clic y pasó a abrir un formulario. Antes creaba la
 * instalación en blanco y el cliente final cargaba todo desde el celular; ahora
 * el instalador carga los datos con el auto adelante, que es cuando la patente
 * se lee bien.
 */
export default function CreateInstallationAction({ roll }: { roll: WorkshopStockRoll }) {
  const [rollStatus, setRollStatus] = useState(roll.status)
  const [count, setCount] = useState(roll.installations.length)
  const [created, setCreated] = useState<CreatedInstallation | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)

  // Infinity si el producto no tiene tope.
  const max = limiteDeInstalaciones(roll.product)
  // Arquitectura se controla por m²: sin m² cargados o sin material disponible
  // no se puede generar. El CRM lo vuelve a controlar; esto es para no ofrecer
  // un botón que va a rebotar.
  const esArquitectura = roll.product.category === 'ARCHITECTURAL'
  const sinM2 = esArquitectura && roll.totalM2 == null
  const sinMaterial = esArquitectura && roll.availableM2 != null && roll.availableM2 <= 0
  const disabled =
    rollStatus === 'EXHAUSTED' || rollStatus === 'VOIDED' || count >= max || sinM2 || sinMaterial
  const etiqueta = sinM2
    ? 'Sin m² cargados'
    : esArquitectura
      ? `Generar instalación (${formatM2(roll.availableM2 ?? 0)} libres)`
      : `Generar instalación (${max === Infinity ? count : `${count}/${max}`})`

  const handleCreated = (installation: CreatedInstallation) => {
    setCount((c) => c + 1)
    setRollStatus(installation.rollStatus)
    setCreated(installation)
    setFormOpen(false)
    setEmailOpen(true)
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" onClick={() => setDetailsOpen(true)}>
        <Eye className="size-3.5" />
        Ver rollo
      </Button>

      <Button
        data-tour="generar-instalacion"
        size="sm"
        onClick={() => setFormOpen(true)}
        disabled={disabled}
      >
        <Plus className="size-3.5" />
        {etiqueta}
      </Button>

      <RollDetailsDialog roll={roll} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <NewInstallationDialog
        disponibleM2={esArquitectura ? roll.availableM2 : null}
        roll={roll}
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreated={handleCreated}
      />

      {created && (
        <SendWarrantyEmailDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          installationCode={created.installationCode}
          activationToken={created.activationToken}
        />
      )}
    </div>
  )
}
