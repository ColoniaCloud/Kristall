import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { ClientContact } from '@/lib/client-portal/api'

export default function StatCards({ contact }: { contact: ClientContact }) {
  const lastPurchase = contact.purchases[0]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">Saldo pendiente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(contact.balance)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">Compras totales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{contact.purchases.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-normal text-muted-foreground">Última compra</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{lastPurchase ? formatCurrency(lastPurchase.total) : '—'}</p>
          {lastPurchase && <p className="text-xs text-muted-foreground">{lastPurchase.saleNumber}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
