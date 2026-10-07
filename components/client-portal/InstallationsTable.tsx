import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import type { Installation } from '@/lib/client-portal/api'
import { describirSuperficie } from '@/lib/obra'

/**
 * Cómo reconoce el taller cada trabajo. En arquitectura, la dirección de la
 * obra (acá llega completa: es su propia lista) con la superficie debajo; en
 * automotriz, la descripción que se haya cargado.
 */
function Trabajo({ i }: { i: Installation }) {
  if (i.roll.product.category === 'ARCHITECTURAL' && (i.siteAddress || i.areaM2 != null || i.paneCount != null)) {
    const superficie = describirSuperficie(i.areaM2, i.paneCount)
    return (
      <div className="min-w-0">
        <p className="truncate">{i.siteAddress ?? i.assetDescription ?? '—'}</p>
        {superficie && <p className="text-xs text-muted-foreground">{superficie}</p>}
      </div>
    )
  }
  return <span className={i.assetDescription ? undefined : 'text-muted-foreground'}>{i.assetDescription ?? '—'}</span>
}

export default function InstallationsTable({ installations }: { installations: Installation[] }) {
  if (installations.length === 0) {
    return <EmptyState>Todavía no hay garantías activadas por tus clientes.</EmptyState>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Trabajo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Activada</TableHead>
          <TableHead>Vence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {installations.map((i) => (
          <TableRow key={i.id}>
            <TableCell className="font-medium">{i.installationCode}</TableCell>
            <TableCell>{i.roll.product.name}</TableCell>
            <TableCell className="max-w-64">
              <Trabajo i={i} />
            </TableCell>
            <TableCell>
              <StatusBadge status={i.status} />
            </TableCell>
            <TableCell>{formatDate(i.activatedAt)}</TableCell>
            <TableCell>{formatDate(i.expiresAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
