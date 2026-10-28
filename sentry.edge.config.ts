import * as Sentry from '@sentry/nextjs'

// Mismo criterio que sentry.server.config.ts; el runtime edge solo lo usa el
// middleware.
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate: 0,
  sendDefaultPii: false,
})
