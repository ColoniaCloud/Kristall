'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function TokenPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Un error con `digest` nació en el servidor y ya lo reportó onRequestError
  // (instrumentation.ts); acá llega sin mensaje. Reportarlo de nuevo solo
  // duplica el evento.
  useEffect(() => {
    if (!error.digest) Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-lg font-medium">No pudimos cargar tu garantía</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Hubo un problema de conexión. Intentá de nuevo en unos minutos.
      </p>
      <button onClick={reset} className="mt-2 text-sm font-medium text-primary underline">
        Reintentar
      </button>
    </div>
  )
}
