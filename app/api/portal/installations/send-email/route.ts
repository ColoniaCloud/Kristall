import { NextRequest, NextResponse } from 'next/server'
import { getClientSession, levelOf } from '@/lib/client-portal/session'
import { getInstallations } from '@/lib/client-portal/api'
import { getWorkshopSettings } from '@/lib/client-portal/workshop'
import { crmErrorResponse } from '@/lib/crm/api'
import { crmAssetUrl } from '@/lib/warranty/api'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'
import { sendWarrantyActivationEmail } from '@/lib/resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
/**
 * El `activationToken` lo genera el CRM (cuid): solo alfanumérico. Lo validamos
 * acá porque es el único dato del body que termina en la URL del mail — ver la
 * nota de abajo sobre por qué todavía viaja en el request.
 */
const TOKEN_RE = /^[A-Za-z0-9_-]{8,128}$/
const MAX_RECIPIENT_NAME = 120

/**
 * Manda por mail la clave de garantía de una instalación al cliente final.
 *
 * Esta ruta escribe con la marca (SPF/DKIM de Kristall), así que el contenido
 * del mail NO puede salir del body: `installationCode` se verifica contra las
 * instalaciones del contacto de la sesión y el resto de los datos se toman del
 * objeto que devolvió el CRM. Del request solo se usan el destinatario (`to`) y
 * el nombre de cortesía (`recipientName`), ambos escapados en lib/resend.ts.
 */
export async function POST(request: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  // Mandar garantías es una acción de instalador, igual que /cliente/instalaciones.
  if (levelOf(session) !== 'INSTALLER') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  // Dos cubetas: la sesión es la identidad estable (no se puede rotar), la IP
  // frena a alguien con varias cuentas.
  const rlSession = checkRateLimit(`portal-send-warranty-email:${session.contactId}`, 15, 60 * 60)
  const rlIp = checkRateLimit(`portal-send-warranty-email-ip:${clientIp(request)}`, 30, 60 * 60)
  if (!rlSession.ok || !rlIp.ok) {
    return NextResponse.json({ error: 'Demasiados envíos, esperá unos minutos' }, { status: 429 })
  }

  const body = await request.json()
  const { to, recipientName, installationCode, activationToken } = body

  if (typeof to !== 'string' || !EMAIL_RE.test(to)) {
    return NextResponse.json({ error: 'Ingresá un email válido' }, { status: 400 })
  }
  if (typeof installationCode !== 'string' || !installationCode) {
    return NextResponse.json({ error: 'installationCode es requerido' }, { status: 400 })
  }
  if (typeof activationToken !== 'string' || !TOKEN_RE.test(activationToken)) {
    return NextResponse.json({ error: 'activationToken inválido' }, { status: 400 })
  }

  // Pertenencia: la instalación tiene que estar entre las del contacto logueado.
  let installations
  try {
    installations = await getInstallations(session.contactId)
  } catch (err) {
    return crmErrorResponse(err)
  }

  const installation = installations.find((i) => i.installationCode === installationCode)
  if (!installation) {
    // Mensaje genérico a propósito, para no facilitar enumeración de códigos.
    return NextResponse.json({ error: 'No encontramos esa instalación' }, { status: 403 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kristallfilm.com'
  // encodeURIComponent además del regex: el token no puede escaparse del path.
  const activationLink = `${siteUrl}/garantia/${encodeURIComponent(activationToken)}`

  // El taller firma el mail con el nombre y el logo que cargó en Mi Taller.
  // Sin configuración —o si el CRM no contesta— se firma con la razón social
  // del Cliente: el mail dice quién le instaló la lámina y no puede quedar en
  // blanco, y un logo que falta no puede frenar el envío.
  let taller: { nombre: string; logoUrl: string | null } = {
    nombre: session.company ?? session.name,
    logoUrl: null,
  }
  try {
    const settings = await getWorkshopSettings(session.contactId)
    taller = {
      nombre: settings.workshopName?.trim() || taller.nombre,
      logoUrl: crmAssetUrl(settings.logoUrl),
    }
  } catch (err) {
    console.warn('[API/portal/installations/send-email] sin configuración del taller, se firma con la razón social', err)
  }

  try {
    await sendWarrantyActivationEmail({
      to,
      recipientName:
        typeof recipientName === 'string' ? recipientName.slice(0, MAX_RECIPIENT_NAME) : undefined,
      taller,
      // Del CRM, no del body.
      installationCode: installation.installationCode,
      productName: installation.roll.product.name,
      activationLink,
    })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[API/portal/installations/send-email]', err)
    return NextResponse.json({ error: 'No pudimos enviar el email' }, { status: 502 })
  }
}
