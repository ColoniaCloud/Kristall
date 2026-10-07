import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/format'
import type { Claim } from '@/lib/client-portal/api'
import { CLAIM_ISSUE_LABELS } from '@/lib/reclamos'

export default function ClaimsTable({ claims }: { claims: Claim[] }) {
  if (claims.length === 0) {
    return <EmptyState>Todavía no cargaste reclamos.</EmptyState>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Instalación</TableHead>
          <TableHead>Problema</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {claims.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-medium">{c.installation.installationCode}</TableCell>
            <TableCell>
              {/* Null en los reclamos anteriores a octubre 2026, que eran solo texto. */}
              {c.issueType ? CLAIM_ISSUE_LABELS[c.issueType] : <span className="text-muted-foreground">—</span>}
              {c.affectedPanes && (
                <span className="block text-xs text-muted-foreground">
                  {c.affectedPanes} {c.affectedPanes === 1 ? 'paño' : 'paños'}
                </span>
              )}
            </TableCell>
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
