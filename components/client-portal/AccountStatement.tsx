import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import EmptyState from '@/components/client-portal/EmptyState'
import MonthlyTotalCard from '@/components/client-portal/MonthlyTotalCard'
import { formatCurrency, formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import { totalesPorMes, mesActual } from '@/lib/client-portal/account-months'
import type {
  ClientAccount,
  AccountPlan,
  InstallmentStatus,
  PaymentDeclaration,
  PaymentDeclarationStatus,
} from '@/lib/client-portal/api'

const DECLARATION_STATUS_LABEL: Record<PaymentDeclarationStatus, string> = {
  PENDING: 'Pendiente de revisión',
  CONFIRMED: 'Confirmado',
  REJECTED: 'Rechazado',
}

const DECLARATION_STATUS_VARIANT: Record<PaymentDeclarationStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PENDING: 'outline',
  CONFIRMED: 'default',
  REJECTED: 'destructive',
}

const STATUS_LABEL: Record<InstallmentStatus, string> = {
  PENDING: 'Pendiente',
  PARTIAL: 'Parcial',
  PAID: 'Pagada',
  OVERDUE: 'Vencida',
}

const STATUS_VARIANT: Record<InstallmentStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  PAID: 'default',
  PARTIAL: 'secondary',
  PENDING: 'outline',
  OVERDUE: 'destructive',
}

const FREQUENCY_LABEL: Record<AccountPlan['frequency'], string> = {
  WEEKLY: 'semanal',
  BIWEEKLY: 'quincenal',
  MONTHLY: 'mensual',
  CUSTOM: 'a medida',
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'good' | 'bad'
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          'text-xl font-semibold tabular-nums',
          tone === 'bad' && 'text-destructive',
          tone === 'good' && 'text-primary'
        )}
      >
        {value}
      </p>
      {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

/**
 * Cuenta corriente del Cliente.
 *
 * Es la misma vista y el mismo cálculo que ve el operador en el CRM, a
 * propósito: si los números no coincidieran, el panel no serviría.
 */
export default function AccountStatement({
  account,
  declarations,
}: {
  account: ClientAccount
  /** Pagos que el cliente declaró desde el portal, con su estado de revisión. */
  declarations: PaymentDeclaration[]
}) {
  const { summary, entries, plans } = account
  // Negativo = pagó de más o tiene una nota de crédito. Se muestra como saldo a
  // favor, no como deuda cero.
  const aFavor = summary.balance < 0
  const planesVigentes = plans.filter((p) => p.status !== 'CANCELLED')

  // Los dos primeros cards van por mes, no por toda la vida de la cuenta. Se
  // resuelve acá arriba, en el servidor, y no dentro de cada card: es el mismo
  // recorrido de movimientos para los dos, y así el corte de mes no depende de
  // la zona horaria del navegador. Ver `account-months.ts`.
  const totales = totalesPorMes(entries)
  const mesCorriente = mesActual()

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MonthlyTotalCard
          label="Total comprado"
          metrica="comprado"
          totales={totales}
          mesActual={mesCorriente}
        />
        <MonthlyTotalCard
          label="Total pagado"
          metrica="pagado"
          totales={totales}
          mesActual={mesCorriente}
          tone="good"
        />
        <StatCard
          label={aFavor ? 'Saldo a tu favor' : 'Saldo pendiente'}
          value={formatCurrency(Math.abs(summary.balance))}
          tone={aFavor ? 'good' : summary.balance > 0 ? 'bad' : undefined}
        />
        <StatCard
          label="Vencido"
          value={summary.overdueAmount > 0 ? formatCurrency(summary.overdueAmount) : '—'}
          tone={summary.overdueAmount > 0 ? 'bad' : undefined}
          hint={summary.nextDueDate ? `Próximo vencimiento: ${formatDate(summary.nextDueDate)}` : undefined}
        />
      </div>

      {planesVigentes.map((plan) => (
        <section key={plan.id}>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-medium">Cuotas de la compra #{plan.saleNumber}</h2>
            <Badge variant={plan.status === 'COMPLETED' ? 'default' : 'outline'}>
              {plan.status === 'COMPLETED' ? 'Completado' : 'En curso'}
            </Badge>
            {plan.overdueCount > 0 && (
              <Badge variant="destructive">
                {plan.overdueCount} vencida{plan.overdueCount > 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="mb-3 text-sm text-muted-foreground">
            {plan.installmentCount} cuotas · pago {FREQUENCY_LABEL[plan.frequency]} ·{' '}
            {formatCurrency(plan.financedTotal)}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuota</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Resta</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plan.installments.map((c) => (
                <TableRow key={c.id} id={`cuota-${c.id}`}>
                  <TableCell className="font-medium">
                    {c.number}/{plan.installmentCount}
                  </TableCell>
                  <TableCell>{formatDate(c.dueDate)}</TableCell>
                  <TableCell>{formatCurrency(c.amount)}</TableCell>
                  <TableCell>{c.remaining > 0 ? formatCurrency(c.remaining) : '—'}</TableCell>
                  <TableCell>
                    <Badge variant={STATUS_VARIANT[c.status]}>{STATUS_LABEL[c.status]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      ))}

      <section>
        <h2 className="mb-3 text-lg font-medium">Movimientos</h2>
        {entries.length === 0 ? (
          <EmptyState>Todavía no hay movimientos en tu cuenta.</EmptyState>
        ) : (
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Detalle</TableHead>
                  <TableHead className="text-right">Debe</TableHead>
                  <TableHead className="text-right">Haber</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((e) => (
                  <TableRow key={`${e.type}-${e.id}`}>
                    <TableCell className="whitespace-nowrap">{formatDate(e.date)}</TableCell>
                    <TableCell>{e.description}</TableCell>
                    <TableCell className="text-right">
                      {e.debit > 0 ? formatCurrency(e.debit) : '—'}
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {e.credit > 0 ? formatCurrency(e.credit) : '—'}
                    </TableCell>
                    <TableCell
                      className={
                        e.balance < 0
                          ? 'text-right font-medium text-primary'
                          : 'text-right font-medium'
                      }
                    >
                      {formatCurrency(e.balance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          El saldo se calcula como el total de tus compras menos todo lo que pagaste. Si ves un saldo
          a tu favor, es plata que quedó a cuenta para tu próxima compra.
        </p>
      </section>

      {declarations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-medium">Pagos declarados</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Lo que avisaste con &quot;Registrar un pago&quot;. Todavía no descuenta de tu saldo
            hasta que lo confirmemos.
          </p>
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Compra</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {declarations.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="whitespace-nowrap">{formatDate(d.createdAt)}</TableCell>
                    <TableCell>#{d.saleNumber}</TableCell>
                    <TableCell>{formatCurrency(d.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={DECLARATION_STATUS_VARIANT[d.status]}>
                        {DECLARATION_STATUS_LABEL[d.status]}
                      </Badge>
                      {d.status === 'REJECTED' && d.rejectionReason && (
                        <p className="mt-1 text-xs text-muted-foreground">{d.rejectionReason}</p>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
          </Table>
        </section>
      )}
    </div>
  )
}
