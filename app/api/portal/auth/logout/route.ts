import { NextRequest, NextResponse } from 'next/server'
import { CLIENT_SESSION_COOKIE } from '@/lib/client-portal/session'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(CLIENT_SESSION_COOKIE)
  return response
}

const MOTIVOS = ['acceso-revocado', 'clave-cambiada'] as const

/**
 * Salida por GET, para que una página protegida pueda cerrar la sesión.
 *
 * Una página no puede borrar cookies (solo un route handler o una server
 * action), y redirigir al login sin borrarla es un rebote infinito: el login ve
 * la cookie viva y devuelve al dashboard. Por eso `loadPortalData` redirige acá
 * cuando el CRM contesta 403 o 401.
 *
 * Que sea GET lo hace disparable desde un `<img>` de un sitio ajeno; el daño
 * posible es cerrarle la sesión a alguien, que es la dirección segura. El POST
 * sigue existiendo para el botón de la barra.
 */
export async function GET(request: NextRequest) {
  const motivo = request.nextUrl.searchParams.get('motivo')
  const destino = new URL('/cliente/ingresar', request.nextUrl.origin)
  if (motivo && (MOTIVOS as readonly string[]).includes(motivo)) {
    destino.searchParams.set('motivo', motivo)
  }

  const response = NextResponse.redirect(destino)
  response.cookies.delete(CLIENT_SESSION_COOKIE)
  return response
}
