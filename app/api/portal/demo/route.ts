import { NextRequest, NextResponse } from 'next/server'
import { crearSesionDemo } from '@/lib/client-portal/demo'
import { buildClientSessionCookie } from '@/lib/client-portal/session'
import { crmErrorResponse } from '@/lib/crm/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Abre una sesión de demostración.
 *
 * Es la puerta, y a propósito **no es un formulario de login**. Un login es
 * fricción justo cuando querés que la persona entre, y `demo`/`demo` es lo
 * primero que prueban los bots que barren `/cliente/ingresar` — con un
 * formulario estaríamos creando talleres descartables para robots.
 *
 * La cookie que emite es la misma de siempre. Lo único distinto es que dura
 * media hora y lleva `demo: true`, que hace dos cosas: dibuja la banda de aviso
 * y hace que las llamadas al CRM vayan a los espejos que resuelven contra la
 * base de demostración.
 */
export async function POST(request: NextRequest) {
  const rl = checkRateLimit(`portal-demo:${clientIp(request)}`, 5, 60 * 60)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Ya abriste varias demostraciones. Probá de nuevo en un rato.' },
      { status: 429 }
    )
  }

  try {
    const demo = await crearSesionDemo()
    const cookie = buildClientSessionCookie({
      contactId: demo.contactId,
      name: demo.nombre,
      company: demo.nombre,
      accessLevel: 'INSTALLER',
      credentialVersion: demo.credentialVersion,
      demo: true,
    })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(cookie.name, cookie.value, cookie.options)
    return response
  } catch (err) {
    return crmErrorResponse(err)
  }
}
