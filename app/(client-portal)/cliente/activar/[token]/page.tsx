import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyActivationToken } from '@/lib/client-portal/api'
import ActivateForm from '@/components/client-portal/ActivateForm'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Crear mi contraseña' }

/** El link del mail. Se valida en el servidor antes de mostrar el formulario. */
export default async function ActivarTokenPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  let info: Awaited<ReturnType<typeof verifyActivationToken>> | null = null
  let error = ''
  try {
    info = await verifyActivationToken(token)
  } catch (err) {
    error =
      err instanceof Error && err.message
        ? err.message
        : 'El link no es válido o ya venció.'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
          {info ? (
            <>
              <h1 className="font-heading mb-1 text-xl font-semibold">
                Hola{info.name ? `, ${info.name.split(' ')[0]}` : ''}
              </h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Elegí una contraseña para entrar al Panel de Clientes con{' '}
                <span className="text-foreground">{info.email}</span>.
              </p>
              <ActivateForm token={token} whatsappActual={info.whatsapp} />
            </>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-heading text-xl font-semibold">Este link no sirve</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground">
                Los links valen 24 horas y se usan una sola vez. Pedí uno nuevo.
              </p>
              <Link
                href="/cliente/activar"
                className="text-sm underline hover:text-foreground"
              >
                Pedir un link nuevo
              </Link>
            </div>
          )}
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
