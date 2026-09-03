'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import StatusCard from './StatusCard'
import ActivationForm from './ActivationForm'
import SetPasswordForm from './SetPasswordForm'
import WarrantyHeader from './WarrantyHeader'
import InstallationSummary from './InstallationSummary'
import type { WarrantyStatus } from '@/lib/warranty/api'

export default function WarrantyTokenView({
  token,
  initialStatus,
  logoUrl,
}: {
  token: string
  initialStatus: WarrantyStatus
  /** Logo del taller, ya resuelto contra el CRM. */
  logoUrl: string | null
}) {
  const [status, setStatus] = useState(initialStatus)
  const [justActivated, setJustActivated] = useState(false)
  const [offerPassword, setOfferPassword] = useState(true)

  const handleActivated = (expiresAt: string) => {
    setStatus((prev) => ({ ...prev, status: 'ACTIVE', isActive: true, expiresAt }))
    setJustActivated(true)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <WarrantyHeader installer={status.installer} logoUrl={logoUrl} />

      <h1 className="text-center font-heading text-2xl font-semibold">Garantía</h1>

      {status.status === 'PENDING' && !justActivated && (
        <>
          {/* Entre los logos y el formulario: primero lo que ya sabemos del
              trabajo, después lo que falta preguntar. */}
          <InstallationSummary status={status} />

          <div className="rounded-xl border border-border bg-card p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Completá estos datos para activar la garantía de tu {status.product.name}.
            </p>
            <ActivationForm
              token={token}
              onActivated={handleActivated}
              precargado={{
                installerName: status.installer?.name ?? null,
                clientEmail: status.clientEmail,
                assetTypeFijo: Boolean(status.vehicleType),
              }}
            />
          </div>
        </>
      )}

      {justActivated && (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="font-medium text-emerald-800">¡Garantía activada!</p>
            <p className="mt-1 text-sm text-emerald-700">
              Vence el {status.expiresAt ? new Date(status.expiresAt).toLocaleDateString('es-AR') : ''}. Guardá
              este link — lo vas a necesitar para reclamar si hay algún problema.
            </p>
          </div>
          {offerPassword && (
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-1 text-sm font-medium">¿Querés guardar acceso simple?</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Elegí una contraseña para poder consultar tu garantía después con tu código{' '}
                <span className="font-medium text-foreground">{status.installationCode}</span>, sin guardar
                este link.
              </p>
              <SetPasswordForm token={token} onSkip={() => setOfferPassword(false)} />
            </div>
          )}
        </div>
      )}

      {status.status !== 'PENDING' && !justActivated && (
        <div className="flex flex-col gap-4">
          <StatusCard status={status} />
          {status.isActive && (
            <Button asChild variant="outline">
              <Link href={`/garantia/${token}/reclamo`}>Reportar un problema</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
