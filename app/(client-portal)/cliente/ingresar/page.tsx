import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import LoginForm from '@/components/client-portal/LoginForm'

export const metadata: Metadata = { title: 'Ingresar' }

export default async function IngresarPage() {
  const session = await getClientSession()
  if (session) redirect('/cliente/dashboard')

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
        <h1 className="font-heading mb-1 text-xl font-semibold">Panel de Cliente</h1>
        <p className="mb-6 text-sm text-muted-foreground">Ingresá con las credenciales que te dio Kristall.</p>
        <LoginForm />
      </div>
    </div>
  )
}
