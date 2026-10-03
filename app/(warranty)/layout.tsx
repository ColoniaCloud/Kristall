import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { fontsClassName } from '@/lib/fonts'
import '../globals.css'

export const metadata: Metadata = {
  title: { default: 'Garantía | Kristall Film', template: '%s | Garantía Kristall' },
  robots: { index: false, follow: false },
}

export default function WarrantyLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={fontsClassName}>
      <body className="kf-app-theme min-h-screen bg-background text-foreground antialiased">
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
