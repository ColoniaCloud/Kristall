'use client'

import { useState } from 'react'
import { Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SendWarrantyEmailDialog from './SendWarrantyEmailDialog'
import NewInstallationDialog from './NewInstallationDialog'
import RollDetailsDialog from './RollDetailsDialog'
import type { CreatedInstallation } from '@/lib/client-portal/api'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'

const DEFAULT_MAX_INSTALLATIONS = 15

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

  const max = roll.product.warrantyConfig?.maxInstallations ?? DEFAULT_MAX_INSTALLATIONS
  const disabled = rollStatus === 'EXHAUSTED' || rollStatus === 'VOIDED' || count >= max

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
        size="sm"
        onClick={() => setFormOpen(true)}
        disabled={disabled}
        className="bg-sky-500 text-white hover:bg-sky-600"
      >
        <Plus className="size-3.5" />
        Generar instalación ({count}/{max})
      </Button>

      <RollDetailsDialog roll={roll} open={detailsOpen} onOpenChange={setDetailsOpen} />

      <NewInstallationDialog
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
