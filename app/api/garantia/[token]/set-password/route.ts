import { NextRequest, NextResponse } from 'next/server'
import { setPassword } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function POST(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { password } = await request.json()

  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 })
  }

  try {
    return NextResponse.json(await setPassword(token, password))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
