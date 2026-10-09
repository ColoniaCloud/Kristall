import type { Metadata } from 'next'
import { verifyEmailConfirmToken } from '@/lib/client-portal/api'
import ConfirmEmailButton from '@/components/client-portal/ConfirmEmailButton'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Confirmar email' }

/** El link del mail de confirmación. Muestra el email y pide un clic para confirmarlo. */
export default async function ConfirmarEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  let info: Awaited<ReturnType<typeof verifyEmailConfirmToken>> | null = null
  let error = ''
  try {
    info = await verifyEmailConfirmToken(token)
  } catch (err) {
    error = err instanceof Error && err.message ? err.message : 'El link no es válido o ya venció.'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
          {info ? (
            <>
              <h1 className="font-heading mb-1 text-xl font-semibold">Hola, {info.name.split(' ')[0]}</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Confirmá que <span className="text-foreground">{info.email}</span> es tu email.
              </p>
              <ConfirmEmailButton token={token} email={info.email} />
            </>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-heading text-xl font-semibold">Este link no sirve</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          )}
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
