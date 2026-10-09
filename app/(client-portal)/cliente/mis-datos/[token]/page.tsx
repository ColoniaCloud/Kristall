import type { Metadata } from 'next'
import { verifyDataUpdateToken } from '@/lib/client-portal/api'
import DataUpdateForm from '@/components/client-portal/DataUpdateForm'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Mis datos' }

/**
 * El link que el CRM manda por WhatsApp a un Cliente sin email. Se valida en el
 * servidor antes de mostrar el formulario. No abre sesión.
 */
export default async function MisDatosPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  let info: Awaited<ReturnType<typeof verifyDataUpdateToken>> | null = null
  let error = ''
  try {
    info = await verifyDataUpdateToken(token)
  } catch (err) {
    error = err instanceof Error && err.message ? err.message : 'El link no es válido o ya venció.'
  }

  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      <main className="relative z-10 flex flex-1 items-center justify-center bg-muted px-4 py-12">
        <div className="w-full max-w-lg rounded-xl border border-border bg-card p-8 shadow-sm">
          {info ? (
            <>
              <h1 className="font-heading mb-1 text-xl font-semibold">Hola, {info.firstName.split(' ')[0]}</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Dejanos tu email y revisá que tus datos estén bien. Es un minuto.
              </p>
              <DataUpdateForm token={token} info={info} />
            </>
          ) : (
            <div className="flex flex-col gap-4 text-center">
              <h1 className="font-heading text-xl font-semibold">Este link no sirve</h1>
              <p className="text-sm text-muted-foreground">{error}</p>
              <p className="text-sm text-muted-foreground">
                Si necesitás uno nuevo, respondé el WhatsApp donde te llegó y te lo mandamos.
              </p>
            </div>
          )}
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
