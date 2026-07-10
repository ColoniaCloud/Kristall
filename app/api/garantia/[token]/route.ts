import { NextResponse } from 'next/server'
import { getStatus } from '@/lib/warranty/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  try {
    return NextResponse.json(await getStatus(token))
  } catch (err) {
    return crmErrorResponse(err)
  }
}
