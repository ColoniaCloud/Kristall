'use client'

import { PORTAL_RATE_LIMITED } from '@/lib/client-portal/error-digest'

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Next reemplaza el mensaje del error del servidor por uno genérico y solo
  // deja pasar el `digest`. loadPortalData() marca con este valor el 429 del
  // CRM, que no es una caída sino saturación: el cartel de "problema de
  // conexión" era directamente falso y no decía qué hacer.
  const saturado = error.digest === PORTAL_RATE_LIMITED

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-lg font-medium">
        {saturado ? 'El sistema está muy demandado' : 'No pudimos cargar tus datos'}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {saturado
          ? 'Se están procesando muchos pedidos a la vez. Esperá unos segundos y volvé a intentar — tus datos están bien.'
          : 'Hubo un problema de conexión con el sistema de Kristall. Intentá de nuevo en unos minutos.'}
      </p>
      <button onClick={reset} className="mt-2 text-sm font-medium text-primary underline">
        Reintentar
      </button>
    </div>
  )
}
