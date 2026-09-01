'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import SendWarrantyEmailDialog from './SendWarrantyEmailDialog'
import type { StockRoll, CreatedInstallation } from '@/lib/client-portal/api'

const DEFAULT_MAX_INSTALLATIONS = 15

export default function CreateInstallationAction({ roll }: { roll: StockRoll }) {
  const [rollStatus, setRollStatus] = useState(roll.status)
  const [count, setCount] = useState(roll.installations.length)
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState<CreatedInstallation | null>(null)
  const [emailOpen, setEmailOpen] = useState(false)

  const max = roll.product.warrantyConfig?.maxInstallations ?? DEFAULT_MAX_INSTALLATIONS
  const disabled = loading || rollStatus === 'EXHAUSTED' || rollStatus === 'VOIDED' || count >= max

  const handleCreate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/portal/rolls/${roll.fullRollCode}/installations`, { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos generar la instalación')
        return
      }
      const installation = body as CreatedInstallation
      setCount((c) => c + 1)
      setRollStatus(installation.rollStatus)
      setCreated(installation)
      setEmailOpen(true)
    } catch {
      toast.error('Error de conexión. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleCreate} disabled={disabled}>
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Plus className="size-3.5" />}
        Generar instalación ({count}/{max})
      </Button>
      {created && (
        <SendWarrantyEmailDialog
          open={emailOpen}
          onOpenChange={setEmailOpen}
          installationCode={created.installationCode}
          activationToken={created.activationToken}
        />
      )}
    </>
  )
}
