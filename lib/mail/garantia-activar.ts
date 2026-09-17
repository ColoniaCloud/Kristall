/**
 * «Activá tu garantía»: el mail que le manda el instalador al cliente final
 * desde el portal, con el link para dejar la garantía a su nombre.
 *
 * Es el primero de la familia de mails de garantía. Los otros dos —el
 * certificado al activar y las novedades de un reclamo— salen del CRM, y las
 * piezas de acá (cabecera negra, banda, firma del taller, pie) son una copia
 * de `crm-polarizados/src/lib/mail-garantia.ts`. Si cambiás algo de la
 * cabecera o el pie acá, cambialo allá también.
 *
 * Todo es tablas e inline styles a propósito: Gmail y Outlook no soportan
 * flexbox, grid ni fuentes importadas. DM Sans solo se ve en Apple Mail; el
 * resto cae a Arial, y el diseño se pensó para que quede bien así.
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// La paleta del diseño aprobado, con el contraste corregido (ver el CRM).
const C = {
  bg: '#E8E8E6',
  black: '#0A0A0A',
  ink: '#0A0A0A',
  text: '#5C5C5C',
  muted: '#7A7A77',
  hair: '#EEEEED',
  band: '#F2F2F0',
  foot: '#F8F8F6',
  red: '#EB3439',
  gold: '#FFDA2C',
  legal: '#6E6E6B',
  dSub: '#B8B8B8',
  dEyebrow: '#A0A0A0',
  dBadge: '#D6D6D6',
  dBorder: '#3A3A3A',
  dDiv: '#262626',
} as const

const F = "'DM Sans', Arial, Helvetica, sans-serif"

export interface DatosActivarGarantia {
  /** Nombre de cortesía que escribió el instalador. Opcional. */
  nombreCliente: string | null
  taller: { nombre: string; logoUrl: string | null }
  installationCode: string
  producto: string
  /** `https://kristallfilm.com/garantia/<token>` */
  activationLink: string
  /** Dónde entrar con el código a mano si el link no anda. */
  accederLink: string
  /** URL absoluta del logo blanco de Kristall. */
  logoKristallUrl: string
}

function bandera(): string {
  const barra = (color: string) =>
    `<td style="padding-right:2px;"><div style="width:14px;height:2px;border-radius:1px;background:${color};font-size:0;line-height:0;"></div></td>`
  return `<td style="vertical-align:middle;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${barra('#4A4A4A')}${barra(C.red)}${barra(C.gold)}</tr></table></td>`
}

function cabecera(logoUrl: string, etiqueta: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.black};">
  <tr><td class="px" style="padding:26px 40px 0 40px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;"><img src="${logoUrl}" alt="Kristall Film" width="134" height="22" style="display:block;width:134px;height:22px;border:0;"></td>
      <td align="right" style="vertical-align:middle;"><span style="display:inline-block;border:1px solid ${C.dBorder};border-radius:4px;padding:6px 12px;font-family:${F};font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:${C.dBadge};font-weight:500;white-space:nowrap;">${etiqueta}</span></td>
    </tr></table>
  </td></tr>
  <tr><td class="px" style="padding:24px 40px 0 40px;"><div style="height:1px;background:${C.dDiv};font-size:0;line-height:0;"></div></td></tr>
</table>`
}

function banda(o: { eyebrow: string; titulo: string; bajada: string; boton: { texto: string; href: string } }): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.black};">
  <tr><td class="px" style="padding:26px 40px 32px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${bandera()}
      <td style="padding-left:8px;vertical-align:middle;font-family:${F};font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${C.dEyebrow};font-weight:500;">${o.eyebrow}</td>
    </tr></table>
    <div style="font-family:${F};font-size:26px;line-height:1.2;font-weight:500;color:#FFFFFF;letter-spacing:-.01em;padding-top:12px;">${o.titulo}</div>
    <div style="font-family:${F};font-size:13px;line-height:1.6;font-weight:400;color:${C.dSub};padding-top:8px;max-width:430px;">${o.bajada}</div>
    <div style="padding-top:24px;"><a href="${o.boton.href}" style="display:inline-block;background:#FFFFFF;color:${C.black};font-family:${F};font-size:14px;font-weight:600;text-decoration:none;padding:14px 30px;border-radius:6px;letter-spacing:.02em;">${o.boton.texto}</a></div>
  </td></tr></table>`
}

function firmaTaller(taller: { nombre: string; logoUrl: string | null }): string {
  // Los logos de los talleres tienen cualquier proporción (los hay de 400×52).
  // `max-height` + `max-width` con `auto` deja que el navegador conserve la
  // proporción sea cual sea el lado que tope; el atributo `height` es para
  // Outlook de escritorio, que ignora los max-* y escala el ancho solo.
  const logo = taller.logoUrl
    ? `<img src="${taller.logoUrl}" alt="${escapeHtml(taller.nombre)}" height="30" style="display:block;height:auto;max-height:30px;width:auto;max-width:220px;border:0;">`
    : `<span style="font-family:${F};font-size:14px;font-weight:600;color:${C.ink};">${escapeHtml(taller.nombre)}</span>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFFFF;border-bottom:1px solid ${C.hair};">
  <tr><td class="px" style="padding:16px 40px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
      <td style="vertical-align:middle;padding-right:14px;font-family:${F};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};font-weight:600;white-space:nowrap;">Instalado por</td>
      <td style="vertical-align:middle;">${logo}</td>
    </tr></table>
  </td></tr></table>`
}

