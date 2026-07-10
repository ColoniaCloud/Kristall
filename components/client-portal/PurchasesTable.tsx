import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import StatusBadge from '@/components/common/StatusBadge'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Purchase } from '@/lib/client-portal/api'

export default function PurchasesTable({ purchases }: { purchases: Purchase[] }) {
  if (purchases.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tenés compras registradas.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Venta</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Productos</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado de pago</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.saleNumber}</TableCell>
            <TableCell>{formatDate(p.createdAt)}</TableCell>
            <TableCell className="whitespace-normal">
              {p.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
            </TableCell>
            <TableCell>{formatCurrency(p.total)}</TableCell>
            <TableCell>
              <StatusBadge status={p.paymentStatus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
