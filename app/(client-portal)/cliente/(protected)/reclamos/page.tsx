import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getClaims } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import ClaimsTable from '@/components/client-portal/ClaimsTable'
import PageHeader from '@/components/client-portal/PageHeader'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Reclamos' }

export default async function ReclamosPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const claims = await loadPortalData(() => getClaims(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reclamos"
        description="Los problemas que reportaste sobre una garantía, y en qué anda cada uno."
        action={
          <Button asChild size="sm">
            <Link href="/cliente/reclamos/nuevo">
              <Plus className="size-4" />
              Nuevo reclamo
            </Link>
          </Button>
        }
      />
      <ClaimsTable claims={claims} />
    </div>
  )
}
