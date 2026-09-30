import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getWorkshopStock } from '@/lib/client-portal/workshop'
import { getStock } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import StockTable from '@/components/client-portal/StockTable'
import PageHeader from '@/components/client-portal/PageHeader'
import Recorrido from '@/components/client-portal/Recorrido'

export const metadata: Metadata = { title: 'Stock' }

export default async function StockPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  // Stock lo ven los dos niveles que tienen rollos en la mano. El menú ya no se
  // lo muestra a un cliente básico, pero si llega por URL escrita a mano, lo
  // devolvemos en vez de dejar que reviente con el 403 del CRM.
  const level = levelOf(session)
  const esRevendedor = level === 'RESELLER'
  if (level !== 'INSTALLER' && !esRevendedor) redirect('/cliente/dashboard')

  // Dos endpoints para la misma pantalla, y la diferencia importa:
  //
  //   INSTALLER → `/workshop/stock`: el mismo listado más los m² que quedan en
  //     cada rollo, que es lo que un taller necesita saber.
  //   RESELLER  → `/stock`: sin m² —no corta láminas— y **con el link de
  //     garantía** de cada rollo, que es lo único que le puede entregar a quien
  //     se lo compre. `/workshop/*` exige nivel INSTALLER, así que pedirlo acá
  //     le daría un 403.
  // Se arma acá y no en el JSX para que cada rama conserve su tipo de rollo:
  // StockTable los distingue por props y no acepta el de uno en la acción del
  // otro. Ver el comentario de StockTableProps.
  const tabla = esRevendedor ? (
    <StockTable esRevendedor rolls={await loadPortalData(() => getStock(session.contactId))} />
  ) : (
    <StockTable rolls={await loadPortalData(() => getWorkshopStock(session.contactId))} />
  )

  return (
    <div className="flex flex-col gap-6">
      <Recorrido pantalla="stock" activo={Boolean(session.demo)} />
      <PageHeader
        title="Stock de rollos"
        description={
          esRevendedor
            ? 'Los rollos que tenés en tu poder. De cada uno podés copiar el link de garantía para pasárselo a quien se lo compre.'
            : 'Los rollos que tenés en tu poder. Desde acá generás la garantía de cada instalación que hacés.'
        }
      />
      {tabla}
    </div>
  )
}