function pie(legal: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.foot};border-top:1px solid ${C.hair};"><tr><td class="px" style="padding:24px 40px;">
  <div style="font-family:${F};font-size:11px;font-weight:600;letter-spacing:.06em;color:${C.text};">KRISTALL<sup style="font-size:7px;line-height:0;">&reg;</sup></div>
  <div style="font-family:${F};font-size:11px;color:${C.legal};line-height:1.7;padding-bottom:14px;">Performance aplicada al confort<br>Tecnología alemana de láminas de alto rendimiento.<br>
    <a href="mailto:ventas@kristallfilm.com" style="color:${C.legal};text-decoration:none;">ventas@kristallfilm.com</a> &middot; <a href="https://www.kristallfilm.com" style="color:${C.legal};text-decoration:none;">www.kristallfilm.com</a></div>
  <div style="height:1px;background:${C.hair};margin-bottom:14px;font-size:0;line-height:0;"></div>
  <div style="font-family:${F};font-size:10px;line-height:1.7;color:${C.legal};">${legal}</div>
</td></tr></table>`
}

function documento(o: { asunto: string; preheader: string; contenido: string }): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(o.asunto)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap">
<style>
  body{margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%;} img{border:0;} a{color:inherit;}
  @media (max-width:480px){ .px{padding-left:24px!important;padding-right:24px!important;} .wrap{padding:16px 10px!important;} }
</style>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:${C.bg};">${escapeHtml(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};"><tr><td align="center" class="wrap" style="padding:32px 16px;">
  <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:580px;background:#FFFFFF;border-radius:4px;border-collapse:separate;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08);">
    <tr><td style="padding:0;">${o.contenido}</td></tr>
  </table>
  <div style="max-width:580px;padding-top:14px;font-family:${F};font-size:11px;line-height:1.5;color:${C.muted};text-align:center;">Mensaje automático de Kristall Film &middot; No respondas este correo.</div>
</td></tr></table>
</body>
</html>`
}

const LEGAL = 'Este correo se generó automáticamente. Si no reconocés esta instalación, ignoralo o escribinos.'

export function renderActivarGarantia(d: DatosActivarGarantia): { subject: string; html: string } {
  // El subject viaja como header, no como HTML: escaparlo mostraría entidades
  // (&amp;) al cliente. Lo único que hay que sacarle son los saltos de línea.
  const productoEnAsunto = d.producto.replace(/[\r\n]+/g, ' ').trim()
  const taller = escapeHtml(d.taller.nombre)
  const nombre = d.nombreCliente?.trim() ? `${escapeHtml(d.nombreCliente.trim())}, ` : ''
  const activationLink = escapeHtml(d.activationLink)

  return {
    subject: `Activá tu garantía Kristall Film — ${productoEnAsunto}`,
    html: documento({
      asunto: `Activá tu garantía Kristall Film — ${productoEnAsunto}`,
      preheader: `${d.taller.nombre} te entregó un producto Kristall Film con garantía. Activala para dejarla a tu nombre.`,
      contenido:
        cabecera(d.logoKristallUrl, 'Pendiente de activación') +
        banda({
          eyebrow: 'Garantía Kristall Film',
          titulo: 'Tu garantía está lista<br>para activar.',
          bajada: `${nombre}<strong style="color:#FFFFFF;font-weight:500;">${taller}</strong> te entregó un producto Kristall Film con garantía. Activala para dejarla a tu nombre: lleva un minuto.`,
          boton: { texto: 'Activar garantía', href: activationLink },
        }) +
        firmaTaller(d.taller) +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="px" style="padding:32px 40px 28px 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.band};border-radius:6px;"><tr><td style="padding:14px 16px;">
    <div style="font-family:${F};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${C.muted};font-weight:600;padding-bottom:4px;">Tu código de garantía</div>
    <div style="font-family:${F};font-size:16px;font-weight:600;color:${C.ink};letter-spacing:.04em;">${escapeHtml(d.installationCode)}</div>
  </td></tr></table>
  <div style="font-family:${F};font-size:13px;line-height:1.7;color:${C.text};padding-top:20px;">Vas a necesitar tu nombre, tu email y la patente del vehículo. Si el botón no funciona, entrá a <a href="${escapeHtml(d.accederLink)}" style="color:${C.ink};">kristallfilm.com/garantia</a> con el código de arriba.</div>
  <div style="font-family:${F};font-size:12px;line-height:1.7;color:${C.muted};padding-top:16px;">Producto: <span style="color:${C.ink};">${escapeHtml(d.producto)}</span></div>
</td></tr></table>` +
        pie(LEGAL),
    }),
  }
}
