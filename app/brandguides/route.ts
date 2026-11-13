import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/session'
import { GUIA_HTML } from '@/lib/brandguides/guia-html'
import { COOKIE, MAX_AGE_SECONDS, PATH, cspFor, hasAccess, passwordMatches, passwordVersion } from '@/lib/brandguides/access'

// Guía de marca interna. No es contenido público: se protege con una
// contraseña compartida y la página no se indexa. La lógica de acceso y el CSP
// viven en lib/brandguides/access.ts (también los usa la descarga de fuentes).

const GUIA_CSP = cspFor(GUIA_HTML)

function html(body: string, status = 200, csp = cspFor(body)): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Content-Security-Policy': csp,
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
  if (hasAccess(request)) return html(GUIA_HTML, 200, GUIA_CSP)
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
