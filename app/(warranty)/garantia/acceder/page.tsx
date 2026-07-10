import type { Metadata } from 'next'
import RecoverLoginForm from '@/components/warranty/RecoverLoginForm'

export const metadata: Metadata = { title: 'Acceder a mi garantía' }

export default function AccederPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading mb-1 text-xl font-semibold">Consultar mi garantía</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Ingresá con el código y la contraseña que configuraste al activar.
        </p>
        <RecoverLoginForm />
      </div>
    </div>
  )
}
