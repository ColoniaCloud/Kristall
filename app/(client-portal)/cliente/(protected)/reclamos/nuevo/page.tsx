import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getInstallations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import ClaimForm from '@/components/client-portal/ClaimForm'
import PageHeader from '@/components/client-portal/PageHeader'

export const metadata: Metadata = { title: 'Nuevo reclamo' }

export default async function NuevoReclamoPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const installations = await loadPortalData(() => getInstallations(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Nuevo reclamo"
        description="Contá qué pasó con una garantía que activaste. Lo revisamos y te respondemos."
      />
      <ClaimForm installations={installations} />
    </div>
  )
}
