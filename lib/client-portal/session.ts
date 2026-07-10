import { cookies } from 'next/headers'
import { createSessionToken, readSessionToken } from '@/lib/session'

export const CLIENT_SESSION_COOKIE = 'kf_client_session'
const MAX_AGE_SECONDS = 60 * 60 * 12 // 12h

export interface ClientSession {
  contactId: string
  name: string
  company: string
}

export function buildClientSessionCookie(data: ClientSession) {
  return {
    name: CLIENT_SESSION_COOKIE,
    value: createSessionToken(data, MAX_AGE_SECONDS),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      // path '/' (no '/cliente'): las páginas y los route handlers que leen esta
      // cookie viven en árboles de URL distintos (/cliente/* vs /api/portal/*).
      path: '/',
      maxAge: MAX_AGE_SECONDS,
    },
  }
}

export async function getClientSession(): Promise<ClientSession | null> {
  const store = await cookies()
  return readSessionToken<ClientSession>(store.get(CLIENT_SESSION_COOKIE)?.value)
}
