import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

const COLOR_MAP: Record<string, string> = {
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  IN_USE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PAID: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  PARTIAL: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
  IN_STOCK: 'bg-blue-50 text-blue-700 border-blue-200',
  SOLD: 'bg-blue-50 text-blue-700 border-blue-200',
  OPEN: 'bg-blue-50 text-blue-700 border-blue-200',
  EXPIRED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  EXHAUSTED: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  VOIDED: 'bg-red-50 text-red-700 border-red-200',
  REJECTED: 'bg-red-50 text-red-700 border-red-200',
}

const LABEL_MAP: Record<string, string> = {
  ACTIVE: 'Activa',
  PENDING: 'Pendiente',
  EXPIRED: 'Vencida',
  VOIDED: 'Anulada',
  IN_STOCK: 'En stock',
  SOLD: 'Vendido',
  IN_USE: 'En uso',
  EXHAUSTED: 'Agotado',
  OPEN: 'Abierto',
  IN_REVIEW: 'En revisión',
  RESOLVED: 'Resuelto',
  REJECTED: 'Rechazado',
  PAID: 'Pagado',
  PARTIAL: 'Parcial',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn('font-medium', COLOR_MAP[status] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200')}
    >
      {LABEL_MAP[status] ?? status}
    </Badge>
  )
}
