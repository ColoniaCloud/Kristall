import { NextRequest, NextResponse } from 'next/server'
import { getClientSession } from '@/lib/client-portal/session'
import { getPaymentDeclarations, declarePayment, type DeclarePaymentInput } from '@/lib/client-portal/api'
import { crmErrorResponse } from '@/lib/crm/api'

export async function GET() {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  try {
    return NextResponse.json(await getPaymentDeclarations(session.contactId))
  } catch (err) {
    return crmErrorResponse(err)
  }
}

const METODOS: DeclarePaymentInput['method'][] = ['TRANSFER', 'CASH', 'OTHER']

export async function POST(request: NextRequest) {
  const session = await getClientSession()
  if (!session) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const { saleId, amount, method, reference, notes, receipt, receiptMimeType } = body ?? {}

  if (!saleId || typeof saleId !== 'string') {
    return NextResponse.json({ error: 'Falta la venta' }, { status: 400 })
  }
  const monto = Number(amount)
  if (!Number.isFinite(monto) || monto <= 0) {
    return NextResponse.json({ error: 'El monto tiene que ser mayor a cero' }, { status: 400 })
  }
  if (!METODOS.includes(method)) {
    return NextResponse.json({ error: 'Método de pago inválido' }, { status: 400 })
  }
  if (receipt && typeof receipt !== 'string') {
    return NextResponse.json({ error: 'Comprobante inválido' }, { status: 400 })
  }

  try {
    const declaracion = await declarePayment(session.contactId, {
      saleId,
      amount: monto,
      method,
      reference: typeof reference === 'string' ? reference.trim() || undefined : undefined,
      notes: typeof notes === 'string' ? notes.trim() || undefined : undefined,
      receipt: receipt || undefined,
      receiptMimeType: receipt ? receiptMimeType : undefined,
    })
    return NextResponse.json(declaracion, { status: 201 })
  } catch (err) {
    return crmErrorResponse(err)
  }
}
