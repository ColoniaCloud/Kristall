import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, company, email, phone, message, source, cartItems } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name y email son requeridos' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        company,
        email,
        phone,
        message,
        source: source || 'contacto',
        status: 'nuevo',
      },
    })

    await sendLeadNotification({ name, company, email, phone, message, source, cartItems })
    await sendLeadConfirmation({ name, email })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('[API/leads]', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
