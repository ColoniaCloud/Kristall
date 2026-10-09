/**
 * Fixtures para desarrollar sin las api keys reales del CRM (CRM_MOCK=1).
 * Los shapes están copiados literalmente de los ejemplos de WARRANTY_API.md
 * y CLIENT_PORTAL_API.md — si cambia el contrato documentado, actualizar acá.
 *
 * Tokens de garantía disponibles: mock-pending, mock-active, mock-expired, mock-voided,
 * y de arquitectura mock-pending-arq (con la obra precargada) y mock-pending-arq-vacia.
 * Cliente de portal: cualquier email/password loguea como mock-contact-1.
 */

import { getWorkshopMock } from './mock-workshop'
import type { Installation, ProductCategory } from '@/lib/client-portal/api'
import type { DatosObra } from '@/lib/obra'

interface MockResponse {
  status: number
  data: unknown
}

const WARRANTY_STATUSES: Record<string, unknown> = {
  // Arquitectura con la obra precargada por el taller. La dirección llega
  // recortada, como la devuelve el CRM en este endpoint público.
  'mock-pending-arq': {
    installationCode: 'LOT-20260801-0003-R002-I1',
    status: 'PENDING',
    product: { id: 'clyproduct5', name: 'SILVER 20 ARQ', brand: 'Kristall' },
    productCategory: 'ARCHITECTURAL',
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: 'BUILDING',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: null,
    plate: null,
    clientEmail: 'cliente@ejemplo.com',
    warrantyMonths: 120,
    siteAddress: 'Av. Córdoba, CABA',
    areaM2: 18.5,
    paneCount: 6,
    glassType: 'DVH',
    filmSide: 'INTERIOR',
    buildingUse: 'COMMERCIAL',
  },
  // Arquitectura activa: el reclamo ofrece la rotura del vidrio y los paños.
  'mock-active-arq': {
    installationCode: 'LOT-20260801-0003-R002-I1',
    status: 'ACTIVE',
    product: { id: 'clyproduct5', name: 'SILVER 20 ARQ', brand: 'Kristall' },
    productCategory: 'ARCHITECTURAL',
    isActive: true,
    daysRemaining: 3600,
    expiresAt: '2036-08-12T00:00:00.000Z',
    assetType: 'BUILDING',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: null,
    plate: null,
    clientEmail: 'cliente@ejemplo.com',
    warrantyMonths: 120,
    siteAddress: 'Av. Córdoba, CABA',
    areaM2: 18.5,
    paneCount: 6,
    glassType: 'DVH',
    filmSide: 'INTERIOR',
    buildingUse: 'COMMERCIAL',
  },
  // Arquitectura en blanco: la activación tiene que pedir la dirección.
  'mock-pending-arq-vacia': {
    installationCode: 'LOT-20260801-0003-R002-I2',
    status: 'PENDING',
    product: { id: 'clyproduct5', name: 'SILVER 20 ARQ', brand: 'Kristall' },
    productCategory: 'ARCHITECTURAL',
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: 'BUILDING',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: null,
    plate: null,
    clientEmail: null,
    warrantyMonths: 120,
    siteAddress: null,
    areaM2: null,
    paneCount: null,
    glassType: null,
    filmSide: null,
    buildingUse: null,
  },
  'mock-pending': {
    installationCode: 'LOT-20260705-0001-R003-I1',
    status: 'PENDING',
    product: { id: 'clyproduct1', name: 'KRYPTON 05', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: 'VEHICLE',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: 'PICKUP',
    plate: 'AB123CD',
    clientEmail: 'cliente@ejemplo.com',
    warrantyMonths: 60,
  },
  // Sin nada precargado: el taller genero la instalacion en blanco. La ficha no
  // se dibuja y el formulario pregunta todo, como antes.
  'mock-pending-vacia': {
    installationCode: 'LOT-20260705-0001-R003-I2',
    status: 'PENDING',
    product: { id: 'clyproduct1', name: 'KRYPTON 05', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: null,
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: null,
    plate: null,
    clientEmail: null,
    warrantyMonths: 12,
  },
  'mock-active': {
    installationCode: 'LOT-20260705-0002-R001-I1',
    status: 'ACTIVE',
    product: { id: 'clyproduct2', name: 'KAISER 20', brand: 'Kristall' },
    isActive: true,
    daysRemaining: 342,
    expiresAt: '2027-07-05T00:00:00.000Z',
    assetType: 'VEHICLE',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: 'SEDAN',
    plate: 'XY987ZW',
    clientEmail: 'cliente@ejemplo.com',
    warrantyMonths: 60,
  },
  'mock-expired': {
    installationCode: 'LOT-20250101-0001-R001-I1',
    status: 'EXPIRED',
    product: { id: 'clyproduct3', name: 'KLAR 30', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: '2026-01-01T00:00:00.000Z',
    assetType: 'VEHICLE',
    installer: { name: 'Vidriería Sur', logoPath: null },
    vehicleType: 'HATCHBACK',
    plate: 'CD456EF',
    clientEmail: 'cliente@ejemplo.com',
    warrantyMonths: 24,
  },
  'mock-voided': {
    installationCode: 'LOT-20260101-0001-R001-I1',
    status: 'VOIDED',
    product: { id: 'clyproduct4', name: 'PPF', brand: 'Kristall' },
    isActive: false,
    daysRemaining: 0,
    expiresAt: null,
    assetType: null,
    installer: null,
    vehicleType: null,
    plate: null,
    clientEmail: null,
    warrantyMonths: 12,
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
    product: { id: 'clp1', name: 'KRYPTON 05', sku: 'KR-05', category: 'AUTOMOTIVE', warrantyConfig: { maxInstallations: 1, installWarrantyMonths: 12, warrantyEnabled: true } },
    installations: [
      { id: 'cli1', installationCode: 'LOT-20260705-0001-R003-I1', status: 'ACTIVE', activatedAt: '2026-06-10T00:00:00.000Z', expiresAt: '2027-06-10T00:00:00.000Z', vehicleType: 'SUV', plate: 'AB123CD' },
    ],
    _count: { installations: 1 },
  },
  {
    id: 'clr2',
    fullRollCode: 'LOT-20260705-0002-R001',
    status: 'SOLD',
    lot: { lotNumber: 'LOT-20260705-0002' },
    // maxInstallations: 3 con 0 generadas — para probar el camino exitoso de creación.
    product: { id: 'clp2', name: 'KAISER 20', sku: 'KA-20', category: 'AUTOMOTIVE', warrantyConfig: { maxInstallations: 3, installWarrantyMonths: 36, warrantyEnabled: true } },
    installations: [],
    _count: { installations: 0 },
  },
  {
    id: 'clr3',
    fullRollCode: 'LOT-20260801-0003-R002',
    status: 'SOLD',
    lot: { lotNumber: 'LOT-20260801-0003' },
    // Rollo de arquitectura: el alta de instalación pide los datos de la obra.
    product: { id: 'clp5', name: 'SILVER 20 ARQ', sku: 'KARQ-S20', category: 'ARCHITECTURAL', warrantyConfig: { maxInstallations: 15, installWarrantyMonths: 120, warrantyEnabled: true } },
    installations: [],
    _count: { installations: 0 },
  },
]

const MOCK_INSTALLATIONS: Installation[] = [
  {
    id: 'cli1',
    installationCode: 'LOT-20260705-0001-R003-I1',
    status: 'ACTIVE',
    assetType: 'VEHICLE',
    assetDescription: 'Toyota Corolla 2022',
    activatedAt: '2026-06-10T00:00:00.000Z',
    expiresAt: '2027-06-10T00:00:00.000Z',
    roll: { fullRollCode: 'LOT-20260705-0001-R003', product: { id: 'clp1', name: 'KRYPTON 05', sku: 'KR-05', category: 'AUTOMOTIVE' } },
    siteAddress: null, areaM2: null, paneCount: null, glassType: null, filmSide: null, buildingUse: null,
  },
  {
    id: 'cli3',
    installationCode: 'LOT-20260801-0003-R002-I1',
    status: 'ACTIVE',
    assetType: 'BUILDING',
    assetDescription: 'Frente vidriado, planta baja',
    activatedAt: '2026-08-12T00:00:00.000Z',
    expiresAt: '2036-08-12T00:00:00.000Z',
    roll: { fullRollCode: 'LOT-20260801-0003-R002', product: { id: 'clp5', name: 'SILVER 20 ARQ', sku: 'KARQ-S20', category: 'ARCHITECTURAL' } },
    // Completa: esta lista la ve el taller, no un link reenviado.
    siteAddress: 'Av. Córdoba 1850, piso 4, CABA', areaM2: 18.5, paneCount: 6, glassType: 'DVH', filmSide: 'INTERIOR', buildingUse: 'COMMERCIAL',
  },
  {
    id: 'cli2',
    installationCode: 'LOT-20260705-0002-R001-I1',
    status: 'PENDING',
    assetType: null,
    assetDescription: null,
    activatedAt: null,
    expiresAt: null,
    roll: { fullRollCode: 'LOT-20260705-0002-R001', product: { id: 'clp2', name: 'KAISER 20', sku: 'KA-20', category: 'AUTOMOTIVE' } },
    siteAddress: null, areaM2: null, paneCount: null, glassType: null, filmSide: null, buildingUse: null,
  },
]

const MOCK_CLAIMS = [
  {
    id: 'clc1',
    status: 'OPEN',
    description: 'Se despegó una esquina',
    issueType: 'DESPEGUE',
    affectedPanes: null,
    createdAt: '2026-07-01T00:00:00.000Z',
    installation: { installationCode: 'LOT-20260705-0001-R003-I1', status: 'ACTIVE' },
  },
  {
    id: 'clc2',
    status: 'IN_REVIEW',
    description: 'Apareció una rajadura en el paño del medio, de borde a borde.',
    issueType: 'ROTURA_VIDRIO',
    affectedPanes: 1,
    createdAt: '2026-09-20T00:00:00.000Z',
    installation: { installationCode: 'LOT-20260801-0003-R002-I1', status: 'ACTIVE' },
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
    balance: 890000,
    totalInvoiced: 1650000,
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
    // Venta regular sin plan de cuotas, todavía sin cobrar — el caso que antes
    // no tenía ningún botón de "Registrar pago" (ver PendingSale).
    { id: 'clz3', date: '2026-07-20T00:00:00.000Z', type: 'SALE', description: 'Compra #1055', debit: 200000, credit: 0, balance: 890000, saleId: 'clz3' },
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
  // Ventas REGULAR con saldo, tengan o no plan — ver la nota larga en
  // PendingSale (lib/client-portal/api.ts). Compra #1042 tiene plan (se
  // sugiere la próxima cuota); Compra #1055 no tiene ninguno (se sugiere el
  // saldo total).
  pendingSales: [
    {
      saleId: 'clz2',
      saleNumber: 1042,
      total: 1150000,
      remaining: 700000,
      createdAt: '2026-06-01T00:00:00.000Z',
      plan: {
        nextDue: { id: 'cli2', number: 2, dueDate: '2026-07-15T12:00:00.000Z', amount: 287500, paid: 162500, remaining: 125000, status: 'OVERDUE' },
        overdueCount: 1,
      },
    },
    {
      saleId: 'clz3',
      saleNumber: 1055,
      total: 200000,
      remaining: 200000,
      createdAt: '2026-07-20T00:00:00.000Z',
      plan: null,
    },
  ],
}

/**
 * Pagos declarados desde el portal (mutable: un POST se ve en el próximo GET,
 * como MOCK_INSTALLATIONS). Arranca con uno ya confirmado y otro rechazado
 * para poder ver los tres estados sin tener que declarar nada primero.
 */
const MOCK_DECLARATIONS: {
  id: string
  saleId: string
  saleNumber: number
  amount: number
  method: string
  reference: string | null
  notes: string | null
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED'
  hasReceipt: boolean
  rejectionReason: string | null
  createdAt: string
}[] = [
  {
    id: 'cldecl1',
    saleId: 'clz2',
    saleNumber: 1042,
    amount: 287500,
    method: 'TRANSFER',
    reference: 'Operación 4021',
    notes: null,
    status: 'CONFIRMED',
    hasReceipt: true,
    rejectionReason: null,
    createdAt: '2026-06-18T00:00:00.000Z',
  },
  {
    id: 'cldecl2',
    saleId: 'clz2',
    saleNumber: 1042,
    amount: 125000,
    method: 'CASH',
    reference: null,
    notes: null,
    status: 'REJECTED',
    hasReceipt: false,
    rejectionReason: 'No encontramos el pago en efectivo en la caja de ese día.',
    createdAt: '2026-07-16T00:00:00.000Z',
  },
]

function match(path: string, pattern: RegExp): RegExpMatchArray | null {
  return path.match(pattern)
}

/** Los datos de obra de un body, o todo en null. Sin validar: es el mock. */
function datosDeObra(body: unknown): DatosObra {
  const b = (body ?? {}) as Partial<DatosObra>
  return {
    siteAddress: b.siteAddress ?? null,
    areaM2: b.areaM2 ?? null,
    paneCount: b.paneCount ?? null,
    glassType: b.glassType ?? null,
    filmSide: b.filmSide ?? null,
    buildingUse: b.buildingUse ?? null,
  }
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

  // Sesión de demostración (sección 4.11 de CLIENT_PORTAL_API.md). En mock
  // devuelve el mismo contacto de siempre: `callCrmApi` reapunta a los espejos
  // `/demo/` recién en la rama que pega al CRM real, así que acá el taller de
  // demo se sirve con los fixtures normales.
  if (path === '/api/public/demo/session' && method === 'POST') {
    return {
      status: 200,
      data: { contactId: MOCK_CONTACT_ID, credentialVersion: MOCK_CREDENTIAL_VERSION, nombre: MOCK_CONTACT.company },
    }
  }

  // --- Portal de Clientes (CLIENT_PORTAL_API.md) ---
  if (path === '/api/portal/v1/auth/login' && method === 'POST') {
    const { email, password } = (body ?? {}) as { email?: string; password?: string }
    if (email && password) {
      // El prefijo del email elige el nivel, para poder recorrer los tres
      // paneles sin tocar la base:
      //   basic@...      -> Panel Clientes
      //   revendedor@... -> Portal Revendedor (Mis precios + stock con garantía)
      //   cualquier otro -> Portal Instalador
      const accessLevel = email.startsWith('basic')
        ? 'BASIC'
        : email.startsWith('revendedor')
          ? 'RESELLER'
          : 'INSTALLER'
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

  // Cargar email y datos desde el link de WhatsApp. Tokens de prueba:
  // "mock-datos" (Cliente sin email) y "mock-confirmar" (mail de confirmación).
  if (path.startsWith('/api/portal/v1/data-update/confirm?') && method === 'GET') {
    const token = new URLSearchParams(path.split('?')[1]).get('token')
    if (token === 'mock-confirmar') return { status: 200, data: { valid: true, email: 'juan@ejemplo.com', name: 'Juan' } }
    return { status: 404, data: { error: 'El link no es válido.' } }
  }
  if (path === '/api/portal/v1/data-update/confirm' && method === 'POST') {
    const { token } = (body ?? {}) as { token?: string }
    if (token !== 'mock-confirmar') return { status: 404, data: { error: 'El link no es válido.' } }
    return { status: 200, data: { ok: true, email: 'juan@ejemplo.com', name: 'Juan', portalActive: false } }
  }
  if (path.startsWith('/api/portal/v1/data-update?') && method === 'GET') {
    const token = new URLSearchParams(path.split('?')[1]).get('token')
    if (token === 'mock-datos') {
      return {
        status: 200,
        data: {
          valid: true, firstName: 'Juan', lastName: 'Pérez', company: 'Vidriería Pérez', phone: '1125835244',
          address: null, city: 'Rosario', state: 'Santa Fe', email: null, pendingEmail: null,
        },
      }
    }
    return { status: 404, data: { error: 'El link no es válido.' } }
  }
  if (path === '/api/portal/v1/data-update' && method === 'POST') {
    const { token, email } = (body ?? {}) as { token?: string; email?: string }
    if (token !== 'mock-datos') return { status: 404, data: { error: 'El link no es válido.' } }
    if (email === 'repetido@ejemplo.com') {
      return { status: 409, data: { error: 'Ese email ya figura en otra cuenta de cliente. Escribinos y lo resolvemos.' } }
    }
    return { status: 200, data: { ok: true, emailSentTo: email } }
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
  if (m && method === 'GET') {
    if (m[1] !== MOCK_CONTACT_ID) return { status: 200, data: [] }
    // El `warrantyUrl` que el CRM agrega solo para el nivel RESELLER. Acá se
    // manda siempre: el mock no sabe con qué nivel se logueó, y la pantalla de
    // stock solo lo lee cuando es revendedor. El último rollo va sin link, para
    // poder ver el caso "garantía ya activada" sin inventar datos.
    return {
      status: 200,
      data: MOCK_STOCK.map((r, i) => ({
        ...r,
        warrantyUrl:
          i === MOCK_STOCK.length - 1
            ? null
            : `https://kristallfilm.com/garantia/mock-${r.fullRollCode.toLowerCase()}`,
      })),
    }
  }

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/prices$/)
  if (m && method === 'GET') {
    if (m[1] !== MOCK_CONTACT_ID) return { status: 404, data: { error: 'Cliente no encontrado' } }
    // Tres productos: uno con porcentaje, uno con monto fijo y uno sin
    // descuento. Es el caso del revendedor real —se pacta lamina por lamina— y
    // el que hace visible que los productos sin acuerdo van a precio de lista.
    const catalogo = [
      { id: 'p-kryon', name: 'Kristall Kryon 15', sku: 'KRY-15', precioLista: 210000, etiqueta: { code: 'KRY16', name: 'Revendedor Kryon', type: 'PERCENTAGE', value: 16.66, label: 'KRY16 — Revendedor Kryon (16.66%)' } },
      { id: 'p-urban', name: 'Urban Carbon 20', sku: 'URB-20', precioLista: 180000, etiqueta: null },
      { id: 'p-krypton', name: 'Kristall Krypton 15', sku: 'KRP-15', precioLista: 195000, etiqueta: null },
      { id: 'p-kit', name: 'Kit de instalación', sku: 'KIT-01', precioLista: 12000, etiqueta: { code: 'FIJO2', name: 'Kit bonificado', type: 'FIXED', value: 2000, label: 'FIJO2 — Kit bonificado ($2.000)' } },
    ]
    const items = catalogo.map((p) => {
      const descuento = !p.etiqueta
        ? 0
        : p.etiqueta.type === 'FIXED'
          ? Math.min(p.etiqueta.value, p.precioLista)
          : Math.round(p.precioLista * (p.etiqueta.value / 100) * 100) / 100
      return {
        ...p,
        category: 'AUTOMOTIVE',
        subcategory: null,
        brand: 'Kristall',
        shade: null,
        width: null,
        length: null,
        imageUrl: null,
        descuento,
        precioConDescuento: Math.round((p.precioLista - descuento) * 100) / 100,
      }
    })
    return {
      status: 200,
      data: { items, conDescuento: items.filter((i) => i.descuento > 0).length, ivaIncluido: true },
    }
  }

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
        roll: {
          fullRollCode: roll.fullRollCode,
          product: { ...roll.product, category: roll.product.category as ProductCategory },
        },
        // Lo que precargó el taller, si el rollo es de arquitectura. Igual
        // que en el CRM, en un rollo de auto se descarta.
        ...datosDeObra(roll.product.category === 'ARCHITECTURAL' ? body : null),
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

  m = match(path, /^\/api\/portal\/v1\/contacts\/([^/]+)\/payment-declarations$/)
  if (m && method === 'GET') {
    return { status: 200, data: m[1] === MOCK_CONTACT_ID ? MOCK_DECLARATIONS : [] }
  }
  if (m && method === 'POST') {
    if (m[1] !== MOCK_CONTACT_ID) return { status: 404, data: { error: 'Cliente no encontrado' } }
    const datos = (body ?? {}) as {
      saleId?: string
      amount?: number
      method?: string
      reference?: string
      notes?: string
      receipt?: string
      receiptMimeType?: string
    }
    const venta = MOCK_ACCOUNT.pendingSales.find((v) => v.saleId === datos.saleId)
    if (!venta) return { status: 400, data: { error: 'Esa venta no tiene saldo pendiente.' } }
    const nueva = {
      id: `cldecl-mock-${MOCK_DECLARATIONS.length + 1}`,
      saleId: venta.saleId,
      saleNumber: venta.saleNumber,
      amount: Number(datos.amount ?? 0),
      method: datos.method ?? 'OTHER',
      reference: datos.reference ?? null,
      notes: datos.notes ?? null,
      status: 'PENDING' as const,
      hasReceipt: Boolean(datos.receipt),
      rejectionReason: null,
      createdAt: new Date().toISOString(),
    }
    MOCK_DECLARATIONS.unshift(nueva)
    return { status: 201, data: nueva }
  }

  return { status: 404, data: { error: `Mock no implementado para ${method} ${path}` } }
}
