import type { Viewport } from 'next'
import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
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
        <TopBar session={session} level={level} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
      <RegisterServiceWorker />
      <Toaster position="top-right" />
    </div>
  )
}
