import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'Panel de Cliente | Kristall Film', template: '%s | Panel Kristall' },
  robots: { index: false, follow: false },
  manifest: '/manifest-cliente.json',
  icons: {
    icon: [{ url: '/icon-cliente-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon-cliente.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Kristall Cliente',
  },
}

export default function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="kf-app-theme min-h-screen bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  )
}
