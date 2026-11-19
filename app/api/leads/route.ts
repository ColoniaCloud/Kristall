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

    // Un único valor de fuente para la base Y para el mail. Antes el mail
    // recibía el `source` crudo del body: si el pedido no traía el campo,
    // `escapeHtml(undefined)` tiraba el envío y el lead quedaba guardado sin que
    // nadie se enterara. Los formularios del sitio lo mandan siempre, así que el
    // agujero solo se veía desde afuera.
    const fuente = typeof source === 'string' && source.trim() ? source : 'contacto'

    const payload = await getPayload({ config })

    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        company,
        email,
        phone,
        message,
        source: fuente,
        status: 'nuevo',
        cartItems: validCartItems,
      },
    })

    // El lead ya quedó guardado en este punto. Si el envío de los mails
    // falla (Resend caído, dominio del lead inválido, etc.), no queremos
    // que el visitante vea un error y reintente generando un lead duplicado.
    try {
      await sendLeadNotification({ name, company, email, phone, message, source: fuente, cartItems: validCartItems })
      await sendLeadConfirmation({ name, email })
    } catch (emailError) {
      console.error('[API/leads] lead guardado pero falló el envío de email', lead.id, emailError)
    }

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('[API/leads]', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
