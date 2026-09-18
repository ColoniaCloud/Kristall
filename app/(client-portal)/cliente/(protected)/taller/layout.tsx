import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { listBookings } from '@/lib/client-portal/workshop'
import TallerSubNav from '@/components/client-portal/taller/TallerSubNav'

/**
 * Guard de nivel para todo Mi Taller, más el sub-menú entre sus pantallas.
 *
 * El guard está en el layout y no repetido en cada página: el módulo son
 * siete pantallas, y un guard copiado siete veces es un guard que en algún
 * momento falta en la octava. Esconder el menú no alcanza — alguien puede
 * escribir la URL, y el CRM contestaría 403 con un cartel confuso.
 *
 * No es LA barrera de seguridad: el CRM revalida el nivel en cada endpoint.
 * Esto es para que un cliente BASIC vea su dashboard en vez de un error.
 */
export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  // Para el aviso en "Pedidos de turno" del sub-menú. Se calcula una vez acá
  // arriba porque el sub-menú se dibuja en las siete pantallas de Mi Taller,
  // no solo en la bandeja — antes esto solo vivía en la home del módulo.
  const pedidosPendientes = await loadPortalData(() => listBookings(session.contactId, true))

  return (
    <div className="flex flex-col gap-5 md:flex-row md:gap-6">
      <TallerSubNav pedidosPendientes={pedidosPendientes.length} />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
