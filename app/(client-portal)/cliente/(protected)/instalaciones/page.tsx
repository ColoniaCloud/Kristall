import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getInstallations } from '@/lib/client-portal/api'
import InstallationsTable from '@/components/client-portal/InstallationsTable'

export const metadata: Metadata = { title: 'Instalaciones' }

export default async function InstalacionesPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const installations = await getInstallations(session.contactId)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Instalaciones</h1>
        <p className="text-sm text-muted-foreground">Garantías activadas por tus clientes.</p>
      </div>
      <InstallationsTable installations={installations} />
    </div>
  )
}
