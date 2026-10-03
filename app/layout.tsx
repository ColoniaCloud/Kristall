import type { Metadata } from 'next'
// Sin globals.css acá: este layout también envuelve a (payload), y las reglas
// sin @layer del sitio le ganan a las de Payload (que viven en
// @layer payload-default) — el admin se veía en Times New Roman y con los
// colores del sitio. Cada root layout del sitio lo importa por su cuenta.

export const metadata: Metadata = {
  metadataBase: new URL('https://kristallfilm.com'),
  title: {
    default: 'Kristall Film',
    template: '%s | Kristall Film',
  },
  description: 'Láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    siteName: 'Kristall Film',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Kristall Film — láminas de tecnología alemana' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-default.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
