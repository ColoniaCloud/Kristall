import { Resend } from 'resend'

function escapeHtml(value: string): string {
  return value
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

export async function sendLeadNotification(lead: {
  name: string
  company?: string
  email: string
  phone?: string
  message: string
  source: string
  cartItems?: { productName: string; codigo?: string; quantity?: number }[]
}) {
  const resend = getResendClient()
  const itemsHtml = lead.cartItems?.length
    ? `<h3>Productos solicitados:</h3><ul>${lead.cartItems
        .map((i) => `<li>${escapeHtml(i.productName)}${i.codigo ? ` (${escapeHtml(i.codigo)})` : ''} × ${i.quantity ?? 1}</li>`)
        .join('')}</ul>`
    : ''

  await resend.emails.send({
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
  })
}

export async function sendLeadConfirmation(lead: {
  name: string
  email: string
}) {
  const resend = getResendClient()
  await resend.emails.send({
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
  })
}

export async function sendWarrantyActivationEmail(params: {
  to: string
  recipientName?: string
  installerCompany: string
  installationCode: string
  productName: string
  activationLink: string
}) {
  const resend = getResendClient()
  const { to, recipientName, installerCompany, installationCode, productName, activationLink } = params

  // El subject viaja como header, no como HTML: escaparlo mostraría entidades
  // (&amp;) al cliente. Lo único que hay que sacarle son los saltos de línea.
  const safeProductName = productName.replace(/[\r\n]+/g, ' ').trim()
  const link = escapeHtml(activationLink)

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: `Tu garantía Kristall Film — ${safeProductName}`,
    html: `
      <h2>Hola${recipientName ? ` ${escapeHtml(recipientName)}` : ''},</h2>
      <p>${escapeHtml(installerCompany)} te entregó un producto Kristall Film (${escapeHtml(productName)}) con garantía. Usá este link para activarla o consultar su estado:</p>
      <p><a href="${link}">${link}</a></p>
      <p>Tu clave de garantía es: <strong>${escapeHtml(installationCode)}</strong></p>
      <br/>
      <p style="color:#9A9A9A;font-size:12px">Kristall Film — Tecnología alemana de precisión</p>
    `,
  })
}
