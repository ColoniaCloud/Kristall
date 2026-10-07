import { callCrmApi } from '@/lib/crm/api'

/**
 * Lanza si falta, en vez de devolver undefined. Con undefined, callCrmApi
 * simplemente no manda el header `x-api-key`, el CRM responde 401 y LoginForm
 * mapea cualquier 401 a "Email o contraseña incorrectos": una key mal
 * configurada se ve como si todos los clientes se equivocaran de contraseña.
 * Mismo criterio que CRM_BASE_URL y SESSION_SECRET.
 */
const KEY = () => {
  const key = process.env.CRM_CLIENT_PORTAL_API_KEY
  if (!key) throw new Error('Missing CRM_CLIENT_PORTAL_API_KEY')
  return key
}

export type PaymentStatus = 'PAID' | 'PARTIAL' | 'PENDING'
export type RollStatus = 'IN_STOCK' | 'SOLD' | 'IN_USE' | 'EXHAUSTED' | 'VOIDED'
export type ClaimStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED'

/**
 * El rubro de un producto, tal como lo clasifica el CRM.
 *
 * Es la fuente de verdad del rubro de una instalación: una lámina no cambia de
 * naturaleza según quién la ponga, así que de acá sale qué le preguntamos al
 * instalador y qué le preguntamos después al cliente final. `PPF` cuenta como
 * automotriz — es otro producto, pero va sobre un auto y tiene patente.
 *
 * La definición vive en `product-category.ts` y se reexporta acá por comodidad.
 * **Un componente de cliente tiene que importarla de allá**, no de este archivo:
 * este llega a `next/headers` y arrastrarlo al navegador rompe el build.
 */
import type { ProductCategory } from '@/lib/client-portal/product-category'
import type { BuildingUse, DatosObra, FilmSide, GlassType } from '@/lib/obra'
import type { ClaimIssueType } from '@/lib/reclamos'
export type { ProductCategory }
export { PRODUCT_CATEGORY_LABELS } from '@/lib/client-portal/product-category'

export interface Purchase {
  id: string
  saleNumber: string
  total: number
  paymentStatus: PaymentStatus
  createdAt: string
  items: { productName: string; quantity: number; unitPrice: number }[]
}

export interface Payment {
  id: string
  amount: number
  method: string
  date: string
  saleNumber: string
}

/**
 * Ficha del Cliente. Ojo con los `| null`: en el CRM son columnas opcionales del
 * `Contact` y llegan como `null`, no como cadena vacía. Estaban tipadas como
 * `string` a secas, así que TypeScript dejaba pasar `contact.company.charAt(0)`
 * y el botón del menú se quedaba sin letra para cualquier cliente sin razón
 * social cargada.
 */
export interface ClientContact {
  id: string
  firstName: string
  lastName: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  purchases: Purchase[]
  payments: Payment[]
  balance: number
}

export interface StockRoll {
  id: string
  fullRollCode: string
  status: RollStatus
  lot: { lotNumber: string }
  product: {
    id: string
    name: string
    /** `null` es posible: en el CRM el SKU es una columna opcional del producto. */
    sku: string | null
    /**
     * El rubro de la lámina. Decide qué le pedimos al instalador al generar la
     * instalación, y qué le pedirá después al cliente final la pantalla de
     * activación: una lámina de arquitectura no tiene patente.
     *
     * `PPF` cuenta como automotriz: va sobre autos.
     */
    category: ProductCategory
    /** null si el producto no tiene WarrantyConfig — en ese caso asumir 15 (default del CRM). */
    warrantyConfig: {
      maxInstallations: number
      /** Los meses que cubre la instalación al cliente final, no el rollo. */
      installWarrantyMonths: number
      /** Un producto puede tener config y tenerla apagada. */
      warrantyEnabled: boolean
    } | null
  }
  /**
   * TODAS las instalaciones generadas sobre este rollo (no solo las ACTIVE). Usar
   * `installations.length` vs `product.warrantyConfig.maxInstallations` para saber cuántos
   * sub-códigos quedan disponibles — `_count.installations` de abajo cuenta otra cosa.
   */
  installations: {
    id: string
    installationCode: string
    status: string
    activatedAt: string | null
    expiresAt: string | null
    /** Precargados por el taller al generar la instalación. */
    vehicleType: string | null
    plate: string | null
  }[]
  /** Cuenta SOLO instalaciones ACTIVE (activadas por el cliente final) — no usar para cupo. */
  _count: { installations: number }
  /**
   * El link de garantía para pasarle a quien compre este rollo.
   *
   * **Solo llega con nivel `RESELLER`.** Un instalador no lo necesita —genera sus
   * propios sub-códigos desde el portal— y el CRM se lo excluye a propósito: el
   * token que lleva adentro es una capacidad al portador. Un revendedor no
   * instala, así que es lo único que le puede entregar a su comprador.
   *
   * `null` cuando el rollo ya no tiene ninguna instalación sin activar: no hay
   * nada que pasar, y un link a "esta garantía ya fue activada" confunde más de
   * lo que ayuda.
   */
  warrantyUrl?: string | null
}

