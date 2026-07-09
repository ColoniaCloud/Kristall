import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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
  return (
    <>
      {children}
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
    </>
  )
}
