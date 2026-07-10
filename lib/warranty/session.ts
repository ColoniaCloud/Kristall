import { cookies } from 'next/headers'
import { createSessionToken, readSessionToken } from '@/lib/session'
import type { WarrantyStatus } from './api'

export const WARRANTY_SESSION_COOKIE = 'kf_warranty_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 // 24h

/**
 * Snapshot de la respuesta de login (5.5), sin activationToken porque la API
 * no lo devuelve. Trade-off aceptado: el snapshot queda fijo por la duración
 * de la sesión — no hay endpoint para refrescar por installationCode sin
 * volver a pedir la contraseña.
 */
export type WarrantySession = WarrantyStatus

export function buildWarrantySessionCookie(data: WarrantySession) {
  return {
    name: WARRANTY_SESSION_COOKIE,
    value: createSessionToken(data, MAX_AGE_SECONDS),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
      maxAge: MAX_AGE_SECONDS,
    },
  }
}

export async function getWarrantySession(): Promise<WarrantySession | null> {
  const store = await cookies()
  return readSessionToken<WarrantySession>(store.get(WARRANTY_SESSION_COOKIE)?.value)
}
