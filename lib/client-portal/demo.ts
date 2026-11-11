import { callCrmApi } from '@/lib/crm/api'

/**
 * El puente hacia la demostración del CRM.
 *
 * La sesión del portal es un token firmado que lleva el `contactId`, y el CRM
 * revalida ese id contra `ClientPortalAccount` en cada endpoint. O sea que para
 * meter a alguien en el portal alcanza con **emitir esa cookie apuntando al
 * clon**: no hace falta un usuario `demo` con contraseña `demo` en la tabla de
 * credenciales, ni tocar el login.
 *
 * El clon sí tiene su cuenta de portal, porque el portero del CRM la exige,
 * pero con una contraseña aleatoria de 32 bytes que nadie conoce. La puerta es
 * este endpoint, no una credencial.
 */
const KEY = () => {
  const key = process.env.CRM_CLIENT_PORTAL_API_KEY
  if (!key) throw new Error('Missing CRM_CLIENT_PORTAL_API_KEY')
  return key
}

export interface SesionDemo {
  contactId: string
  credentialVersion: string
  nombre: string
}

/**
 * Crea un taller de demostración descartable y devuelve con qué abrirle sesión.
 *
 * `ipVisitante` viaja en `x-portal-client-ip` porque el CRM también limita las
 * demostraciones por IP, y la única IP que ve por su cuenta es la de este
 * servidor: sin la cabecera, su tope de 5 por hora era uno solo para todos los
 * visitantes y la sexta persona de la hora quedaba afuera en su primer intento.
 */
export function crearSesionDemo(ipVisitante?: string) {
  return callCrmApi<SesionDemo>('/api/public/demo/session', {
    method: 'POST',
    apiKey: KEY(),
    headers: ipVisitante ? { 'x-portal-client-ip': ipVisitante } : undefined,
  })
}
