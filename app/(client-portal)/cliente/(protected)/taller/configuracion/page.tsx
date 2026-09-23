import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import { loadPortalData } from '@/lib/client-portal/guard'
import { getWorkshopSettings, listWorkshopServices, listWorkshopPhotos } from '@/lib/client-portal/workshop'
import WorkshopSettingsForm from '@/components/client-portal/taller/WorkshopSettingsForm'
import PublicPageForm from '@/components/client-portal/taller/PublicPageForm'
import PhotoAlbumForm from '@/components/client-portal/taller/PhotoAlbumForm'
import ServicesForm from '@/components/client-portal/taller/ServicesForm'
import ConfiguracionTabs from '@/components/client-portal/taller/ConfiguracionTabs'
import Recorrido from '@/components/client-portal/Recorrido'

export const metadata: Metadata = { title: 'Configuración del taller' }

export default async function ConfiguracionPage() {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  // En paralelo: son dos llamadas independientes al CRM y encadenarlas
  // duplicaría el tiempo de carga de la pantalla.
  const [settings, services, photos] = await Promise.all([
    loadPortalData(() => getWorkshopSettings(session.contactId)),
    loadPortalData(() => listWorkshopServices(session.contactId)),
    loadPortalData(() => listWorkshopPhotos(session.contactId)),
  ])

  // El CRM devuelve la ruta relativa del logo; el navegador tiene que pedirla
  // al CRM, no a este sitio. Se arma acá y no en el componente para no exponer
  // la URL del CRM en el bundle del cliente más de lo necesario.
  const crm = (process.env.CRM_BASE_URL ?? '').replace(/\/$/, '')
  const logoSrc = settings.logoUrl ? `${crm}${settings.logoUrl}` : null
  const heroSrc = settings.heroUrl ? `${crm}${settings.heroUrl}` : null
  const teamSrc = settings.teamUrl ? `${crm}${settings.teamUrl}` : null

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Recorrido pantalla="configuracion" activo={Boolean(session.demo)} />
      <div>
        <h1 className="font-heading text-2xl font-semibold">Configuración del taller</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cómo te ven tus clientes en las garantías que generás y en tu página pública.
        </p>
      </div>
      <ConfiguracionTabs
        tabInicial={session.demo ? 'pagina' : 'general'}
        general={<WorkshopSettingsForm settings={settings} logoSrc={logoSrc} />}
        pagina={
          // En demostración la página pública vive bajo /demo/, que es el
          // espacio que habla con la base de prueba. Sin esto el link lleva a
          // la ruta real, donde el handle no existe.
          <PublicPageForm
            settings={settings}
            heroSrc={heroSrc}
            teamSrc={teamSrc}
            demo={Boolean(session.demo)}
          />
        }
        album={<PhotoAlbumForm photos={photos} />}
        servicios={
          // El selector de rubro por servicio solo aparece si el taller marco
          // los dos: a quien hace una sola cosa no se le pregunta lo que ya
          // contesto.
          <ServicesForm
            services={services}
            soloRubro={
              settings.doesAutomotive && settings.doesArchitectural
                ? null
                : settings.doesArchitectural
                  ? 'ARCHITECTURAL'
                  : 'AUTOMOTIVE'
            }
          />
        }
      />
    </div>
  )
}
