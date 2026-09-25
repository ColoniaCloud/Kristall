import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { getNotifications } from '@/lib/client-portal/api'
import { loadPortalData } from '@/lib/client-portal/guard'
import NotificationsList from '@/components/client-portal/NotificationsList'
import PageHeader from '@/components/client-portal/PageHeader'

export const metadata: Metadata = { title: 'Notificaciones' }

export default async function NotificacionesPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const notifications = await loadPortalData(() => getNotifications(session.contactId))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notificaciones"
        description="Los avisos de Kristall sobre tus compras, tus garantías y tu cuenta corriente."
      />
      <NotificationsList initial={notifications} />
    </div>
  )
}
