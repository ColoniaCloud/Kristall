import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getWarrantySession } from '@/lib/warranty/session'
import StatusCard from '@/components/warranty/StatusCard'
import MiGarantiaClaimBlock from '@/components/warranty/MiGarantiaClaimBlock'
import WarrantyLogoutButton from '@/components/warranty/WarrantyLogoutButton'

export const metadata: Metadata = { title: 'Mi garantía' }

export default async function MiGarantiaPage() {
  const session = await getWarrantySession()
  if (!session) redirect('/garantia/acceder')

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <h1 className="text-center font-heading text-2xl font-semibold">Mi garantía</h1>
      <StatusCard status={session} />
      {session.isActive && (
        <MiGarantiaClaimBlock installationCode={session.installationCode} productName={session.product.name} />
      )}
      <WarrantyLogoutButton />
    </div>
  )
}