/**
 * Instalación de la sección 4.3. Los datos de obra (`DatosObra`) solo vienen
 * llenos en láminas de arquitectura, y acá la dirección llega **completa**: es
 * el taller el que pregunta.
 */
export interface Installation extends DatosObra {
  id: string
  installationCode: string
  status: string
  assetType: string | null
  assetDescription: string | null
  activatedAt: string | null
  expiresAt: string | null
  roll: { fullRollCode: string; product: { id: string; name: string; sku: string | null; category: ProductCategory } }
}

/** Response de POST .../rolls/:fullRollCode/installations (sección 4.8 de CLIENT_PORTAL_API.md). */
export interface CreatedInstallation {
  id: string
  installationNumber: number
  installationCode: string
  /** Token para armar el link /garantia/<token> — solo se entrega acá, en el momento de creación. */
  activationToken: string
  status: string
  /** Estado del ROLLO (no de la instalación) después de esta operación. */
  rollStatus: RollStatus
}

export interface Claim {
  id: string
  status: ClaimStatus
  description: string
  createdAt: string
  /** Null en reclamos anteriores a octubre 2026. */
  issueType: ClaimIssueType | null
  affectedPanes: number | null
  installation: { installationCode: string; status: string }
}

export interface Notification {
  id: string
  /**
   * `INSTALLMENT_OVERDUE` lo genera el watcher de cuotas del CRM
   * (lib/overdue-installments.ts) y faltaba en este tipo.
   */
  type:
    | 'NEW_PURCHASE'
    | 'WARRANTY_ACTIVATED'
    | 'INSTALLMENT_OVERDUE'
    | 'WARRANTY_CLAIM_UPDATED'
  title: string
  message: string
  /**
   * Destino dentro del panel, ya en formato de ruta local — p. ej.
   * `/cliente/cuenta#cuota-<id>`, cuya ancla existe en AccountStatement. `null`
   * cuando la notificación es solo informativa. El CRM lo venía mandando y se
   * descartaba al serializar.
   */
  link: string | null
  read: boolean
  createdAt: string
}

/**
 * Duplicado a proposito con el de `lib/client-portal/session.ts`: este describe
 * lo que **devuelve el CRM**, y aquel lo que guarda la cookie. Si el CRM agrega
 * un nivel, este es el que cambia primero.
 */
export type AccessLevel = 'BASIC' | 'INSTALLER' | 'RESELLER'

export interface LoginResult {
  contactId: string
  name: string
  company: string | null
  /** Ausente en respuestas del CRM anteriores a agosto 2026; tratar como BASIC. */
  accessLevel?: AccessLevel
  /**
   * Huella de la contraseña con la que se abre la sesión. Se guarda en la cookie
   * y se manda de vuelta en cada llamada: es lo que permite que un cambio de
   * contraseña mate las sesiones vivas. Ausente en respuestas del CRM
   * anteriores a setiembre 2026.
   */
  credentialVersion?: string
}

export function loginClient(email: string, password: string) {
  return callCrmApi<LoginResult>('/api/portal/v1/auth/login', {
    method: 'POST',
    apiKey: KEY(),
    body: { email, password },
  })
}

// ─── Alta de cuenta y recuperación de contraseña ─────────────────────────────
//
// El CRM es el dueño de las credenciales: acá solo se hace de puente. Los
// tokens viajan en la URL del mail que manda el CRM y se validan contra él.

export interface RequestActivationResult {
  found: boolean
  alreadyActive?: boolean
  message: string
}

/** Paso 1 del alta: el Cliente pone su email y el CRM le manda el link. */
export function requestActivation(email: string) {
  return callCrmApi<RequestActivationResult>('/api/portal/v1/auth/request-activation', {
    method: 'POST',
    apiKey: KEY(),
    body: { email },
  })
}

export interface ActivationTokenInfo {
  valid: true
  email: string
  name: string
  company: string | null
  /** El que ya tiene el CRM, para preguntar si sigue vigente. null = pedirlo. */
  whatsapp: string | null
}

