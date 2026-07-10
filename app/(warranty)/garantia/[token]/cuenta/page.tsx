import type { Metadata } from 'next'
import SetPasswordForm from '@/components/warranty/SetPasswordForm'

export const metadata: Metadata = { title: 'Guardar acceso simple' }

export default async function CuentaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-4 px-4 py-16">
      <h1 className="font-heading text-2xl font-semibold">Guardar acceso simple</h1>
      <p className="text-sm text-muted-foreground">
        Elegí una contraseña para poder consultar tu garantía después con tu código, sin guardar este link.
      </p>
      <SetPasswordForm token={token} />
    </div>
  )
}
