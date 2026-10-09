'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * La confirmación es un clic y no se hace al abrir la página: los filtros de
 * correo abren los links solos para revisarlos, y eso confirmaría emails que
 * nadie miró.
 */
export default function ConfirmEmailButton({ token, email }: { token: string; email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'ok'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [portalActive, setPortalActive] = useState(true)

  const confirmar = async () => {
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/portal/mis-datos/confirmar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setErrorMsg(body.error ?? 'No pudimos confirmar el email.')
        setStatus('error')
        return
      }
      setPortalActive(Boolean(body.portalActive))
      setStatus('ok')
    } catch {
      setErrorMsg('Error de conexión. Intentá de nuevo.')
      setStatus('error')
    }
  }

  if (status === 'ok') {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <h2 className="font-heading text-lg font-semibold">¡Listo!</h2>
        <p className="text-sm text-muted-foreground">
          Confirmamos <span className="text-foreground">{email}</span>. A partir de ahora te llegan ahí tus
          comprobantes y garantías.
        </p>
        {!portalActive && (
          <p className="text-sm text-muted-foreground">
            ¿Querés ver tus compras online?{' '}
            <Link href="/cliente/activar" className="underline hover:text-foreground">
              Activá tu Panel de Clientes
            </Link>
            .
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}
      <Button onClick={confirmar} disabled={status === 'loading'}>
        {status === 'loading' ? <Loader2 className="size-4 animate-spin" /> : 'Confirmar mi email'}
      </Button>
    </div>
  )
}
