/**
 * Fixtures de Mi Taller para `CRM_MOCK=1`.
 *
 * A diferencia del resto de `mock-data.ts`, esto es un store **mutable en
 * memoria**: el módulo de taller es todo altas y cambios de estado, y unas
 * fixtures de solo lectura no dejarían probar el flujo completo (crear una
 * orden, empezarla, terminarla, cobrarla). Se pierde en cada reinicio del
 * server, que para desarrollar es exactamente lo que uno quiere.
 *
 * **Ojo con la trampa de siempre** (ya documentada para F0-1 y F0-2): el mock
 * devuelve el contrato tal como está escrito. Que algo ande acá no prueba nada
 * sobre el CRM real — prueba que la pantalla consume bien el contrato.
 *
 * La máquina de estados sí está replicada de verdad, porque es la regla que la
 * UI tiene que respetar y conviene poder probar los rechazos sin el CRM.
 */

type Estado =
  | 'PRESUPUESTADA'
  | 'AGENDADA'
  | 'EN_PROCESO'
  | 'TERMINADA'
  | 'ENTREGADA'
  | 'CANCELADA'

const TRANSICIONES: Record<Estado, Estado[]> = {
  PRESUPUESTADA: ['AGENDADA', 'EN_PROCESO', 'TERMINADA', 'CANCELADA'],
  AGENDADA: ['PRESUPUESTADA', 'EN_PROCESO', 'TERMINADA', 'CANCELADA'],
  EN_PROCESO: ['PRESUPUESTADA', 'AGENDADA', 'TERMINADA', 'CANCELADA'],
  TERMINADA: ['ENTREGADA'],
  ENTREGADA: [],
  CANCELADA: [],
}

