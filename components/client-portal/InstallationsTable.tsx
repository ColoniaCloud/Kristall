import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import type { Installation } from '@/lib/client-portal/api'

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
