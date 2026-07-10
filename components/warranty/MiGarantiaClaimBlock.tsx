'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import AssistedClaimFallback from './AssistedClaimFallback'

interface Props {
  installationCode: string
  productName: string
}

export default function MiGarantiaClaimBlock({ installationCode, productName }: Props) {
  const [showFallback, setShowFallback] = useState(false)

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="mb-2 text-sm font-medium">¿Tenés un problema con tu garantía?</p>
      <p className="mb-4 text-sm text-muted-foreground">
        Para reclamar necesitás el link original que te dieron al activar (revisá tu email o el WhatsApp del
        taller).
      </p>
      {!showFallback ? (
        <Button variant="outline" size="sm" onClick={() => setShowFallback(true)}>
          No tengo el link, ayudenme
        </Button>
      ) : (
        <AssistedClaimFallback installationCode={installationCode} productName={productName} />
      )}
    </div>
  )
}
