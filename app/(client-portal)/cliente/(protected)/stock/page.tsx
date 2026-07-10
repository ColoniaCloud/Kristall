import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getStock } from '@/lib/client-portal/api'
import StockTable from '@/components/client-portal/StockTable'

export const metadata: Metadata = { title: 'Stock' }

export default async function StockPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const rolls = await getStock(session.contactId)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Stock de rollos</h1>
      <StockTable rolls={rolls} />
    </div>
  )
}
