/**
 * Fixtures para desarrollar sin las api keys reales del CRM (CRM_MOCK=1).
 * Los shapes están copiados literalmente de los ejemplos de WARRANTY_API.md
 * y CLIENT_PORTAL_API.md — si cambia el contrato documentado, actualizar acá.
 *
 * Tokens de garantía disponibles: mock-pending, mock-active, mock-expired, mock-voided.
 * Cliente de portal: cualquier email/password loguea como mock-contact-1.
 */

import { getWorkshopMock } from './mock-workshop'

interface MockResponse {
  status: number
  data: unknown
}

const WARRANTY_STATUSES: Record<string, unknown> = {
  'mock-pending': {
    installationCode: 'LOT-20260705-0001-R003-I1',
    status: 'PENDING',
    product: { id: 'clyproduct1', name: 'KRYPTON 05', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: null,
  },
  'mock-active': {
    installationCode: 'LOT-20260705-0002-R001-I1',
    status: 'ACTIVE',
    product: { id: 'clyproduct2', name: 'KAISER 20', brand: 'Kristall' },
    isActive: true,
    daysRemaining: 342,
    expiresAt: '2027-07-05T00:00:00.000Z',
    assetType: 'VEHICLE',
  },
  'mock-expired': {
    installationCode: 'LOT-20250101-0001-R001-I1',
    status: 'EXPIRED',
    product: { id: 'clyproduct3', name: 'KLAR 30', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: '2026-01-01T00:00:00.000Z',
    assetType: 'VEHICLE',
  },
  'mock-voided': {
    installationCode: 'LOT-20260101-0001-R001-I1',
    status: 'VOIDED',
    product: { id: 'clyproduct4', name: 'PPF', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: null,
  },
}

const MOCK_CONTACT_ID = 'mock-contact-1'

const MOCK_CONTACT = {
  id: MOCK_CONTACT_ID,
  firstName: 'Juan',
  lastName: 'Pérez',
  name: 'Juan Pérez',
  company: 'Vidriería Sur',
  email: 'juan@example.com',
  phone: '+5491112345678',
  address: 'Av. Siempre Viva 123',
  city: 'Colón',
  state: 'Entre Ríos',
  purchases: [
    {
      id: 'clzpurchase1',
      saleNumber: '#1042',
      total: 150000,
      paymentStatus: 'PARTIAL',
      createdAt: '2026-06-01T00:00:00.000Z',
      items: [{ productName: 'KRYPTON 05', quantity: 3, unitPrice: 50000 }],
    },
    {
      id: 'clzpurchase2',
      saleNumber: '#1038',
      total: 80000,
      paymentStatus: 'PAID',
      createdAt: '2026-05-10T00:00:00.000Z',
      items: [{ productName: 'KAISER 20', quantity: 2, unitPrice: 40000 }],
    },
  ],
  payments: [
    { id: 'clp1', amount: 50000, method: 'TRANSFER', date: '2026-06-05T00:00:00.000Z', saleNumber: '#1042' },
    { id: 'clp2', amount: 80000, method: 'CASH', date: '2026-05-10T00:00:00.000Z', saleNumber: '#1038' },
  ],
  balance: 100000,
}

const MOCK_STOCK = [
  {
    id: 'clr1',
    fullRollCode: 'LOT-20260705-0001-R003',
    status: 'IN_USE',
    lot: { lotNumber: 'LOT-20260705-0001' },
    // maxInstallations: 1 a propósito — ya tiene 1 instalación generada, para probar el
    // camino de "este rollo ya no admite más instalaciones" sin necesitar estado mutable.
    product: { id: 'clp1', name: 'KRYPTON 05', sku: 'KR-05', warrantyConfig: { maxInstallations: 1 } },
    installations: [
      { id: 'cli1', installationCode: 'LOT-20260705-0001-R003-I1', status: 'ACTIVE', activatedAt: '2026-06-10T00:00:00.000Z', expiresAt: '2027-06-10T00:00:00.000Z' },
    ],
    _count: { installations: 1 },
  },
  {
    id: 'clr2',
    fullRollCode: 'LOT-20260705-0002-R001',
    status: 'SOLD',
    lot: { lotNumber: 'LOT-20260705-0002' },
    // maxInstallations: 3 con 0 generadas — para probar el camino exitoso de creación.
    product: { id: 'clp2', name: 'KAISER 20', sku: 'KA-20', warrantyConfig: { maxInstallations: 3 } },
    installations: [],
    _count: { installations: 0 },
  },
]

const MOCK_INSTALLATIONS = [
  {
    id: 'cli1',
    installationCode: 'LOT-20260705-0001-R003-I1',
    status: 'ACTIVE',
    assetType: 'VEHICLE',
    assetDescription: 'Toyota Corolla 2022',
    activatedAt: '2026-06-10T00:00:00.000Z',
    expiresAt: '2027-06-10T00:00:00.000Z',
    roll: { fullRollCode: 'LOT-20260705-0001-R003', product: { id: 'clp1', name: 'KRYPTON 05', sku: 'KR-05' } },
  },
  {
    id: 'cli2',
    installationCode: 'LOT-20260705-0002-R001-I1',
    status: 'PENDING',
    assetType: null,
    assetDescription: null,
    activatedAt: null,
    expiresAt: null,
    roll: { fullRollCode: 'LOT-20260705-0002-R001', product: { id: 'clp2', name: 'KAISER 20', sku: 'KA-20' } },
  },
]

const MOCK_CLAIMS = [
  {
    id: 'clc1',
    status: 'OPEN',
    description: 'Se despegó una esquina',
    createdAt: '2026-07-01T00:00:00.000Z',
    installation: { installationCode: 'LOT-20260705-0001-R003-I1', status: 'ACTIVE' },
  },
]

/**
 * Versión de credencial del mock. El CRM real la deriva de la contraseña; acá
 * alcanza con que sea estable, para que la cabecera viaje y el flujo se
 * ejercite igual en desarrollo.
 */
const MOCK_CREDENTIAL_VERSION = 'mock000credver00'

const MOCK_NOTIFICATIONS = [
  { id: 'cln1', type: 'NEW_PURCHASE', title: 'Nueva compra confirmada', message: 'Se confirmó tu compra #1042 por un total de $150000.', link: null, read: false, createdAt: '2026-07-09T00:00:00.000Z' },
  { id: 'clm1', type: 'WARRANTY_ACTIVATED', title: 'Garantía activada', message: 'Juan Pérez activó la garantía LOT-20260705-0001-R003-I1.', link: null, read: true, createdAt: '2026-07-08T00:00:00.000Z' },
  // El watcher de cuotas del CRM manda el deep link con el ancla ya puesta.
  { id: 'clo1', type: 'INSTALLMENT_OVERDUE', title: 'Tenés una cuota vencida', message: 'La cuota 2 del plan de la venta #1042 venció el 05/07/2026.', link: '/cliente/cuenta#cuota-inst2', read: false, createdAt: '2026-07-10T00:00:00.000Z' },
]

/**
 * Cuenta corriente (sección 4.9). Incluye a propósito los casos molestos:
 * un plan de cuotas con una vencida y otra parcial, y un sobrepago que deja el
 * saldo momentáneamente en negativo (saldo a favor).
 */
const MOCK_ACCOUNT = {
  summary: {
    balance: 690000,
    totalInvoiced: 1450000,
    totalPaid: 760000,
    overdueAmount: 120000,
    nextDueDate: '2026-08-15T12:00:00.000Z',
  },
  entries: [
    { id: 'clz1', date: '2026-04-24T00:00:00.000Z', type: 'SALE', description: 'Compra #1011', debit: 300000, credit: 0, balance: 300000, saleId: 'clz1' },
    { id: 'clp1', date: '2026-05-03T00:00:00.000Z', type: 'PAYMENT', description: 'Pago compra #1011', debit: 0, credit: 310000, balance: -10000, saleId: 'clz1' },
    { id: 'cla1', date: '2026-05-10T00:00:00.000Z', type: 'ADJUSTMENT', description: 'Nota de crédito por devolución', debit: 0, credit: 0, balance: -10000 },
    { id: 'clz2', date: '2026-06-01T00:00:00.000Z', type: 'SALE', description: 'Compra #1042', debit: 1150000, credit: 0, balance: 1140000, saleId: 'clz2' },
    { id: 'clp2', date: '2026-06-20T00:00:00.000Z', type: 'PAYMENT', description: 'Pago compra #1042', debit: 0, credit: 450000, balance: 690000, saleId: 'clz2' },
  ],
  plans: [
    {
      id: 'clplan1',
      saleId: 'clz2',
      saleNumber: 1042,
      installmentCount: 4,
      frequency: 'MONTHLY',
      financedTotal: 1150000,
      status: 'ACTIVE',
      installments: [
        { id: 'cli1', number: 1, dueDate: '2026-06-15T12:00:00.000Z', amount: 287500, paid: 287500, remaining: 0, status: 'PAID' },
        { id: 'cli2', number: 2, dueDate: '2026-07-15T12:00:00.000Z', amount: 287500, paid: 162500, remaining: 125000, status: 'OVERDUE' },
        { id: 'cli3', number: 3, dueDate: '2026-08-15T12:00:00.000Z', amount: 287500, paid: 0, remaining: 287500, status: 'PENDING' },
        { id: 'cli4', number: 4, dueDate: '2026-09-15T12:00:00.000Z', amount: 287500, paid: 0, remaining: 287500, status: 'PENDING' },
      ],
      nextDue: { id: 'cli2', number: 2, dueDate: '2026-07-15T12:00:00.000Z', amount: 287500, paid: 162500, remaining: 125000, status: 'OVERDUE' },
      overdueCount: 1,
    },
  ],
}

function match(path: string, pattern: RegExp): RegExpMatchArray | null {
  return path.match(pattern)
}

export function getMockResponse(path: string, method: string, body: unknown): MockResponse {
  // Mi Taller vive en su propio archivo: es un store mutable (altas, cambios de
  // estado, cobros) y mezclarlo con estas fixtures de solo lectura haria
  // ilegibles las dos cosas.
  const taller = getWorkshopMock(path, method, body)
  if (taller) return taller

  // --- Garantías (WARRANTY_API.md) ---
  let m = match(path, /^\/api\/public\/warranty\/([^/]+)$/)
  if (m && method === 'GET') {
    const status = WARRANTY_STATUSES[m[1]]
    return status ? { status: 200, data: status } : { status: 404, data: { error: 'Garantía no encontrada' } }
  }

  m = match(path, /^\/api\/public\/warranty\/([^/]+)\/activate$/)
  if (m && method === 'POST') {
    if (!WARRANTY_STATUSES[m[1]]) return { status: 404, data: { error: 'Garantía no encontrada' } }
    return { status: 200, data: { activated: true, expiresAt: '2027-07-09T00:00:00.000Z' } }
  }

  if (path === '/api/public/warranty/claims' && method === 'POST') {
    return { status: 201, data: { id: 'clzclaim1', status: 'OPEN' } }
  }

  m = match(path, /^\/api\/public\/warranty\/([^/]+)\/set-password$/)
  if (m && method === 'POST') {
    if (!WARRANTY_STATUSES[m[1]]) return { status: 404, data: { error: 'Garantía no encontrada' } }
    return { status: 200, data: { ok: true } }
  }

  if (path === '/api/public/warranty/login' && method === 'POST') {
    const { installationCode, password } = (body ?? {}) as { installationCode?: string; password?: string }
    if (installationCode === 'LOT-20260705-0002-R001-I1' && password) {
      return { status: 200, data: WARRANTY_STATUSES['mock-active'] }
    }
    return { status: 401, data: { error: 'Credenciales inválidas' } }
  }

  // --- Portal de Clientes (CLIENT_PORTAL_API.md) ---
  if (path === '/api/portal/v1/auth/login' && method === 'POST') {
    const { email, password } = (body ?? {}) as { email?: string; password?: string }
    if (email && password) {
      // Con un email que empiece en "basic" se loguea como nivel BASIC, para
      // poder probar el Panel Clientes sin las secciones de instalador.
      const accessLevel = email.startsWith('basic') ? 'BASIC' : 'INSTALLER'
      return {
        status: 200,
        data: { contactId: MOCK_CONTACT_ID, name: MOCK_CONTACT.name, company: MOCK_CONTACT.company, accessLevel, credentialVersion: MOCK_CREDENTIAL_VERSION },
      }
    }
    return { status: 401, data: { error: 'Credenciales inválidas' } }
  }

  // Alta de cuenta. Token de prueba: "mock-token" (cualquier otro da 404).
  if (path === '/api/portal/v1/auth/request-activation' && method === 'POST') {
    const { email } = (body ?? {}) as { email?: string }
    if (email === 'activa@ejemplo.com') {
      return { status: 200, data: { found: true, alreadyActive: true, message: 'Esta cuenta ya está activa. Iniciá sesión, o usá «Olvidé mi contraseña».' } }
    }
    if (email?.endsWith('@ejemplo.com')) {
      return { status: 200, data: { found: true, alreadyActive: false, message: 'Encontramos tu cuenta. Te mandamos un mail para que crees tu contraseña.' } }
    }
    return { status: 200, data: { found: false, message: 'No encontramos una cuenta de cliente con ese email. Escribinos y lo damos de alta.' } }
  }

  m = match(path, /^\/api\/portal\/v1\/auth\/activate$/)
  if (m && method === 'GET') return { status: 404, data: { error: 'El link no es válido.' } }
  if (path.startsWith('/api/portal/v1/auth/activate?') && method === 'GET') {
    const token = new URLSearchParams(path.split('?')[1]).get('token')
    if (token === 'mock-token') {
      return { status: 200, data: { valid: true, email: 'juan@example.com', name: MOCK_CONTACT.name, company: MOCK_CONTACT.company, whatsapp: '1125835244' } }
    }
    if (token === 'mock-token-sin-wsp') {
      return { status: 200, data: { valid: true, email: 'nuevo@example.com', name: 'Cliente Nuevo', company: null, whatsapp: null } }
    }
    return { status: 404, data: { error: 'El link no es válido.' } }
  }
  if (path === '/api/portal/v1/auth/activate' && method === 'POST') {
    const { token, password } = (body ?? {}) as { token?: string; password?: string }
    if (!token?.startsWith('mock-token')) return { status: 404, data: { error: 'El link no es válido.' } }
    if (!password || password.length < 8) return { status: 400, data: { error: 'Datos inválidos' } }
    return { status: 200, data: { contactId: MOCK_CONTACT_ID, name: MOCK_CONTACT.name, company: MOCK_CONTACT.company, accessLevel: 'BASIC', credentialVersion: MOCK_CREDENTIAL_VERSION } }
  }

  // Recuperación de contraseña. Respuesta genérica a propósito.
  if (path === '/api/portal/v1/auth/request-reset' && method === 'POST') {
    return { status: 200, data: { message: 'Si ese email tiene una cuenta, te mandamos un link para cambiar la contraseña.' } }
  }
  if (path.startsWith('/api/portal/v1/auth/reset?') && method === 'GET') {
    const token = new URLSearchParams(path.split('?')[1]).get('token')
    return token === 'mock-token'
      ? { status: 200, data: { valid: true, email: 'juan@example.com' } }
      : { status: 404, data: { error: 'El link no es válido.' } }
  }
  if (path === '/api/portal/v1/auth/reset' && method === 'POST') {
    const { token, password } = (body ?? {}) as { token?: string; password?: string }
    if (token !== 'mock-token') return { status: 404, data: { error: 'El link no es válido.' } }
    if (!password || password.length < 8) return { status: 400, data: { error: 'Datos inválidos' } }
    return { status: 200, data: { ok: true, message: 'Listo. Ya podés iniciar sesión.' } }
  }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)$/)
  if (m && method === 'GET') {
    return m[1] === MOCK_CONTACT_ID ? { status: 200, data: MOCK_CONTACT } : { status: 404, data: { error: 'Cliente no encontrado' } }
  }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/stock$/)
  if (m && method === 'GET') return { status: 200, data: m[1] === MOCK_CONTACT_ID ? MOCK_STOCK : [] }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/rolls\/([^/]+)\/installations$/)
  if (m && method === 'POST') {
    if (m[1] !== MOCK_CONTACT_ID) return { status: 404, data: { error: 'Cliente no encontrado' } }
    const roll = MOCK_STOCK.find((r) => r.fullRollCode === m![2])
    if (!roll) return { status: 404, data: { error: 'Rollo no encontrado' } }
    if (roll.status === 'VOIDED' || roll.status === 'EXHAUSTED') {
      return { status: 400, data: { error: 'Este rollo ya no admite más instalaciones' } }
    }
    const max = roll.product.warrantyConfig?.maxInstallations ?? 15
    if (roll.installations.length >= max) {
      return { status: 400, data: { error: 'Este rollo ya no admite más instalaciones' } }
    }
    const installationNumber = roll.installations.length + 1
    const willBeExhausted = installationNumber >= max
    const installationCode = `${roll.fullRollCode}-I${installationNumber}`
    // La instalación recién creada tiene que aparecer también en 4.3: send-email
    // valida la pertenencia contra esa lista y si no está devuelve 403.
    if (!MOCK_INSTALLATIONS.some((i) => i.installationCode === installationCode)) {
      MOCK_INSTALLATIONS.push({
        id: `cli-mock-${installationNumber}`,
        installationCode,
        status: 'PENDING',
        assetType: null,
        assetDescription: null,
        activatedAt: null,
        expiresAt: null,
        roll: { fullRollCode: roll.fullRollCode, product: roll.product },
      })
    }
    return {
      status: 201,
      data: {
        id: `cli-mock-${installationNumber}`,
        installationNumber,
        installationCode,
        activationToken: `mock-created-${roll.id}-${installationNumber}`,
        status: 'PENDING',
        rollStatus: willBeExhausted ? 'EXHAUSTED' : 'IN_USE',
      },
    }
  }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/installations$/)
  if (m && method === 'GET') return { status: 200, data: m[1] === MOCK_CONTACT_ID ? MOCK_INSTALLATIONS : [] }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/claims$/)
  if (m && method === 'GET') return { status: 200, data: m[1] === MOCK_CONTACT_ID ? MOCK_CLAIMS : [] }
  if (m && method === 'POST') return { status: 201, data: { id: 'clcnew1', status: 'OPEN' } }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/notifications$/)
  if (m && method === 'GET') return { status: 200, data: m[1] === MOCK_CONTACT_ID ? MOCK_NOTIFICATIONS : [] }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/notifications\/([^/]+)\/read$/)
  if (m && method === 'PATCH') return { status: 200, data: { ok: true } }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/account$/)
  if (m && method === 'GET') {
    return m[1] === MOCK_CONTACT_ID
      ? { status: 200, data: MOCK_ACCOUNT }
      : { status: 404, data: { error: 'Cliente no encontrado' } }
  }

  return { status: 404, data: { error: `Mock no implementado para ${method} ${path}` } }
}
