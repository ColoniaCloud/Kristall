import { createHash, timingSafeEqual } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken, readSessionToken } from '@/lib/session'
import { GUIA_HTML } from '@/lib/brandguides/guia-html'

// Guía de marca interna. No es contenido público: se protege con una
// contraseña compartida y la página no se indexa.
//
// En el repo vive solo el SHA-256 de la contraseña, nunca el texto. Para
// cambiarla sin tocar código, definir BRANDGUIDES_PASSWORD_SHA256 en el .env
// del servidor (hash hex de la nueva contraseña).
const DEFAULT_PASSWORD_SHA256 = '3bf6a0fd9d11f60b016bcae01280c0d93a3ccfbd5821b14232ec6e4cc0dbf733'

const COOKIE = 'kf_brandguides'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30
const PATH = '/brandguides'

// Esta página tiene su propio CSP (next.config.ts la excluye del general)
// porque la guía carga DM Sans desde Google Fonts y trae todo lo demás inline.
const CSP = [
  "default-src 'none'",
  "style-src 'unsafe-inline' https://fonts.googleapis.com",
  "font-src data: https://fonts.gstatic.com",
  // 'self': el logo (LogoPlano.png) y los logos de línea salen de public/, como en el sitio.
  "img-src 'self' data:",
  "form-action 'self'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join('; ')

function expectedHash(): Buffer {
  return Buffer.from(process.env.BRANDGUIDES_PASSWORD_SHA256 || DEFAULT_PASSWORD_SHA256, 'hex')
}

function passwordMatches(password: string): boolean {
  const given = createHash('sha256').update(password).digest()
  const expected = expectedHash()
  return given.length === expected.length && timingSafeEqual(given, expected)
}

// El token lleva un pedazo del hash vigente: si se cambia la contraseña, las
// sesiones abiertas con la anterior dejan de valer.
function passwordVersion(): string {
  return expectedHash().toString('hex').slice(0, 12)
}

function hasAccess(request: NextRequest): boolean {
  const session = readSessionToken<{ scope: string; v: string }>(request.cookies.get(COOKIE)?.value)
  return session?.scope === 'brandguides' && session.v === passwordVersion()
}

function html(body: string, status = 200): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': CSP,
    },
  })
}

function loginPage(error: boolean): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>Guía de marca · Kristall Film</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap">
<style>
:root{--bg:#F2F2F0;--surface:#FFFFFF;--fg:#0A0A0A;--fg2:#5C5C5C;--border:#E4E4E2;--err:#B3261E}
@media (prefers-color-scheme:dark){:root{--bg:#111110;--surface:#1A1A19;--fg:#F2F2F0;--fg2:#B4B4AF;--border:#2A2A28;--err:#F08A80;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);font-family:"DM Sans",system-ui,sans-serif}
.flag{display:flex;height:4px}.flag i{flex:1}.flag i:nth-child(1){background:#1A1A1A}.flag i:nth-child(2){background:#CC0000}.flag i:nth-child(3){background:#E6A800}
main{flex:1;display:flex;align-items:center;justify-content:center;padding:24px 16px}
form{width:100%;max-width:360px;background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:28px;display:flex;flex-direction:column;gap:14px}
.eyebrow{font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;color:var(--fg2);margin:0}
h1{font-size:22px;font-weight:600;margin:0}
label{font-size:14px;font-weight:500}
input{width:100%;padding:10px 12px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--fg);font:inherit;font-size:15px}
input:focus{outline:2px solid var(--fg);outline-offset:1px}
button{padding:11px 16px;border:0;border-radius:8px;background:var(--fg);color:var(--bg);font:inherit;font-weight:500;cursor:pointer}
button:focus-visible{outline:2px solid var(--fg);outline-offset:2px}
.err{color:var(--err);font-size:14px;margin:0}
</style></head><body>
<div class="flag" aria-hidden="true"><i></i><i></i><i></i></div>
<main><form method="post" action="${PATH}">
<p class="eyebrow">Kristall Film</p>
<h1>Guía de marca</h1>
<label for="password">Contraseña</label>
<input id="password" name="password" type="password" autocomplete="current-password" required autofocus>
${error ? '<p class="err" role="alert">La contraseña no es correcta. Probá de nuevo.</p>' : ''}
<button type="submit">Entrar</button>
</form></main>
</body></html>`
}

export async function GET(request: NextRequest) {
  if (hasAccess(request)) return html(GUIA_HTML)
  return html(loginPage(false))
}

export async function POST(request: NextRequest) {
  const form = await request.formData().catch(() => null)
  const password = form?.get('password')
  if (typeof password !== 'string' || !passwordMatches(password)) {
    return html(loginPage(true), 401)
  }

  // Location relativa: detrás de Traefik, request.url trae el host interno del contenedor.
  const response = new NextResponse(null, { status: 303, headers: { Location: PATH } })
  response.cookies.set(COOKIE, createSessionToken({ scope: 'brandguides', v: passwordVersion() }, MAX_AGE_SECONDS), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: PATH,
    maxAge: MAX_AGE_SECONDS,
  })
  return response
}
