import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import CreateInstallationAction from '@/components/client-portal/CreateInstallationAction'
import { formatGarantia } from '@/lib/client-portal/taller-format'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'

/**
 * El stock del instalador: qué rollo, de qué producto, cuánto cubre, y el botón
 * para generar la instalación.
 *
 * Antes esta tabla tenía siete columnas —lote, estado, metros restantes,
 * comprometidos, instalaciones activas—. Son datos ciertos, pero ninguno es el
 * que se necesita acá: esta pantalla se usa con el cliente enfrente, y lo que
 * hay que resolver es «de qué rollo corto y qué garantía le digo». El resto
 * es información de inventario, y su lugar es la pantalla de instalaciones.
 *
 * Los metros se sacaron con la misma lógica. El instalador mira el rollo, no la
 * pantalla, para saber cuánto queda.
 */
export default function StockTable({ rolls }: { rolls: WorkshopStockRoll[] }) {
  if (rolls.length === 0) {
    return <p className="text-sm text-muted-foreground">Todavía no tenés rollos asignados.</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Rollo</TableHead>
          <TableHead>Producto</TableHead>
          <TableHead>Garantía</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rolls.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium tabular-nums">{r.fullRollCode}</TableCell>
            <TableCell>{r.product.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {formatGarantia(r.product.warrantyConfig)}
            </TableCell>
            <TableCell className="text-right">
              <CreateInstallationAction roll={r} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
