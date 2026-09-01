/**
 * Digest que `loadPortalData` le pega al error del 429 para que sobreviva hasta
 * el error boundary.
 *
 * Vive en su propio archivo, sin imports, porque lo comparten un módulo de
 * servidor (`guard.ts`, que lee cookies) y un componente de cliente
 * (`(protected)/error.tsx`). Tenerlo en `guard.ts` arrastraba `next/headers`
 * al bundle del navegador y el build fallaba entero.
 *
 * Next reemplaza el mensaje de un error de servidor por uno genérico antes de
 * mandarlo al navegador; lo único que deja pasar es `digest`, y si el error ya
 * trae uno, lo respeta. Si algún día dejara de respetarlo, el boundary no
 * reconoce el valor y cae al texto genérico: se pierde la precisión del
 * mensaje, no el funcionamiento.
 */
export const PORTAL_RATE_LIMITED = 'PORTAL_RATE_LIMITED'
