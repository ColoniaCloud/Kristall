import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyResetToken } from '@/lib/client-portal/api'
import ResetForm from '@/components/client-portal/ResetForm'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Contraseña nueva' }

export default async function NuevaClavePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let email = ''
  let error = ''
  try {
    const info = await verifyResetToken(token)
    email = info.email
  } catch (err) {
    error = err instanceof Error && err.message ? err.message : 'El link no es válido o ya venció.'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
          {email ? (
            <>
              <h1 className="font-heading mb-1 text-xl font-semibold">Elegí tu contraseña nueva</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Para la cuenta <span className="text-foreground">{email}</span>.
              </p>
              <ResetForm token={token} />
            </>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-heading text-xl font-semibold">Este link no sirve</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground">
                Los links de recuperación valen 1 hora y se usan una sola vez.
              </p>
              <Link href="/cliente/recuperar" className="text-sm underline hover:text-foreground">
                Pedir uno nuevo
              </Link>
            </div>
          )}
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
