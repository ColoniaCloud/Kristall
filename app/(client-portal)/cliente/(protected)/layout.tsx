import { redirect } from 'next/navigation'
import { getClientSession } from '@/lib/client-portal/session'
import Sidebar from '@/components/client-portal/Sidebar'
import TopBar from '@/components/client-portal/TopBar'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar session={session} />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
