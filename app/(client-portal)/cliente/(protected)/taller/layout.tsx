import { redirect } from 'next/navigation'
import { getClientSession, levelOf } from '@/lib/client-portal/session'

/**
 * Guard de nivel para todo Mi Taller.
 *
 * Está en el layout y no repetido en cada página: el módulo son siete
 * pantallas, y un guard copiado siete veces es un guard que en algún momento
 * falta en la octava. Esconder el menú no alcanza — alguien puede escribir la
 * URL, y el CRM contestaría 403 con un cartel confuso.
 *
 * No es LA barrera de seguridad: el CRM revalida el nivel en cada endpoint.
 * Esto es para que un cliente BASIC vea su dashboard en vez de un error.
 */
export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession()
  if (!session) redirect('/cliente/ingresar')
  if (levelOf(session) !== 'INSTALLER') redirect('/cliente/dashboard')

  return <>{children}</>
}
