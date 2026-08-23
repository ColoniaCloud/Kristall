import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '../../../payload.config'
import { sendLeadNotification, sendLeadConfirmation } from '@/lib/resend'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(`leads:${clientIp(req)}`, 8, 10 * 60)
  if (!rl.ok) {
    return NextResponse.json({ error: 'Demasiadas solicitudes, esperá unos minutos' }, { status: 429 })
  }

  try {
    const body = await req.json()
    const { name, company, email, phone, message, source, cartItems } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'name y email son requeridos' }, { status: 400 })
    }

    // Solo lo que viaja del carrito (QuoteModal): { productName, codigo, quantity }.
    // Cualquier otra forma se descarta en vez de dejarla llegar tal cual a Payload.
    const validCartItems = Array.isArray(cartItems)
      ? cartItems
          .filter((i) => i && typeof i.productName === 'string')
          .map((i) => ({
            productName: i.productName,
            codigo: typeof i.codigo === 'string' ? i.codigo : undefined,
            quantity: typeof i.quantity === 'number' ? i.quantity : undefined,
          }))
      : undefined

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
        cartItems: validCartItems,
      },
    })

    await sendLeadNotification({ name, company, email, phone, message, source, cartItems: validCartItems })
    await sendLeadConfirmation({ name, email })

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('[API/leads]', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
