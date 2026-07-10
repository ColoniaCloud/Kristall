import type { Metadata } from 'next'
import { getStatus, type WarrantyStatus } from '@/lib/warranty/api'
import { CrmApiError } from '@/lib/crm/api'
import WarrantyTokenView from '@/components/warranty/WarrantyTokenView'

export const metadata: Metadata = { title: 'Tu garantía' }

interface Props {
  params: Promise<{ token: string }>
}

export default async function TokenPage({ params }: Props) {
  const { token } = await params

  let status: WarrantyStatus | null = null
  try {
    status = await getStatus(token)
  } catch (err) {
    if (!(err instanceof CrmApiError && err.status === 404)) throw err
  }

  if (!status) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-lg font-medium">Garantía no encontrada</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          El link que usaste no es válido o el token está mal copiado. Revisá el link que te dio el taller o
          Kristall.
        </p>
      </div>
    )
  }

  return <WarrantyTokenView token={token} initialStatus={status} />
}
