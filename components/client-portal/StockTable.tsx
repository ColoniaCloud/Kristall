import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import StatusBadge from '@/components/common/StatusBadge'
import CreateInstallationAction from '@/components/client-portal/CreateInstallationAction'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'

/**
 * El stock del instalador, con cuánta lámina queda en cada rollo.
 *
 * Desde la Fase 4 esta pantalla consume `/workshop/stock` en vez de `/stock`:
 * es el mismo listado más los metros. Los cuatro números que trae el CRM se
 * muestran como dos, que son los que el instalador usa:
 *
 *   **Quedan**      lo que físicamente hay en el rollo (total − cortado).
 *   **Disponibles** con lo que puede contar para un trabajo nuevo, o sea
 *                   descontando además lo comprometido en órdenes que todavía
 *                   no cortó.
 *
 * Cuando los dos coinciden se muestra uno solo: repetir el mismo número dos
 * veces con etiquetas distintas hace dudar de los dos.
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
          <TableHead>Lote</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Lámina</TableHead>
          <TableHead>Instalaciones activas</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rolls.map((r) => (
          <TableRow key={r.id}>
            <TableCell className="font-medium">{r.fullRollCode}</TableCell>
            <TableCell>
              {r.product.name}{' '}
              {/* El SKU es opcional en el CRM; sin este chequeo quedaba "()" colgando. */}
              {r.product.sku && <span className="text-muted-foreground">({r.product.sku})</span>}
            </TableCell>
            <TableCell>{r.lot.lotNumber}</TableCell>
            <TableCell>
              <StatusBadge status={r.status} />
            </TableCell>
            <TableCell className="text-right tabular-nums">
              <Metros roll={r} />
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

function Metros({ roll }: { roll: WorkshopStockRoll }) {
  // null y no 0: el producto no tiene medidas cargadas, así que no sabemos
  // cuánto queda. Decir "0 m²" sería afirmar algo falso.
  if (roll.remainingM2 === null) {
    return <span className="text-sm text-muted-foreground">Sin medidas</span>
  }
  const comprometido = roll.availableM2 !== null && roll.availableM2 !== roll.remainingM2
  return (
    <span className="flex flex-col items-end leading-tight">
      <span className="font-medium">{roll.remainingM2} m²</span>
      {comprometido && (
        <span className="text-xs text-muted-foreground">
          {roll.availableM2} libres · {roll.reservedM2} comprometidos
        </span>
      )}
    </span>
  )
}
