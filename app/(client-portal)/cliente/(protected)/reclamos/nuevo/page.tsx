import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getInstallations } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import ClaimForm from '@/components/client-portal/ClaimForm'

export const metadata: Metadata = { title: 'Nuevo reclamo' }

export default async function NuevoReclamoPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const installations = await loadPortalData(() => getInstallations(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Nuevo reclamo</h1>
      <ClaimForm installations={installations} />
    </div>
  )
}
