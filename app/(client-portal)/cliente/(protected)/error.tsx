'use client'

export default function ProtectedError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <p className="text-lg font-medium">No pudimos cargar tus datos</p>
      <p className="max-w-sm text-sm text-muted-foreground">
        Hubo un problema de conexión con el sistema de Kristall. Intentá de nuevo en unos minutos.
      </p>
      <button onClick={reset} className="mt-2 text-sm font-medium text-primary underline">
        Reintentar
      </button>
    </div>
  )
}