interface MockCliente {
  id: string
  name: string
  email: string | null
  phone: string | null
  dni: string | null
  address: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

interface MockAsset {
  id: string
  workshopClientId: string
  type: 'VEHICLE' | 'WINDOW' | 'BUILDING' | 'OTHER'
  identifier: string | null
  brand: string | null
  model: string | null
  year: number | null
  color: string | null
  notes: string | null
  createdAt: string
}

interface MockLinea {
  id: string
  description: string
  squareMetersUsed: string | null
  price: string | null
  productId: string | null
  rollId: string | null
}

interface MockCobro {
  id: string
  amount: string
  currency: 'ARS' | 'USD'
  method: string | null
  reference: string | null
  notes: string | null
  paidAt: string
}

interface MockOrden {
  id: string
  orderNumber: number
  status: Estado
  workshopClientId: string
  assetId: string | null
  scheduledAt: string | null
  startedAt: string | null
  finishedAt: string | null
  deliveredAt: string | null
  cancelledAt: string | null
  priceQuoted: string | null
  priceFinal: string | null
  currency: 'ARS' | 'USD'
  notes: string | null
  createdAt: string
  items: MockLinea[]
  payments: MockCobro[]
  /** La garantía principal, cuando la orden ya se terminó. */
  warrantyInstallationCode?: string
  warrantyExpiresAt?: string
}

/** Rollos del mock de stock, con medidas, para poder calcular m². */
const ROLLOS = [
  {
    id: 'clr-mock-1',
    fullRollCode: 'LOT-20260705-0001-R003',
    status: 'SOLD',
    lot: { lotNumber: 'LOT-20260705-0001' },
    product: {
      id: 'clp1',
      name: 'KRYPTON 05',
      sku: 'KR-05',
      category: 'AUTOMOTIVE',
      width: '1.52',
      length: '30',
      warrantyConfig: { maxInstallations: 15, installWarrantyMonths: 60, warrantyEnabled: true },
    },
    installations: [
      {
        id: 'cli-mock-1',
        installationCode: 'LOT-20260705-0001-R003-I1',
        status: 'PENDING',
        activatedAt: null,
        expiresAt: null,
        vehicleType: 'SEDAN',
        plate: 'AB123CD',
      },
    ],
    _count: { installations: 0 },
  },
  {
    id: 'clr-mock-2',
    fullRollCode: 'LOT-20260705-0002-R001',
    status: 'IN_USE',
    lot: { lotNumber: 'LOT-20260705-0002' },
    product: {
      id: 'clp2',
      name: 'KAISER 20',
      sku: 'KA-20',
      category: 'AUTOMOTIVE',
      // Sin medidas cargadas a propósito: es el caso que hace que totalM2 y
      // remainingM2 sean null y la pantalla tenga que decir "no sé", no "0".
      width: null,
      length: null,
      warrantyConfig: { maxInstallations: 15, installWarrantyMonths: 60, warrantyEnabled: true },
    },
    installations: [],
    _count: { installations: 0 },
  },
]

const hoy = new Date()
const enHoras = (h: number) => {
  const d = new Date(hoy)
  d.setHours(hoy.getHours() + h, 0, 0, 0)
  return d.toISOString()
}
const haceDias = (d: number) => {
  const x = new Date(hoy)
  x.setDate(x.getDate() - d)
  return x.toISOString()
}

/**
 * El store va en `globalThis` y no en variables de módulo.
 *
 * En dev, Next arma un grafo de módulos por ruta: `POST /clients` y
 * `POST /clients/:id/assets` terminaban con **dos copias distintas** de estos
 * arrays, así que un cliente recién creado no existía para la llamada
 * siguiente y todo daba 404. Es el mismo motivo por el que el cliente de Prisma
 * es un singleton colgado de globalThis.
 */
interface MockStore {
  clientes: MockCliente[]
  assets: MockAsset[]
  ordenes: MockOrden[]
  proximoNumero: number
  secuencia: number
}

const g = globalThis as unknown as { __workshopMock?: MockStore }

/** Cuántos sub-códigos ya emitió cada rollo, para poder agotarlo. */
const garantiasEmitidas = new Map<string, number>()

const semillaClientes: MockCliente[] = [
  {
    id: 'clw-mock-1', name: 'Juan del Barrio', email: 'juan@ejemplo.invalid', phone: '099111222',
    dni: '4.123.456-7', address: null, notes: null, createdAt: haceDias(40), updatedAt: haceDias(40),
  },
  {
    id: 'clw-mock-2', name: 'Transporte del Sur SRL', email: null, phone: '099333444',
    dni: null, address: 'Ruta 8 km 24', notes: 'Flota de 6 camionetas.', createdAt: haceDias(20), updatedAt: haceDias(20),
  },
]

const semillaAssets: MockAsset[] = [
  { id: 'cla-mock-1', workshopClientId: 'clw-mock-1', type: 'VEHICLE', identifier: 'AB 123 CD', brand: 'Toyota', model: 'Corolla', year: 2022, color: 'Gris', notes: null, createdAt: haceDias(40) },
  { id: 'cla-mock-2', workshopClientId: 'clw-mock-1', type: 'VEHICLE', identifier: 'SBB 4412', brand: 'Chevrolet', model: 'Onix', year: 2019, color: 'Blanco', notes: null, createdAt: haceDias(10) },
  { id: 'cla-mock-3', workshopClientId: 'clw-mock-2', type: 'VEHICLE', identifier: 'STA 9901', brand: 'Fiat', model: 'Fiorino', year: 2021, color: 'Blanco', notes: null, createdAt: haceDias(20) },
]

const semillaOrdenes: MockOrden[] = [
  {
    id: 'clo-mock-1', orderNumber: 1, status: 'ENTREGADA', workshopClientId: 'clw-mock-1',
    assetId: 'cla-mock-1', scheduledAt: haceDias(12), startedAt: haceDias(12), finishedAt: haceDias(12),
    deliveredAt: haceDias(11), cancelledAt: null, priceQuoted: '30000', priceFinal: '28000',
    currency: 'ARS', notes: null, createdAt: haceDias(14),
    items: [{ id: 'cli-l1', description: 'Parabrisas y laterales', squareMetersUsed: '4.5', price: '28000', productId: 'clp1', rollId: 'clr-mock-1' }],
    payments: [{ id: 'clp-p1', amount: '28000', currency: 'ARS', method: 'efectivo', reference: null, notes: null, paidAt: haceDias(11) }],
  },
  {
    id: 'clo-mock-2', orderNumber: 2, status: 'EN_PROCESO', workshopClientId: 'clw-mock-2',
    assetId: 'cla-mock-3', scheduledAt: enHoras(-2), startedAt: enHoras(-1), finishedAt: null,
    deliveredAt: null, cancelledAt: null, priceQuoted: '45000', priceFinal: null,
    currency: 'ARS', notes: 'Lleva luneta también.', createdAt: haceDias(3),
    items: [{ id: 'cli-l2', description: 'Laterales + luneta', squareMetersUsed: '3.2', price: '45000', productId: 'clp1', rollId: 'clr-mock-1' }],
    payments: [{ id: 'clp-p2', amount: '20000', currency: 'ARS', method: 'transferencia', reference: null, notes: 'Seña', paidAt: haceDias(3) }],
  },
  {
    id: 'clo-mock-3', orderNumber: 3, status: 'AGENDADA', workshopClientId: 'clw-mock-1',
    assetId: 'cla-mock-2', scheduledAt: enHoras(4), startedAt: null, finishedAt: null,
    deliveredAt: null, cancelledAt: null, priceQuoted: '22000', priceFinal: null,
    currency: 'ARS', notes: null, createdAt: haceDias(1),
    items: [], payments: [],
  },
  {
    id: 'clo-mock-4', orderNumber: 4, status: 'PRESUPUESTADA', workshopClientId: 'clw-mock-2',
    assetId: null, scheduledAt: null, startedAt: null, finishedAt: null,
    deliveredAt: null, cancelledAt: null, priceQuoted: '60000', priceFinal: null,
    currency: 'ARS', notes: 'Presupuesto por teléfono, falta confirmar.', createdAt: haceDias(0),
    items: [], payments: [],
  },
]

const store: MockStore = (g.__workshopMock ??= {
  clientes: semillaClientes,
  assets: semillaAssets,
  ordenes: semillaOrdenes,
  proximoNumero: 5,
  secuencia: 0,
})

const { clientes, assets, ordenes } = store
const nuevoId = (p: string) => `${p}-mock-nuevo-${++store.secuencia}`

// ─── Proyecciones ────────────────────────────────────────────────────────────

const cliente = (id: string) => clientes.find((c) => c.id === id)
const asset = (id: string | null) => (id ? (assets.find((a) => a.id === id) ?? null) : null)

function conteos(c: MockCliente) {
  return {
    ...c,
    _count: {
      assets: assets.filter((a) => a.workshopClientId === c.id).length,
      workOrders: ordenes.filter((o) => o.workshopClientId === c.id).length,
    },
  }
}

function listItem(o: MockOrden) {
  const c = cliente(o.workshopClientId)
  const a = asset(o.assetId)
  return {
    id: o.id, orderNumber: o.orderNumber, status: o.status,
    scheduledAt: o.scheduledAt, startedAt: o.startedAt, finishedAt: o.finishedAt,
    deliveredAt: o.deliveredAt, cancelledAt: o.cancelledAt,
    priceQuoted: o.priceQuoted, priceFinal: o.priceFinal, currency: o.currency,
    createdAt: o.createdAt,
    workshopClient: c ? { id: c.id, name: c.name, phone: c.phone } : null,
    asset: a ? { id: a.id, type: a.type, identifier: a.identifier, brand: a.brand, model: a.model } : null,
  }
}

function detalle(o: MockOrden) {
  const c = cliente(o.workshopClientId)!
  return {
    ...listItem(o),
    notes: o.notes,
    workshopClient: c,
    asset: asset(o.assetId),
    items: o.items.map((i) => ({
      id: i.id, description: i.description, squareMetersUsed: i.squareMetersUsed, price: i.price,
      product: i.productId ? { id: i.productId, name: ROLLOS.find((r) => r.product.id === i.productId)?.product.name ?? 'Lámina', sku: null } : null,
      roll: i.rollId ? { id: i.rollId, fullRollCode: ROLLOS.find((r) => r.id === i.rollId)?.fullRollCode ?? i.rollId } : null,
    })),
    payments: o.payments,
    warrantyInstallation: o.warrantyInstallationCode
      ? {
          id: `cli-${o.warrantyInstallationCode}`,
          installationCode: o.warrantyInstallationCode,
          status: 'ACTIVE',
          expiresAt: o.warrantyExpiresAt ?? null,
        }
      : null,
  }
}

function stock() {
  const sumar = (estados: Estado[], rollId: string) =>
    ordenes
      .filter((o) => estados.includes(o.status))
      .flatMap((o) => o.items)
      .filter((i) => i.rollId === rollId)
      .reduce((s, i) => s + Number(i.squareMetersUsed ?? 0), 0)
  const redondear = (n: number) => Math.round(n * 100) / 100

  return ROLLOS.map((r) => {
    // Consumido = lo que ya se cortó. Reservado = lo comprometido y sin cortar.
    // Mismo criterio que getWorkshopStock en el CRM.
    const usado = sumar(['TERMINADA', 'ENTREGADA'], r.id)
    const reservado = sumar(['PRESUPUESTADA', 'AGENDADA', 'EN_PROCESO'], r.id)
    const total =
      r.product.width && r.product.length
        ? Number(r.product.width) * Number(r.product.length)
        : null
    return {
      ...r,
      totalM2: total,
      usedM2: redondear(usado),
      reservedM2: redondear(reservado),
      remainingM2: total === null ? null : redondear(total - usado),
      availableM2: total === null ? null : redondear(total - usado - reservado),
    }
  })
}

/**
 * Los efectos de terminar una orden: una garantía por cada rollo usado, y el
 * mail. Replica lo que hace el CRM (src/lib/workshop-warranty.ts) para que la
 * pantalla se pueda probar sin él — incluidos los casos feos, que son los que
 * importa ver: el rollo agotado y el cliente sin email.
 */
function terminar(o: MockOrden) {
  const porRollo = new Map<string, number>()
  for (const i of o.items) {
    if (!i.rollId) continue
    porRollo.set(i.rollId, (porRollo.get(i.rollId) ?? 0) + Number(i.squareMetersUsed ?? 0))
  }
  const ordenados = [...porRollo.entries()].sort((a, b) => b[1] - a[1])

  const garantias: { installationCode: string; fullRollCode: string; expiresAt: string }[] = []
  const problemas: { fullRollCode: string; motivo: string }[] = []

  const vence = new Date()
  vence.setFullYear(vence.getFullYear() + 1)

  for (const [rollId] of ordenados) {
    const rollo = ROLLOS.find((r) => r.id === rollId)
    if (!rollo) {
      problemas.push({ fullRollCode: rollId, motivo: 'El rollo ya no figura como tuyo' })
      continue
    }
    const max = rollo.product.warrantyConfig?.maxInstallations ?? 15
    const usadas = garantiasEmitidas.get(rollo.id) ?? 0
    if (usadas >= max) {
      problemas.push({ fullRollCode: rollo.fullRollCode, motivo: 'El rollo no admite más instalaciones' })
      continue
    }
    garantiasEmitidas.set(rollo.id, usadas + 1)
    garantias.push({
      installationCode: `${rollo.fullRollCode}-I${usadas + 1}`,
      fullRollCode: rollo.fullRollCode,
      expiresAt: vence.toISOString(),
    })
  }

  if (garantias.length > 0) {
    o.warrantyInstallationCode = garantias[0].installationCode
    o.warrantyExpiresAt = garantias[0].expiresAt
  }

  const cliente = clientes.find((c) => c.id === o.workshopClientId)
  const mail =
    garantias.length === 0
      ? { enviado: false, motivo: 'No se generó ninguna garantía' }
      : cliente?.email
        ? { enviado: true }
        : { enviado: false, motivo: 'El cliente no tiene email cargado' }

  return { garantias, problemas, mail }
}

// ─── Router ──────────────────────────────────────────────────────────────────

type Resp = { status: number; data: unknown }
const noEncontrado = (que: string): Resp => ({ status: 404, data: { error: `${que} no encontrado` } })

/** Devuelve null si el path no es de taller, para que el mock general siga. */
export function getWorkshopMock(path: string, method: string, body: unknown): Resp | null {
  const m = path.match(/^\/api\/portal\/v1\/contacts\/[^/]+\/workshop(\/.*)?$/)
  if (!m) return null
  const ruta = (m[1] ?? '').split('?')[0]
  const query = new URLSearchParams(path.split('?')[1] ?? '')
  const b = (body ?? {}) as Record<string, never>

  if (ruta === '/clients' && method === 'GET') {
    const search = query.get('search')?.toLowerCase()
    const lista = clientes.filter(
      (c) => !search || `${c.name} ${c.phone ?? ''} ${c.email ?? ''}`.toLowerCase().includes(search)
    )
    return { status: 200, data: lista.map(conteos) }
  }

  if (ruta === '/clients' && method === 'POST') {
    const nuevo: MockCliente = {
      id: nuevoId('clw'), name: String(b.name ?? 'Sin nombre'),
      email: (b.email as string) ?? null, phone: (b.phone as string) ?? null,
      dni: (b.dni as string) ?? null, address: (b.address as string) ?? null,
      notes: (b.notes as string) ?? null,
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    }
    clientes.push(nuevo)
    return { status: 201, data: nuevo }
  }

  let r = ruta.match(/^\/clients\/([^/]+)$/)
  if (r) {
    const c = cliente(r[1])
    if (!c) return noEncontrado('Cliente')
    if (method === 'GET') {
      return {
        status: 200,
        data: {
          ...conteos(c),
          assets: assets
            .filter((a) => a.workshopClientId === c.id)
            .map((a) => ({
              ...a,
              _count: { workOrders: ordenes.filter((o) => o.assetId === a.id).length },
            })),
        },
      }
    }
    if (method === 'PATCH') {
      Object.assign(c, b, { updatedAt: new Date().toISOString() })
      return { status: 200, data: conteos(c) }
    }
    if (method === 'DELETE') {
      if (ordenes.some((o) => o.workshopClientId === c.id)) {
        return { status: 409, data: { error: 'Este cliente tiene órdenes de trabajo y no se puede borrar' } }
      }
      clientes.splice(clientes.indexOf(c), 1)
      return { status: 200, data: { ok: true } }
    }
  }

  r = ruta.match(/^\/clients\/([^/]+)\/assets$/)
  if (r) {
    const c = cliente(r[1])
    if (!c) return noEncontrado('Cliente')
    if (method === 'GET') {
      return {
        status: 200,
        data: assets
          .filter((a) => a.workshopClientId === c.id)
          .map((a) => ({ ...a, _count: { workOrders: ordenes.filter((o) => o.assetId === a.id).length } })),
      }
    }
    if (method === 'POST') {
      const nuevo: MockAsset = {
        id: nuevoId('cla'), workshopClientId: c.id,
        type: (b.type as MockAsset['type']) ?? 'VEHICLE',
        identifier: (b.identifier as string) ?? null, brand: (b.brand as string) ?? null,
        model: (b.model as string) ?? null, year: (b.year as number) ?? null,
        color: (b.color as string) ?? null, notes: (b.notes as string) ?? null,
        createdAt: new Date().toISOString(),
      }
      assets.push(nuevo)
      return { status: 201, data: nuevo }
    }
  }

  if (ruta === '/orders' && method === 'GET') {
    const status = query.get('status')
    const clientId = query.get('clientId')
    const lista = ordenes.filter(
      (o) => (!status || o.status === status) && (!clientId || o.workshopClientId === clientId)
    )
    return { status: 200, data: lista.map(listItem) }
  }

  if (ruta === '/orders' && method === 'POST') {
    if (!cliente(String(b.workshopClientId))) return noEncontrado('Cliente')
    const scheduledAt = (b.scheduledAt as string) ?? null
    const nueva: MockOrden = {
      id: nuevoId('clo'), orderNumber: store.proximoNumero++,
      status: scheduledAt ? 'AGENDADA' : 'PRESUPUESTADA',
      workshopClientId: String(b.workshopClientId), assetId: (b.assetId as string) ?? null,
      scheduledAt, startedAt: null, finishedAt: null, deliveredAt: null, cancelledAt: null,
      priceQuoted: b.priceQuoted != null ? String(b.priceQuoted) : null,
      priceFinal: null, currency: (b.currency as 'ARS' | 'USD') ?? 'ARS',
      notes: (b.notes as string) ?? null, createdAt: new Date().toISOString(),
      items: ((b.items as unknown as MockLinea[]) ?? []).map((i, n) => ({
        id: `${nuevoId('cli')}-${n}`, description: i.description,
        squareMetersUsed: i.squareMetersUsed != null ? String(i.squareMetersUsed) : null,
        price: i.price != null ? String(i.price) : null,
        productId: i.productId ?? null, rollId: i.rollId ?? null,
      })),
      payments: [],
    }
    ordenes.unshift(nueva)
    return { status: 201, data: detalle(nueva) }
  }

  r = ruta.match(/^\/orders\/([^/]+)$/)
  if (r) {
    const o = ordenes.find((x) => x.id === r![1])
    if (!o) return noEncontrado('Orden')
    if (method === 'GET') return { status: 200, data: detalle(o) }
    if (method === 'PATCH') {
      if (o.status === 'ENTREGADA' || o.status === 'CANCELADA') {
        return { status: 409, data: { error: 'Esta orden ya está cerrada' } }
      }
      Object.assign(o, b)
      return { status: 200, data: detalle(o) }
    }
  }

  r = ruta.match(/^\/orders\/([^/]+)\/transition$/)
  if (r && method === 'POST') {
    const o = ordenes.find((x) => x.id === r![1])
    if (!o) return noEncontrado('Orden')
    const to = b.to as unknown as Estado
    if (o.status === to) return { status: 409, data: { error: `La orden ya está en ${to}` } }
    if (!TRANSICIONES[o.status].includes(to)) {
      return { status: 409, data: { error: `No se puede pasar de ${o.status} a ${to}` } }
    }
    if (to === 'TERMINADA' && !o.assetId) {
      return { status: 400, data: { error: 'Cargá el vehículo antes de terminar la orden' } }
    }
    const ahora = new Date().toISOString()
    o.status = to
    if (to === 'EN_PROCESO' && !o.startedAt) o.startedAt = ahora
    if (to === 'TERMINADA' && !o.finishedAt) o.finishedAt = ahora
    if (to === 'ENTREGADA' && !o.deliveredAt) o.deliveredAt = ahora
    if (to === 'CANCELADA' && !o.cancelledAt) o.cancelledAt = ahora
    if (b.priceFinal != null) o.priceFinal = String(b.priceFinal)

    if (to !== 'TERMINADA') return { status: 200, data: detalle(o) }
    return { status: 200, data: { ...detalle(o), efectos: terminar(o) } }
  }

  r = ruta.match(/^\/orders\/([^/]+)\/payments$/)
  if (r && method === 'POST') {
    const o = ordenes.find((x) => x.id === r![1])
    if (!o) return noEncontrado('Orden')
    if (o.status === 'CANCELADA') return { status: 409, data: { error: 'Esta orden está cancelada' } }
    const pago: MockCobro = {
      id: nuevoId('clp'), amount: String(b.amount), currency: (b.currency as 'ARS' | 'USD') ?? o.currency,
      method: (b.method as string) ?? null, reference: (b.reference as string) ?? null,
      notes: (b.notes as string) ?? null, paidAt: new Date().toISOString(),
    }
    o.payments.unshift(pago)
    return { status: 201, data: pago }
  }

  r = ruta.match(/^\/orders\/([^/]+)\/warranty-email$/)
  if (r && method === 'POST') {
    const o = ordenes.find((x) => x.id === r![1])
    if (!o) return noEncontrado('Orden')
    if (!o.warrantyInstallationCode) {
      return { status: 409, data: { error: 'Esta orden todavía no generó ninguna garantía' } }
    }
    const cliente = clientes.find((c) => c.id === o.workshopClientId)
    const destinatario = (b.email as string) ?? cliente?.email
    if (!destinatario) {
      return {
        status: 400,
        data: { error: 'Este cliente no tiene email cargado. Cargalo o escribí uno acá.' },
      }
    }
    return { status: 200, data: { enviado: true, destinatario } }
  }

  if (ruta === '/agenda' && method === 'GET') {
    const from = new Date(query.get('from') ?? '')
    const to = new Date(query.get('to') ?? '')
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
      return { status: 400, data: { error: 'from y to son requeridos, en formato ISO' } }
    }
    const lista = ordenes
      .filter((o) => o.status !== 'CANCELADA' && o.scheduledAt)
      .filter((o) => {
        const d = new Date(o.scheduledAt!)
        return d >= from && d <= to
      })
      .map((o) => {
        const item = listItem(o)
        return {
          id: item.id, orderNumber: item.orderNumber, status: item.status,
          scheduledAt: o.scheduledAt, workshopClient: item.workshopClient, asset: item.asset,
        }
      })
    return { status: 200, data: lista }
  }

