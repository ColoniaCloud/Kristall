import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import CreateInstallationAction from '@/components/client-portal/CreateInstallationAction'
import CopiarLinkGarantia from '@/components/client-portal/CopiarLinkGarantia'
import { formatGarantia } from '@/lib/client-portal/taller-format'
import type { WorkshopStockRoll } from '@/lib/client-portal/workshop'
import type { StockRoll } from '@/lib/client-portal/api'

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
 *
 * ─── La misma tabla sirve para un revendedor, con otra acción ──────────────
 *
 * Un revendedor no instala: no genera sub-códigos. Lo que hace con un rollo es
 * vendérselo a un taller, y para eso necesita pasarle el link de garantía. Es la
 * misma información —qué rollo, de qué producto, cuánto cubre— con otro verbo al
 * final, así que es una columna distinta y no una tabla distinta.
 */
/**
 * Los dos modos llegan con **formas de rollo distintas**, y por eso el tipo es
 * una unión discriminada en vez de un booleano suelto:
 *
 *   - el instalador trae `WorkshopStockRoll`, con los m² que el taller necesita
 *     y que `CreateInstallationAction` usa;
 *   - el revendedor trae `StockRoll`, sin m² —no corta láminas— y con
 *     `warrantyUrl`.
 *
 * Escribirlo así hace que el compilador impida pasarle un rollo de revendedor a
 * la acción de instalar, que es justo el error que un `esRevendedor?: boolean`
 * dejaría pasar.
 */
type StockTableProps =
  | { esRevendedor: true; rolls: StockRoll[] }
  | { esRevendedor?: false; rolls: WorkshopStockRoll[] }

export default function StockTable(props: StockTableProps) {
  const esRevendedor = props.esRevendedor === true
  if (props.rolls.length === 0) {
    return (
      <EmptyState>
        {esRevendedor
          ? 'Todavía no tenés rollos comprados.'
          : 'Todavía no tenés rollos asignados.'}
      </EmptyState>
    )
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
        {/* Los dos `map` viven separados para que cada rama vea su propio tipo
            de rollo. Uno solo con un cast compilaría, pero perdería justo la
            garantía que da la union discriminada: que a la acción de instalar no
            se le pueda pasar un rollo de revendedor. */}
        {props.esRevendedor
          ? props.rolls.map((r) => (
              <Fila key={r.id} roll={r}>
                {/* `warrantyUrl` viene null cuando el rollo ya no tiene ninguna
                    instalación sin activar: no hay nada que pasar, y un botón
                    que lleva a "ya fue activada" confunde más de lo que ayuda. */}
                {r.warrantyUrl ? (
                  <CopiarLinkGarantia url={r.warrantyUrl} />
                ) : (
                  <span className="text-sm text-muted-foreground">Garantía ya activada</span>
                )}
              </Fila>
            ))
          : props.rolls.map((r) => (
              <Fila key={r.id} roll={r}>
                <CreateInstallationAction roll={r} />
              </Fila>
            ))}
      </TableBody>
    </Table>
  )
}

/** Las celdas que los dos modos comparten. Lo único que cambia es la acción. */
function Fila({
  roll,
  children,
}: {
  roll: Pick<WorkshopStockRoll, 'fullRollCode' | 'product'> | Pick<StockRoll, 'fullRollCode' | 'product'>
  children: React.ReactNode
}) {
  return (
    <TableRow>
      <TableCell className="font-medium tabular-nums">{roll.fullRollCode}</TableCell>
      <TableCell>{roll.product.name}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatGarantia(roll.product.warrantyConfig)}
      </TableCell>
      <TableCell className="text-right">{children}</TableCell>
    </TableRow>
  )
}
