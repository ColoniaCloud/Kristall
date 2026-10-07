import type { Metadata } from 'next'
import ClaimForm from '@/components/warranty/ClaimForm'
import { getStatus } from '@/lib/warranty/api'

export const metadata: Metadata = { title: 'Reportar un problema' }

export default async function ReclamoPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  // El rubro decide qué problemas se ofrecen (la rotura del vidrio es de
  // arquitectura). Si el CRM no contesta, el formulario igual se muestra con
  // las opciones comunes: un reclamo no puede quedar trabado por esto.
  const categoria = await getStatus(token)
    .then((s) => s.productCategory)
    .catch(() => null)

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center gap-6 px-4 py-16">
      <div>
        <h1 className="font-heading text-2xl font-semibold">Reportar un problema</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completá el mismo email o DNI que usaste al activar tu garantía.
        </p>
      </div>
      <ClaimForm token={token} categoria={categoria} />
    </div>
  )
}
