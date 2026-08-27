import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getClientSession } from '@/lib/client-portal/session'
import LoginForm from '@/components/client-portal/LoginForm'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Ingresar' }

export default async function IngresarPage() {
  const session = await getClientSession()
  if (session) redirect('/cliente/dashboard')

  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      <main className="relative z-10 flex flex-1 items-center bg-muted">
        <div className="grid h-[80vh] w-full grid-cols-1 md:grid-cols-[35fr_65fr]">
          <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 shadow-sm">
              <h1 className="font-heading mb-1 text-xl font-semibold">Panel de Cliente</h1>
              <p className="mb-6 text-sm text-muted-foreground">Ingresá con las credenciales que te dio Kristall.</p>
              <LoginForm />
            </div>
          </div>
          <div className="relative hidden md:block">
            <Image src="/cat/ingresar.jpg" alt="" fill className="object-cover" priority />
          </div>
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
