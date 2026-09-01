import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getStock } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import StockTable from '@/components/client-portal/StockTable'

export const metadata: Metadata = { title: 'Stock' }

export default async function StockPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  // Sección de instalador: el menú no la muestra a un cliente básico, pero si
  // llega por URL escrita a mano, lo devolvemos en vez de dejar que reviente
  // con el 403 del CRM.
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  const rolls = await loadPortalData(() => getStock(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl font-semibold">Stock de rollos</h1>
      <StockTable rolls={rolls} />
    </div>
  )
}
