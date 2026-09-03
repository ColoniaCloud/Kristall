import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getWorkshopSettings } from '@/lib/client-portal/workshop'
import WorkshopSettingsForm from '@/components/client-portal/taller/WorkshopSettingsForm'

export const metadata: Metadata = { title: 'Configuración del taller' }

export default async function ConfiguracionPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  const settings = await loadPortalData(() => getWorkshopSettings(session.contactId))

  // El CRM devuelve la ruta relativa del logo; el navegador tiene que pedirla
  // al CRM, no a este sitio. Se arma acá y no en el componente para no exponer
  // la URL del CRM en el bundle del cliente más de lo necesario.
  const crm = (process.env.CRM_BASE_URL ?? '').replace(/\/$/, '')
  const logoSrc = settings.logoUrl ? `${crm}${settings.logoUrl}` : null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Configuración del taller</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cómo te ven tus clientes en las garantías que generás.
        </p>
      </div>
      <WorkshopSettingsForm settings={settings} logoSrc={logoSrc} />
    </div>
  )
}
