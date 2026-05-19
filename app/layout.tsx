import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://kristallfilm.com'),
  title: {
    default: 'Kristall Film',
    template: '%s | Kristall Film',
  },
  description: 'Láminas polarizantes de tecnología alemana para automotriz, arquitectura y PPF.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    siteName: 'Kristall Film',
    type: 'website',
    images: [{ url: '/hero1.png', width: 1200, height: 630, alt: 'Kristall Film' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/hero1.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
