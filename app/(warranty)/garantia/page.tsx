import type { Metadata } from 'next'
import Link from 'next/link'
import WarrantyTokenLookup from '@/components/warranty/WarrantyTokenLookup'
import FeaturedProductsSlide from '@/components/warranty/FeaturedProductsSlide'
import LineLogosStrip from '@/components/warranty/LineLogosStrip'
import StaticHeader from '@/components/layout/StaticHeader'
import StaticFooter from '@/components/layout/StaticFooter'

export const metadata: Metadata = { title: 'Activar mi garantía' }

export default function GarantiaLandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <StaticHeader />
      {/* bg-background: opaco para tapar el footer (sticky bottom-0 por debajo,
          z-0) hasta que el usuario llegue al final — mismo efecto cortina que
          usa el layout de [locale] con su <main>. Sin este fondo, el footer
          se ve "a través" del contenido en vez de revelarse al hacer scroll. */}
      <main className="relative z-10 flex-1 bg-background">
        <div className="mx-auto w-full max-w-[1160px] px-4 py-16 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Columna 1: activación / consulta de garantía */}
          <div className="w-full max-w-lg mx-auto md:mx-0 flex flex-col gap-6">
            <div className="text-center md:text-left">
              <h1 className="font-heading text-2xl font-semibold">Garantía Kristall Film</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Consulta o activa la garantía de tus productos Kristall
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <p className="mb-1 text-sm font-medium">¿Tenés tu link de activación?</p>
              <p className="mb-4 text-sm text-muted-foreground">
                Cuando compraste tu producto, el taller o distribuidor te entregó un link único (revisá tu email o
                WhatsApp). Pegalo acá para activar o consultar tu garantía.
              </p>
              <WarrantyTokenLookup />
            </div>

            <div className="text-center md:text-left text-sm text-muted-foreground">
              ¿Ya activaste tu garantía y configuraste una contraseña?{' '}
              <Link href="/garantia/acceder" className="font-medium text-foreground underline">
                Ingresá acá
              </Link>
            </div>
          </div>

          {/* Columna 2: fotos destacadas de producto + carrusel de líneas */}
          <div className="w-full rounded-2xl overflow-hidden border border-border">
            <FeaturedProductsSlide />
            <LineLogosStrip />
          </div>
        </div>
      </main>
      <StaticFooter />
    </div>
  )
}
