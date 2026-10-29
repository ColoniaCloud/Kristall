import type { Metadata, Viewport } from 'next'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import { fontsClassName } from '@/lib/fonts'
import '../globals.css'
import '@/components/catalogo-propuesta/catalogo.css'

/**
 * Layout propio para /catalogo-propuesta: sin Header/Footer del sitio, para que la
 * página se recorra como una historia desde el navegador interno de Instagram.
 *
 * noindex: lleva precios mayoristas y se comparte por mensaje, no por Google.
 * Tampoco figura en sitemap.ts ni en llms.txt.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
}

export default function PropuestaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontsClassName}>
      <body className="kf-catalogo-body min-h-screen antialiased">
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  )
}
