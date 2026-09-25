import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/format'
import type { ClientContact } from '@/lib/client-portal/api'

export default function StatCards({
  contact,
  turnosHoy,
  notificacionesSinLeer,
}: {
  contact: ClientContact
  /**
   * Turnos agendados para hoy en Mi Taller. `null` cuando el Cliente no tiene
   * taller (nivel BASIC) o cuando el CRM no contestó — en los dos casos el card
   * no se dibuja, que es mejor que mostrar un cero que no es cierto.
   */
  turnosHoy?: number | null
  /** Notificaciones sin leer. `null` si la llamada al CRM falló. */
  notificacionesSinLeer?: number | null
}) {
  const lastPurchase = contact.purchases[0]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-normal text-muted-foreground">Saldo pendiente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatCurrency(contact.balance)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-normal text-muted-foreground">Compras totales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{contact.purchases.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-xs font-normal text-muted-foreground">Última compra</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{lastPurchase ? formatCurrency(lastPurchase.total) : '—'}</p>
          {lastPurchase && <p className="text-xs text-muted-foreground">{lastPurchase.saleNumber}</p>}
        </CardContent>
      </Card>

      {/* Los dos siguientes sí llevan a algún lado: son un número que invita a
          ir a verlo, no un dato de cierre como el saldo o la última compra. */}
      {turnosHoy !== null && turnosHoy !== undefined && (
        <CardConLink
          href="/cliente/taller/agenda"
          titulo="Turnos de hoy"
          valor={String(turnosHoy)}
          pie="Ver la agenda"
        />
      )}
      {notificacionesSinLeer !== null && notificacionesSinLeer !== undefined && (
        <CardConLink
          href="/cliente/notificaciones"
          titulo="Notificaciones"
          valor={String(notificacionesSinLeer)}
          pie={notificacionesSinLeer === 0 ? 'Estás al día' : 'sin leer'}
        />
      )}
    </div>
  )
}

function CardConLink({
  href,
  titulo,
  valor,
  pie,
}: {
  href: string
  titulo: string
  valor: string
  pie: string
}) {
  return (
    /* El realce del hover va por `brightness` y no por fondo ni ring: dentro
       de .crm-theme las cards llevan un gradiente y `box-shadow: none` puestos
       en CSS plano, que le ganan a cualquier utility de color o de ring. */
    <Link
      href={href}
      className="block h-full rounded-xl transition-[filter] duration-150 hover:brightness-125"
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xs font-normal text-muted-foreground">{titulo}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold tabular-nums">{valor}</p>
          <p className="text-xs text-muted-foreground">{pie}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
