import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getClaims } from '@/lib/client-portal/api'
import ClaimsTable from '@/components/client-portal/ClaimsTable'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Reclamos' }

export default async function ReclamosPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const claims = await getClaims(session.contactId)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-semibold">Reclamos</h1>
        <Button asChild size="sm">
          <Link href="/cliente/reclamos/nuevo">
            <Plus className="size-4" />
            Nuevo reclamo
          </Link>
        </Button>
      </div>
      <ClaimsTable claims={claims} />
    </div>
  )
}
