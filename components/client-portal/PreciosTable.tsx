import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import EmptyState from '@/components/client-portal/EmptyState'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/format'
import type { PrecioDeProducto } from '@/lib/client-portal/api'

/**
 * La lista de precios del revendedor.
 *
 * Muestra las dos cifras —lista y la suya— y no solo la suya, a propósito: ver
 * el ahorro es el argumento de venta, y es lo que le permite explicarle el
 * precio a su propio comprador.
 *
 * Los productos sin descuento **no se esconden**. Un catálogo que solo lista lo
 * descontado deja al revendedor sin saber cuánto cuesta lo demás, que es la
 * mitad de lo que necesita para armar un pedido.
 */
export default function PreciosTable({ items }: { items: PrecioDeProducto[] }) {
  if (items.length === 0) {
    return <EmptyState>No hay productos activos para mostrar.</EmptyState>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead className="text-right">Precio de lista</TableHead>
          <TableHead className="text-right">Tu precio</TableHead>
          <TableHead>Descuento</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((p) => {
          const tiene = p.descuento > 0
          return (
            <TableRow key={p.id}>
              <TableCell>
                <span className="font-medium">{p.name}</span>
                {p.sku && (
                  <span className="block font-mono text-xs text-muted-foreground">{p.sku}</span>
                )}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {/* Tachado solo cuando hay descuento: tachar un precio que es el
                    que se paga sugiere una rebaja que no existe. */}
                <span className={tiene ? 'text-muted-foreground line-through' : ''}>
                  {formatCurrency(p.precioLista)}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold tabular-nums">
                {formatCurrency(p.precioConDescuento)}
              </TableCell>
              <TableCell>
                {tiene && p.etiqueta ? (
                  <Badge variant="outline">
                    {p.etiqueta.type === 'FIXED'
                      ? `−${formatCurrency(p.etiqueta.value)}`
                      : `−${p.etiqueta.value}%`}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">Sin descuento</span>
                )}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
