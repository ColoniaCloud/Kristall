import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLeadNotification(lead: {
  name: string
  company?: string
  email: string
  phone?: string
  message: string
  source: string
  cartItems?: { productName: string; quantity: number }[]
}) {
  const itemsHtml = lead.cartItems?.length
    ? `<h3>Productos solicitados:</h3><ul>${lead.cartItems.map(i => `<li>${i.productName} × ${i.quantity}</li>`).join('')}</ul>`
    : ''

  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.EMAIL_LEADS_TO!,
    subject: `Nuevo lead: ${lead.name}${lead.company ? ` — ${lead.company}` : ''}`,
    html: `
      <h2>Nuevo lead recibido — Kristall Film</h2>
      <p><strong>Nombre:</strong> ${lead.name}</p>
      <p><strong>Empresa:</strong> ${lead.company || '—'}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Teléfono:</strong> ${lead.phone || '—'}</p>
      <p><strong>Fuente:</strong> ${lead.source}</p>
      <p><strong>Mensaje:</strong> ${lead.message || '—'}</p>
      ${itemsHtml}
    `,
  })
}

export async function sendLeadConfirmation(lead: {
  name: string
  email: string
}) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: lead.email,
    subject: 'Recibimos tu consulta — Kristall Film',
    html: `
      <h2>Hola ${lead.name},</h2>
      <p>Recibimos tu consulta y te contactaremos en las próximas 24 horas.</p>
      <p>Gracias por tu interés en Kristall Film.</p>
      <br/>
      <p style="color:#9A9A9A;font-size:12px">Kristall Film — Tecnología alemana de precisión</p>
    `,
  })
}
