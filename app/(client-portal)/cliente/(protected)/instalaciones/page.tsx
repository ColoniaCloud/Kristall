import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getInstallations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import InstallationsTable from '@/components/client-portal/InstallationsTable'
import PageHeader from '@/components/client-portal/PageHeader'

export const metadata: Metadata = { title: 'Instalaciones' }

export default async function InstalacionesPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const installations = await loadPortalData(() => getInstallations(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Instalaciones"
        description="Las garantías que tus clientes ya activaron, con la fecha en que vence cada una."
      />
      <InstallationsTable installations={installations} />
    </div>
  )
}
