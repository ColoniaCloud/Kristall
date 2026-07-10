import { formatDate } from '@/lib/format'
import StatusBadge from '@/components/common/StatusBadge'
import type { WarrantyStatus } from '@/lib/warranty/api'

export default function StatusCard({ status }: { status: WarrantyStatus }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{status.installationCode}</p>
          <p className="font-heading text-lg font-semibold">{status.product.name}</p>
          <p className="text-xs text-muted-foreground">{status.product.brand}</p>
        </div>
        <StatusBadge status={status.status} />
      </div>
      {status.isActive && (
        <div className="flex flex-col gap-1 border-t border-border pt-4 text-sm">
          <p>
            <span className="text-muted-foreground">Días restantes:</span>{' '}
            <span className="font-medium">{status.daysRemaining}</span>
          </p>
          <p>
            <span className="text-muted-foreground">Vence:</span>{' '}
            <span className="font-medium">{formatDate(status.expiresAt)}</span>
          </p>
        </div>
      )}
    </div>
  )
}