/** Valida el link antes de mostrar el formulario. */
export function verifyActivationToken(token: string) {
  return callCrmApi<ActivationTokenInfo>(
    `/api/portal/v1/auth/activate?token=${encodeURIComponent(token)}`,
    { apiKey: KEY() }
  )
}

/** Paso 2 del alta: crea la cuenta con la contraseña que eligió el Cliente. */
export function activateAccount(input: { token: string; password: string; whatsapp?: string }) {
  return callCrmApi<LoginResult>('/api/portal/v1/auth/activate', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export function requestPasswordReset(email: string) {
  return callCrmApi<{ message: string }>('/api/portal/v1/auth/request-reset', {
    method: 'POST',
    apiKey: KEY(),
    body: { email },
  })
}

export function verifyResetToken(token: string) {
  return callCrmApi<{ valid: true; email: string }>(
    `/api/portal/v1/auth/reset?token=${encodeURIComponent(token)}`,
    { apiKey: KEY() }
  )
}

/** No devuelve sesión a propósito: después de cambiarla, el Cliente entra por el login normal. */
export function resetPassword(input: { token: string; password: string }) {
  return callCrmApi<{ ok: true; message: string }>('/api/portal/v1/auth/reset', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

// ─── Cuenta corriente ────────────────────────────────────────────────────────

export type InstallmentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE'

export interface AccountEntry {
  id: string
  date: string
  type: 'SALE' | 'PAYMENT' | 'ADJUSTMENT'
  description: string
  debit: number
  credit: number
  /** Saldo acumulado hasta este movimiento inclusive. Negativo = saldo a favor. */
  balance: number
  saleId?: string
}

export interface AccountInstallment {
  id: string
  number: number
  dueDate: string
  amount: number
  paid: number
  remaining: number
  status: InstallmentStatus
}

export interface AccountPlan {
  id: string
  saleId: string
  saleNumber: number
  installmentCount: number
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM'
  financedTotal: number
  status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED'
  installments: AccountInstallment[]
  nextDue: AccountInstallment | null
  overdueCount: number
}

export interface PendingSale {
  saleId: string
  saleNumber: number
  total: number
  remaining: number
  createdAt: string
  /** Si esta venta tiene un plan de cuotas activo, el detalle de la próxima
   *  cuota. `null` = saldo simple, sin plan — se paga el total pendiente. */
  plan: { nextDue: AccountInstallment | null; overdueCount: number } | null
}

export interface ClientAccount {
  summary: {
    /** Negativo = saldo a favor del cliente. */
    balance: number
    totalInvoiced: number
    totalPaid: number
    overdueAmount: number
    nextDueDate: string | null
  }
  entries: AccountEntry[]
  /** Vacío si ninguna compra se financió en cuotas — es el caso más común. */
  plans: AccountPlan[]
  /** Toda venta no anulada con saldo — de cualquier tipo y tenga o no plan —
   *  es lo que puede recibir una declaración de pago desde
   *  `RegisterPaymentDialog`. Si viene vacío, el botón "Registrar un pago" no
   *  se dibuja: es la única condición que lo esconde. */
  pendingSales: PendingSale[]
}

/**
 * Opciones de las llamadas hechas EN NOMBRE del Cliente logueado.
 * `portalSession` adjunta la versión de credencial de la cookie — ver
 * lib/crm/api.ts.
 *
 * Todos los segmentos van con `encodeURIComponent`: Next decodifica los params
 * ANTES de dárselos al route handler, así que un `%2F` en la URL del navegador
 * llega acá como `/` y se reinyecta como separador de path en la llamada al
 * CRM, con la api key adjunta. Los tokens de activación y reset ya lo hacían
 * bien; el resto no, y era inconsistencia, no criterio.
 */
const SESSION = () => ({ apiKey: KEY(), portalSession: true }) as const

export function getAccount(contactId: string) {
  return callCrmApi<ClientAccount>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/account`,
    SESSION()
  )
}

export function getContact(contactId: string) {
  return callCrmApi<ClientContact>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}`,
    SESSION()
  )
}

export function getStock(contactId: string) {
  return callCrmApi<StockRoll[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/stock`,
    SESSION()
  )
}

/** Un producto con lo que le sale a ESTE contacto. Ver getPrices(). */
export interface PrecioDeProducto {
  id: string
  name: string
  sku: string | null
  category: ProductCategory | string
  subcategory: string | null
  brand: string | null
  shade: string | null
  width: number | null
  length: number | null
  imageUrl: string | null
  /** Precio de lista, IVA incluido. Igual para todos. */
  precioLista: number
  /** Lo que le sale a este contacto. Igual al de lista si no lleva descuento. */
  precioConDescuento: number
  descuento: number
  /** La etiqueta pactada para este producto, o null si va a precio de lista. */
  etiqueta: {
    code: string
    name: string
    type: string
    value: number
    /** `"KRY16 — Revendedor Kryon (16.66%)"`, el mismo texto que muestra el CRM. */
    label: string
  } | null
}

export interface PreciosResult {
  items: PrecioDeProducto[]
  /** Cuantos productos llevan descuento. Cero significa "todo a precio de lista". */
  conDescuento: number
  ivaIncluido: boolean
}

/**
 * Los precios del revendedor. Nivel `RESELLER` — el CRM devuelve 403 al resto.
 *
 * El calculo lo hace el CRM con la misma precedencia que usa al vender, a
 * proposito: si esta pantalla calculara aparte, el revendedor podria ver un
 * precio que la venta despues no respeta.
 */
export function getPrices(contactId: string) {
  return callCrmApi<PreciosResult>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/prices`,
    SESSION()
  )
}

export function getInstallations(contactId: string) {
  return callCrmApi<Installation[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/installations`,
    SESSION()
  )
}

/** Genera un nuevo sub-código de instalación (#2, #3, ...) sobre un rollo ya vendido a ese contacto. */
/** Lo que el instalador precarga. Todo opcional: la instalación en blanco
 *  sigue siendo válida y es como funcionaba hasta ahora. */
export interface PreloadInstallation {
  clientName?: string
  clientEmail?: string
  clientPhone?: string
  vehicleType?: string
  plate?: string
  /** Arquitectura. El CRM los descarta si el rollo es de auto (y al revés con
   *  vehicleType/plate): decide el producto, no este objeto. */
  assetDescription?: string
  siteAddress?: string
  areaM2?: number
  paneCount?: number
  glassType?: GlassType
  filmSide?: FilmSide
  buildingUse?: BuildingUse
}

export function createRollInstallation(
  contactId: string,
  fullRollCode: string,
  datos: PreloadInstallation = {}
) {
  return callCrmApi<CreatedInstallation>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/rolls/${encodeURIComponent(fullRollCode)}/installations`,
    { method: 'POST', body: datos, ...SESSION() }
  )
}

export function getClaims(contactId: string) {
  return callCrmApi<Claim[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/claims`,
    SESSION()
  )
}

export interface CreateClaimInput {
  installationId: string
  description: string
  reporterName: string
  reporterEmail: string
  reporterPhone?: string
  /** Tipo de problema, paños (arquitectura) y fotos. Ver lib/reclamos.ts. */
  issueType?: ClaimIssueType
  affectedPanes?: number
  photos?: { data: string; mimeType: string }[]
}

export function createClaim(contactId: string, input: CreateClaimInput) {
  return callCrmApi<{ id: string; status: string }>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/claims`,
    { method: 'POST', ...SESSION(), body: input }
  )
}

export function getNotifications(contactId: string) {
  return callCrmApi<Notification[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/notifications`,
    SESSION()
  )
}

export function markNotificationRead(contactId: string, notificationId: string) {
  return callCrmApi<{ ok: boolean }>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/notifications/${encodeURIComponent(notificationId)}/read`,
    { method: 'PATCH', ...SESSION() }
  )
}

// ─── Pagos declarados por el Cliente ────────────────────────────────────────
//
// "Ya pagué esta cuota", avisado desde el Dashboard o Cuenta corriente. NO
// mueve el saldo: queda pendiente hasta que un admin la confirma desde el CRM
// (ver PaymentDeclaration en el CRM). El cliente solo ve el estado.

export type PaymentDeclarationStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED'

export interface PaymentDeclaration {
  id: string
  saleId: string
  saleNumber: number
  amount: number
  method: string
  reference: string | null
  notes: string | null
  status: PaymentDeclarationStatus
  hasReceipt: boolean
  rejectionReason: string | null
  createdAt: string
}

export function getPaymentDeclarations(contactId: string) {
  return callCrmApi<PaymentDeclaration[]>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/payment-declarations`,
    SESSION()
  )
}

export interface DeclarePaymentInput {
  saleId: string
  amount: number
  method: 'TRANSFER' | 'CASH' | 'OTHER'
  reference?: string
  notes?: string
  /** Base64 SIN el prefijo `data:`. */
  receipt?: string
  receiptMimeType?: 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf'
}

export function declarePayment(contactId: string, input: DeclarePaymentInput) {
  return callCrmApi<PaymentDeclaration>(
    `/api/portal/v1/contacts/${encodeURIComponent(contactId)}/payment-declarations`,
    { method: 'POST', ...SESSION(), body: input }
  )
}
