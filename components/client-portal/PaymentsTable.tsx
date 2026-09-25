import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import { formatCurrency, formatDate } from '@/lib/format'
import type { Payment } from '@/lib/client-portal/api'

export default function PaymentsTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <EmptyState>Todavía no registraste pagos.</EmptyState>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Venta</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Método</TableHead>
          <TableHead>Monto</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-medium">{p.saleNumber}</TableCell>
            <TableCell>{formatDate(p.date)}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>{formatCurrency(p.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
