import * as Sentry from '@sentry/nextjs'

/**
 * Next llama a register() una vez al arrancar el servidor.
 *
 * Sentry solo se inicializa si hay DSN: sin él (desarrollo local, un preview sin
 * variables) no se carga el SDK ni su instrumentación, y la app anda como antes.
 * El DSN es el mismo para navegador y servidor — por diseño no es secreto, solo
 * dice a qué proyecto mandar los eventos.
 */
export async function register() {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config')
  }
  // El middleware (i18n, HTTPS) corre en el runtime edge.
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config')
  }
}

// Errores de rutas, server components y server actions que nadie atrapó.
// Los que sí atrapa un try/catch del código no llegan acá: esos hay que
// reportarlos a mano con Sentry.captureException.
export const onRequestError = Sentry.captureRequestError
