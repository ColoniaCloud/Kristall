import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import type { Claim } from '@/lib/client-portal/api'

export default function ClaimsTable({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no cargaste reclamos.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Instalación</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.installation.installationCode}</TableCell>
            <TableCell className="max-w-xs truncate whitespace-normal">{c.description}</TableCell>
            <TableCell>{formatDate(c.createdAt)}</TableCell>
            <TableCell>
              <StatusBadge status={c.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