  if (ruta === '/stock' && method === 'GET') return { status: 200, data: stock() }

  if (ruta === '/summary' && method === 'GET') {
    const inicio = new Date()
    inicio.setHours(0, 0, 0, 0)
    const fin = new Date(inicio)
    fin.setDate(fin.getDate() + 1)

    const delMes = ordenes.filter(
      (o) => (o.status === 'TERMINADA' || o.status === 'ENTREGADA') && o.finishedAt
    )
    const facturado = delMes.reduce((s, o) => s + Number(o.priceFinal ?? 0), 0)
    // Los cobros DE ESAS órdenes, no todos: si se cuentan todos, una seña sobre
    // un trabajo sin terminar hace que "por cobrar" dé negativo. Mismo criterio
    // que getWorkshopSummary en el CRM.
    const cobrado = delMes.flatMap((o) => o.payments).reduce((s, p) => s + Number(p.amount), 0)

    const porEstado = Object.fromEntries(
      (Object.keys(TRANSICIONES) as Estado[]).map((e) => [e, ordenes.filter((o) => o.status === e).length])
    )

    return {
      status: 200,
      data: {
        hoy: {
          turnos: ordenes.filter(
            (o) => o.status !== 'CANCELADA' && o.scheduledAt && new Date(o.scheduledAt) >= inicio && new Date(o.scheduledAt) < fin
          ).length,
          enProceso: ordenes.filter((o) => o.status === 'EN_PROCESO').length,
        },
        ordenes: porEstado,
        periodo: {
          desde: inicio.toISOString(), hasta: fin.toISOString(),
          terminadas: delMes.length, facturado, cobrado,
          porCobrar: Math.round((facturado - cobrado) * 100) / 100,
          metrosCuadrados: delMes
            .flatMap((o) => o.items)
            .reduce((s, i) => s + Number(i.squareMetersUsed ?? 0), 0),
        },
      },
    }
  }

  return { status: 404, data: { error: `Mock de taller no implementado para ${method} ${ruta}` } }
}
