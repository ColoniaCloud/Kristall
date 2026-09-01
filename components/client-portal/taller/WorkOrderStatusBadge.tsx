import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { WorkOrderStatus } from '@/lib/client-portal/workshop'

/**
 * Badge de estado de OT.
 *
 * Aparte del `StatusBadge` común porque los estados del taller son otro
 * vocabulario: `TERMINADA` acá es bueno (el trabajo está hecho) y no habría
 * forma de mapearlo bien en la tabla compartida sin que choque con los estados
 * de garantías y de rollos.
 *
 * El color codifica en qué parte del ciclo está, no si "está bien": gris lo que
 * todavía no arrancó, ámbar lo que está en marcha, verde lo que se hizo, y rojo
 * solo lo cancelado.
 */
const ESTILO: Record<WorkOrderStatus, string> = {
  PRESUPUESTADA: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  AGENDADA: 'bg-blue-50 text-blue-700 border-blue-200',
  EN_PROCESO: 'bg-amber-50 text-amber-800 border-amber-200',
  TERMINADA: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ENTREGADA: 'bg-emerald-600/10 text-emerald-800 border-emerald-300',
  CANCELADA: 'bg-red-50 text-red-700 border-red-200',
}

export const ESTADO_LABEL: Record<WorkOrderStatus, string> = {
  PRESUPUESTADA: 'Presupuestada',
  AGENDADA: 'Agendada',
  EN_PROCESO: 'En proceso',
  TERMINADA: 'Terminada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
}

export default function WorkOrderStatusBadge({
  status,
  className,
}: {
  status: WorkOrderStatus
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn('font-medium', ESTILO[status], className)}>
      {ESTADO_LABEL[status]}
    </Badge>
  )
}
