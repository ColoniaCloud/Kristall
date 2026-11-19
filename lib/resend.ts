import { Resend } from 'resend'
import { renderActivarGarantia } from '@/lib/mail/garantia-activar'

// Tolera nulos a propósito: los valores salen de bodies sin tipo, y un campo
// ausente no debe tirar abajo el envío de un mail entero.
function escapeHtml(value: string | null | undefined): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

let resendClient: Resend | null = null

function getResendClient() {
  if (resendClient) {
    return resendClient
  }

  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY')
  }

  resendClient = new Resend(apiKey)

  return resendClient
}

/**
 * `resend.emails.send` NO lanza cuando la API rechaza el envío: devuelve
 * `{ data: null, error }`. Sin mirar ese `error`, un mail rechazado (dominio
 * suspendido, destinatario inválido, cuota) se ve exactamente igual que uno
 * entregado y no deja ni una línea de log. Esta envoltura lo convierte en
 * excepción, que es lo que los llamadores ya manejan: la ruta de leads lo
 * registra sin perder el lead, y la de garantías devuelve 502.
 */
async function enviar(mail: Parameters<Resend['emails']['send']>[0], descripcion: string) {
  const { data, error } = await getResendClient().emails.send(mail)

  if (error) {
    throw new Error(`Resend rechazó ${descripcion}: ${error.name} — ${error.message}`)
  }

  return data
}

export async function sendLeadNotification(lead: {
  name: string
  company?: string
  email: string
  phone?: string
  message: string
  source: string
  cartItems?: { productName: string; codigo?: string; quantity?: number }[]
}) {
  const itemsHtml = lead.cartItems?.length
    ? `<h3>Productos solicitados:</h3><ul>${lead.cartItems
        .map((i) => `<li>${escapeHtml(i.productName)}${i.codigo ? ` (${escapeHtml(i.codigo)})` : ''} × ${i.quantity ?? 1}</li>`)
        .join('')}</ul>`
    : ''

  await enviar({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_LEADS_TO!,
    subject: `Nuevo lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ''}`,
    html: `
      <h2>Nuevo lead recibido — Kristall Film</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(lead.name)}</p>
      <p><strong>Empresa:</strong> ${lead.company ? escapeHtml(lead.company) : '—'}</p>
      <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
      <p><strong>Teléfono:</strong> ${lead.phone ? escapeHtml(lead.phone) : '—'}</p>
      <p><strong>Fuente:</strong> ${escapeHtml(lead.source)}</p>
      <p><strong>Mensaje:</strong> ${lead.message ? escapeHtml(lead.message) : '—'}</p>
      ${itemsHtml}
    `,
  }, 'la notificación de un lead nuevo')
}

export async function sendLeadConfirmation(lead: {
  name: string
  email: string
}) {
  await enviar({
    from: process.env.EMAIL_FROM!,
    to: lead.email,
    subject: 'Recibimos tu consulta — Kristall Film',
    html: `
      <h2>Hola ${escapeHtml(lead.name)},</h2>
      <p>Recibimos tu consulta y te contactaremos a la brevedad.</p>
      <p>Gracias por tu interés en Kristall Film.</p>
      <br/>
      <p style="color:#9A9A9A;font-size:12px">Kristall Film — Tecnología alemana de precisión</p>
    `,
  }, 'la confirmación al visitante')
}

export async function sendWarrantyActivationEmail(params: {
  to: string
  recipientName?: string
  taller: { nombre: string; logoUrl: string | null }
  installationCode: string
  productName: string
  activationLink: string
}) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://kristallfilm.com').replace(/\/$/, '')
  // El logo blanco lo sirve el CRM, igual que el del taller: es el servidor de
  // imágenes de todo lo que sale con la marca hacia el cliente final.
  const crmUrl = (process.env.CRM_BASE_URL || 'https://crm.kristallfilm.com').replace(/\/$/, '')

  const { subject, html } = renderActivarGarantia({
    nombreCliente: params.recipientName ?? null,
    taller: params.taller,
    installationCode: params.installationCode,
    producto: params.productName,
    activationLink: params.activationLink,
    accederLink: `${siteUrl}/garantia/acceder`,
    logoKristallUrl: `${crmUrl}/logo-blanco.png`,
  })

  await enviar(
    { from: process.env.EMAIL_FROM!, to: params.to, subject, html },
    'el mail de activación de garantía',
  )
}
