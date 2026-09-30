import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getPrices } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import PageHeader from '@/components/client-portal/PageHeader'
import PreciosTable from '@/components/client-portal/PreciosTable'

export const metadata: Metadata = { title: 'Mis precios' }

/**
 * Mis precios: qué le sale cada producto a este revendedor.
 *
 * Es la consulta que hoy se hace por WhatsApp a las once de la noche, y la razón
 * por la que los descuentos pactados viven en la base y no en un Excel.
 *
 * Nivel `RESELLER`. Un instalador no la ve: su descuento es una etiqueta única y
 * ya lo conoce. El CRM además responde 403 — esconder el menú no es la barrera.
 */
export default async function PreciosPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  // Si llega por URL escrita a mano lo devolvemos, en vez de dejar que reviente
  // con el 403 del CRM.
  if (levelOf(session) !== 'RESELLER') redirect('/cliente/dashboard')

  const { items, conDescuento } = await loadPortalData(() => getPrices(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Mis precios"
        description={
          conDescuento > 0
            ? `Tus precios acordados. ${conDescuento} ${conDescuento === 1 ? 'producto tiene' : 'productos tienen'} descuento; el resto va a precio de lista.`
            : 'Todavía no tenés descuentos acordados: todos los productos van a precio de lista. Hablá con tu contacto en Kristall para acordarlos.'
        }
      />
      <PreciosTable items={items} />
      {/* El IVA se aclara siempre, no solo cuando hay descuento: es la primera
          pregunta que aparece cuando alguien compara un precio con una factura. */}
      <p className="text-sm text-muted-foreground">
        Todos los precios incluyen IVA. Los descuentos se aplican solos al registrarse la venta:
        no hace falta pedirlos.
      </p>
    </div>
  )
}
