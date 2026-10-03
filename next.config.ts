import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// Este sitio hospeda el login del Panel de Cliente (/cliente) y las garantías
// (/garantia), así que las cabeceras no son cosmética. El CRM ya tenía las
// suyas (crm-polarizados/next.config.ts); acá faltaban por completo.
const SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Sin `includeSubDomains` a propósito: kristallfilm.com tiene subdominios que
  // este repo no controla (kri.* es el CRM), y comprometerlos a HTTPS desde acá
  // sería decidir por ellos. El middleware ya fuerza HTTPS en producción.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
]

const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' y 'unsafe-eval': Next inyecta su bootstrap inline y no hay
  // nonces configurados. Sacarlos exige migrar a CSP con nonce, que es un
  // cambio aparte.
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  // Ya no hace falta fonts.googleapis.com: las fuentes las autohospeda next/font
  // (lib/fonts.ts) y salen de nuestro propio origen. La plantilla de mail de
  // lib/mail/ sí sigue pidiéndole la hoja a Google, pero eso lo renderiza el
  // cliente de correo y no pasa por este CSP.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.googletagmanager.com https://www.google-analytics.com",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
  // El Panel de Cliente registra un service worker (public/cliente/sw.js).
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ')

const nextConfig: NextConfig = {
  // Acota los workers de generación estática del build. El default de Next sale
  // de os.cpus(), y el hosting compartido reporta 64 núcleos que la cuenta no
  // puede usar: cada build levantaba 63 procesos en paralelo contra un techo de
  // 200 para toda la cuenta —y este sitio se construye seguido, a veces en el
  // mismo segundo que el CRM y polariz.ar—, lo que tumbaba las otras apps del
  // plan. Mismo valor que crm-polarizados/next.config.ts.
  //
  // globalNotFound: el 404 raíz vive en app/global-not-found.tsx y se arma solo,
  // con su propio CSS. Hace falta porque app/layout.tsx ya no importa
  // globals.css (lo pisaba al admin de Payload), y un app/not-found.tsx común
  // hereda el CSS del layout raíz pero no emite el que importa él mismo.
  experimental: { cpus: 4, globalNotFound: true },
  // Evita que Next.js infiera mal la raíz del workspace por lockfiles
  // ajenos al proyecto (p. ej. package-lock.json en el home del usuario).
  outputFileTracingRoot: import.meta.dirname,
  poweredByHeader: false,
  async headers() {
    return [
      // El admin de Payload queda fuera del CSP: arma su propio bundle y no
      // está verificado contra estas directivas. Recibe igual el resto de las
      // cabeceras, que son las que importan para clickjacking y sniffing.
      { source: '/(.*)', headers: SECURITY_HEADERS },
      {
        source: '/((?!admin).*)',
        headers: [{ key: 'Content-Security-Policy', value: CSP }],
      },
    ]
  },
};

export default withNextIntl(withPayload(nextConfig));
