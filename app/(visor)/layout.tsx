import type { Metadata, Viewport } from 'next'
import { fontsClassName } from '@/lib/fonts'
import '../globals.css'

/**
 * Layout propio para /visor-3d: sin Header/Footer del sitio, el modelo ocupa
 * toda la pantalla. noindex: es una vista para compartir por link, no una
 * página de la marca — tampoco figura en sitemap.ts ni en llms.txt.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  colorScheme: 'dark',
}

export default function VisorLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontsClassName}>
      <body className="min-h-screen bg-[#0A0A0A] text-white antialiased">{children}</body>
    </html>
  )
}
