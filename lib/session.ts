import { createHmac, timingSafeEqual } from 'crypto'

function requireSecret(): string {
  const secret = process.env.SESSION_SECRET
  if (!secret) throw new Error('Missing SESSION_SECRET')
  return secret
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url')
}

function sign(body: string, secret: string): string {
  return b64url(createHmac('sha256', secret).update(body).digest())
}

/** Firma un payload en un token opaco `body.signature`, con expiración embebida. */
export function createSessionToken<T extends object>(payload: T, maxAgeSeconds: number): string {
  const secret = requireSecret()
  const exp = Math.floor(Date.now() / 1000) + maxAgeSeconds
  const body = b64url(JSON.stringify({ ...payload, exp }))
  return `${body}.${sign(body, secret)}`
}

/** Verifica firma y expiración. Devuelve null si el token es inválido, alterado o vencido. */
export function readSessionToken<T>(token: string | undefined | null): (T & { exp: number }) | null {
  if (!token) return null
  const secret = requireSecret()
  const [body, sig] = token.split('.')
  if (!body || !sig) return null

  const expected = sign(body, secret)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'))
    if (typeof payload.exp !== 'number' || payload.exp < Date.now() / 1000) return null
    return payload
  } catch {
    return null
  }
}
