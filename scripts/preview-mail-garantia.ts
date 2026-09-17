/**
 * Manda el mail «Activá tu garantía» con datos de ejemplo, o lo guarda como
 * HTML, sin tocar ninguna instalación real.
 *
 *     npx tsx --env-file=.env.local scripts/preview-mail-garantia.ts alguien@ejemplo.com
 *     npx tsx --env-file=.env.local scripts/preview-mail-garantia.ts --html salida.html
 *     npx tsx --env-file=.env.local scripts/preview-mail-garantia.ts alguien@ejemplo.com --logo <url>
 *
 * Sale por Resend con el remitente de `EMAIL_FROM`, igual que en producción.
 * Los links se arman con la URL pública del sitio aunque `.env.local` apunte a
 * localhost: un mail con links a localhost no sirve para revisar nada.
 *
 * Los otros dos mails de la familia (certificado y reclamo) salen del CRM:
 * `crm-polarizados/scripts/preview-mail-garantia.ts`.
 */
import { renderActivarGarantia } from '@/lib/mail/garantia-activar'
import { sendWarrantyActivationEmail } from '@/lib/resend'

const args = process.argv.slice(2)
const opcion = (nombre: string): string | null => {
  const i = args.indexOf(`--${nombre}`)
  return i >= 0 ? (args[i + 1] ?? null) : null
}
const salidaHtml = opcion('html')
const destinatario = args.find((a) => a.includes('@') && !a.startsWith('--')) ?? null
const logoTaller = opcion('logo')

if (!salidaHtml && !destinatario) {
  console.error('Uso: preview-mail-garantia.ts <email> | --html <archivo.html>')
  process.exit(1)
}

if (!process.env.NEXT_PUBLIC_SITE_URL || /localhost|127\.0\.0\.1/.test(process.env.NEXT_PUBLIC_SITE_URL)) {
  process.env.NEXT_PUBLIC_SITE_URL = 'https://kristallfilm.com'
}
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
const crmUrl = (process.env.CRM_BASE_URL || 'https://kri.kristallfilm.com').replace(/\/$/, '')

const ejemplo = {
  to: destinatario ?? 'ejemplo@ejemplo.com',
  recipientName: 'Martina',
  taller: { nombre: 'Polarizados del Sur', logoUrl: logoTaller },
  installationCode: 'LOT-20260912-0007-R003-I1',
  productName: 'Lámina Automotriz 20% Negro',
  // No es un token real: el link va a dar 404 en el portal.
  activationLink: `${siteUrl}/garantia/ejemplo-de-preview-no-valido`,
}

async function main() {
  if (salidaHtml) {
    const { html } = renderActivarGarantia({
      nombreCliente: ejemplo.recipientName,
      taller: ejemplo.taller,
      installationCode: ejemplo.installationCode,
      producto: ejemplo.productName,
      activationLink: ejemplo.activationLink,
      accederLink: `${siteUrl}/garantia/acceder`,
      logoKristallUrl: `${crmUrl}/logo-blanco.png`,
    })
    const { writeFileSync } = await import('node:fs')
    writeFileSync(salidaHtml, html, 'utf8')
    console.log(`HTML guardado en ${salidaHtml}`)
    return
  }

  await sendWarrantyActivationEmail(ejemplo)
  console.log(`Enviado a ${ejemplo.to} por Resend, desde ${process.env.EMAIL_FROM}`)
}

main().catch((err) => {
  console.error('No se pudo mandar el mail de prueba:', err)
  process.exit(1)
})
