import type { Metadata } from 'next'
import Link from 'next/link'
import WarrantyTokenLookup from '@/components/warranty/WarrantyTokenLookup'

export const metadata: Metadata = { title: 'Activar mi garantía' }

export default function GarantiaLandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <div className="text-center">
        <h1 className="font-heading text-2xl font-semibold">Garantía Kristall Film</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Activá o consultá la garantía de tu lámina, PPF o vidrio Kristall.
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

      <div className="text-center text-sm text-muted-foreground">
        ¿Ya activaste tu garantía y configuraste una contraseña?{' '}
        <Link href="/garantia/acceder" className="font-medium text-foreground underline">
          Ingresá acá
        </Link>
      </div>
    </div>
  )
}
