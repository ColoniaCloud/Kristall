import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  // Solo errores. El tracing de rendimiento consume cuota y memoria, y en un
  // hosting compartido con tope de procesos no es lo que queremos pagar.
  tracesSampleRate: 0,
  // Sin IPs, cookies ni cabeceras de autenticación: el portal maneja sesiones y
  // el sitio recibe formularios con mails y teléfonos.
  sendDefaultPii: false,
  // SENTRY_DEBUG=1 imprime en consola qué hace el SDK; para diagnosticar, no
  // para dejarlo puesto.
  debug: process.env.SENTRY_DEBUG === '1',
  integrations: [
    // Las rutas de /api atrapan el error, lo registran con
    // `console.error('[API/...]', err)` y responden 500: el error nunca sube, y
    // Next solo avisa a onRequestError de las rutas que explotan sin atrapar
    // (y en `next dev` con la 15.4.11 no lo hizo ni para esas: probado). Esto
    // convierte cada console.error del servidor en un evento de Sentry.
    Sentry.captureConsoleIntegration({ levels: ['error'] }),
  ],
})
