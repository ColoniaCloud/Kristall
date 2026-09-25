import type { Viewport } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import BandaDemo from '@/components/client-portal/BandaDemo'
import Sidebar from '@/components/client-portal/Sidebar'
import TopBar from '@/components/client-portal/TopBar'
import RegisterServiceWorker from '@/components/client-portal/RegisterServiceWorker'
import { Toaster } from '@/components/ui/sonner'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#26262a',
  colorScheme: 'dark',
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  // Las sesiones emitidas antes de que existieran los niveles no traen el campo;
  // levelOf() las trata como BASIC, que es lo restrictivo.
  const level = levelOf(session)

  return (
    <div className="crm-theme flex min-h-screen bg-background text-foreground">
      <Sidebar level={level} />
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Arriba de todo y en todas las pantallas: alguien le va a sacar una
            captura a esto y mandarla por WhatsApp. */}
        {session.demo && <BandaDemo />}
        <TopBar session={session} level={level} />
        {/* El tope de ancho vive acá y no en cada pantalla porque la mitad de
            ellas no lo tenía: en un monitor ancho, una tabla de cuatro
            columnas cortas se estiraba 1300px y leérla era un viaje. 1200px
            es el techo del panel; las pantallas de formulario o de lectura se
            angostan más por su cuenta (`max-w-3xl` en Mi Taller). */}
        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto w-full max-w-[1200px]">{children}</div>
        </main>
      </div>
      <RegisterServiceWorker />
      <Toaster position="top-right" />
    </div>
  )
}
