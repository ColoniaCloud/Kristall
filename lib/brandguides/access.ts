import { createHash, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { readSessionToken } from '@/lib/session'

// Acceso compartido de /brandguides (la página y sus descargas).
//
// En el repo vive solo el SHA-256 de la contraseña, nunca el texto. Para
// cambiarla sin tocar código, definir BRANDGUIDES_PASSWORD_SHA256 en el .env
// del servidor (hash hex de la nueva contraseña).
const DEFAULT_PASSWORD_SHA256 = '3bf6a0fd9d11f60b016bcae01280c0d93a3ccfbd5821b14232ec6e4cc0dbf733'

export const COOKIE = 'kf_brandguides'
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 30
export const PATH = '/brandguides'

function expectedHash(): Buffer {
  return Buffer.from(process.env.BRANDGUIDES_PASSWORD_SHA256 || DEFAULT_PASSWORD_SHA256, 'hex')
}

export function passwordMatches(password: string): boolean {
  const given = createHash('sha256').update(password).digest()
  const expected = expectedHash()
  return given.length === expected.length && timingSafeEqual(given, expected)
}

// El token lleva un pedazo del hash vigente: si se cambia la contraseña, las
// sesiones abiertas con la anterior dejan de valer.
export function passwordVersion(): string {
  return expectedHash().toString('hex').slice(0, 12)
}

export function hasAccess(request: NextRequest): boolean {
  const session = readSessionToken<{ scope: string; v: string }>(request.cookies.get(COOKIE)?.value)
  return session?.scope === 'brandguides' && session.v === passwordVersion()
}

// La página tiene su propio CSP (next.config.ts la excluye del general): carga
// DM Sans desde Google Fonts, el logo y los logos de línea desde public/, y sus
// scripts son inline. Los scripts se habilitan por hash, calculado sobre el
// HTML que se sirve, así que editar un script no exige tocar este archivo.
export function cspFor(html: string): string {
  const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`,
  )
  return [
    "default-src 'none'",
    hashes.length ? `script-src ${hashes.join(' ')}` : "script-src 'none'",
    "style-src 'unsafe-inline' https://fonts.googleapis.com",
    'font-src data: https://fonts.gstatic.com',
    "img-src 'self' data:",
    "form-action 'self'",
    "base-uri 'none'",
    "frame-ancestors 'none'",
  ].join('; ')
}
