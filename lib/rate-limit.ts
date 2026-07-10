/**
 * Rate limit en memoria, ventana fija, por IP+bucket. No persiste entre
 * reinicios ni se comparte entre instancias — suficiente para el volumen
 * esperado de activaciones de garantía y logins. Si el tráfico lo justifica,
 * migrar a un store externo (Redis/Upstash) sin cambiar esta interfaz.
 */

interface Entry {
  count: number
  resetAt: number
}

const buckets = new Map<string, Entry>()

export interface RateLimitResult {
  ok: boolean
  retryAfterSeconds: number
}

export function checkRateLimit(key: string, limit: number, windowSeconds: number): RateLimitResult {
  const now = Date.now()
  const entry = buckets.get(key)

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
    return { ok: true, retryAfterSeconds: 0 }
  }

  if (entry.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  return { ok: true, retryAfterSeconds: 0 }
}

/** IP del request, con fallback razonable detrás de proxy (Hostinger/Vercel/etc). */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}
