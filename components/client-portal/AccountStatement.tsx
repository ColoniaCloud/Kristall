import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/format'
import type { ClientAccount, AccountPlan, InstallmentStatus } from '@/lib/client-portal/api'

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
        className={
          tone === 'bad'
            ? 'text-xl font-semibold text-destructive'
            : tone === 'good'
              ? 'text-xl font-semibold text-primary'
              : 'text-xl font-semibold'
        }
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
export default function AccountStatement({ account }: { account: ClientAccount }) {
  const { summary, entries, plans } = account
  // Negativo = pagó de más o tiene una nota de crédito. Se muestra como saldo a
  // favor, no como deuda cero.
  const aFavor = summary.balance < 0
  const planesVigentes = plans.filter((p) => p.status !== 'CANCELLED')

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total comprado" value={formatCurrency(summary.totalInvoiced)} />
        <StatCard label="Total pagado" value={formatCurrency(summary.totalPaid)} tone="good" />
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
          <p className="text-sm text-muted-foreground">Todavía no hay movimientos en tu cuenta.</p>
        ) : (
          <div className="overflow-x-auto">
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
          </div>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          El saldo se calcula como el total de tus compras menos todo lo que pagaste. Si ves un saldo
          a tu favor, es plata que quedó a cuenta para tu próxima compra.
        </p>
      </section>
    </div>
  )
}
