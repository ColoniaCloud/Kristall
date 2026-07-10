import { NextResponse } from 'next/server'
import { WARRANTY_SESSION_COOKIE } from '@/lib/warranty/session'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.delete(WARRANTY_SESSION_COOKIE)
  return response
}
