import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import StatusBadge from '@/components/common/StatusBadge'
import CreateInstallationAction from '@/components/client-portal/CreateInstallationAction'
import type { StockRoll } from '@/lib/client-portal/api'

export default function StockTable({ rolls }: { rolls: StockRoll[] }) {
  if (rolls.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tenés rollos asignados.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rollo</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Lote</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Instalaciones activas</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rolls.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.fullRollCode}</TableCell>
            <TableCell>
              {r.product.name} <span className="text-muted-foreground">({r.product.sku})</span>
            </TableCell>
            <TableCell>{r.lot.lotNumber}</TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell>{r._count.installations}</TableCell>
            <TableCell>
              <CreateInstallationAction roll={r} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
