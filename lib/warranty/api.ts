import { callCrmApi } from '@/lib/crm/api'

/** Lanza si falta: sin la key el CRM devuelve 401 y el error se lee como
 *  "no encontramos esa garantía". Ver la nota en lib/client-portal/api.ts. */
const KEY = () => {
  const key = process.env.CRM_WARRANTY_API_KEY
  if (!key) throw new Error('Missing CRM_WARRANTY_API_KEY')
  return key
}

export type AssetType = 'VEHICLE' | 'WINDOW' | 'BUILDING' | 'OTHER'
export type InstallationStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'VOIDED'

export const ASSET_TYPES: AssetType[] = ['VEHICLE', 'WINDOW', 'BUILDING', 'OTHER']

export interface WarrantyStatus {
  installationCode: string
  status: InstallationStatus
  product: { id: string; name: string; brand: string }
  isActive: boolean
  daysRemaining: number
  expiresAt: string | null
  assetType: AssetType | null
}

/** GET /api/public/warranty/:token — sin key, es el único endpoint público. */
export function getStatus(token: string) {
  return callCrmApi<WarrantyStatus>(`/api/public/warranty/${token}`)
}

export interface ActivateInput {
  assetType: AssetType
  assetDescription?: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientDni?: string
  installedAt?: string
  installerName?: string
  notes?: string
}

export function activate(token: string, input: ActivateInput) {
  return callCrmApi<{ activated: true; expiresAt: string }>(`/api/public/warranty/${token}/activate`, {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export interface CreateWarrantyClaimInput {
  activationToken: string
  reporterName: string
  reporterEmail?: string
  reporterPhone?: string
  reporterDni?: string
  description: string
}

export function createClaim(input: CreateWarrantyClaimInput) {
  return callCrmApi<{ id: string; status: 'OPEN' }>('/api/public/warranty/claims', {
    method: 'POST',
    apiKey: KEY(),
    body: input,
  })
}

export function setPassword(token: string, password: string) {
  return callCrmApi<{ ok: true }>(`/api/public/warranty/${token}/set-password`, {
    method: 'POST',
    apiKey: KEY(),
    body: { password },
  })
}

export function loginByInstallationCode(installationCode: string, password: string) {
  return callCrmApi<WarrantyStatus>('/api/public/warranty/login', {
    method: 'POST',
    apiKey: KEY(),
    body: { installationCode, password },
  })
}
