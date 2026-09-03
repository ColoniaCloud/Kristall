import Image from 'next/image'
import { vehicleType, vehicleLabel } from '@/lib/vehicle-types'
import type { WarrantyStatus } from '@/lib/warranty/api'

/**
 * La ficha del trabajo, arriba del formulario de activación.
 *
 * Lo que hay acá lo cargó el taller con el auto adelante. Mostrárselo a la
 * persona antes de que complete nada cambia el tono de la página: deja de ser
 * un formulario que le pide datos y pasa a ser algo que ya sabe quién es y qué
 * le hicieron. Y si algo está mal —la patente, el mail— lo ve ahora, que es
 * cuando todavía se puede corregir sin llamar a nadie.
 *
 * Si el taller no cargó nada, no se dibuja: una ficha con cuatro guiones es
 * peor que ninguna ficha.
 */
export default function InstallationSummary({ status }: { status: WarrantyStatus }) {
  const vehiculo = vehicleType(status.vehicleType)
  const filas: [string, string][] = []

  if (status.vehicleType) filas.push(['Tipo de vehículo', vehicleLabel(status.vehicleType)!])
  if (status.plate) filas.push(['Patente', status.plate])
  filas.push(['Duración de la garantía', `${formatDuracion(status.warrantyMonths)} desde que queda activa`])
  if (status.clientEmail) filas.push(['Mail del cliente', status.clientEmail])

  // Solo la duración quiere decir que el taller no precargó nada del trabajo.
  if (filas.length === 1) return null

  return (
    <section className="flex items-center gap-4 rounded-xl border border-border bg-muted/30 p-4">
      {vehiculo && (
        <Image
          src={vehiculo.icon}
          alt=""
          width={64}
          height={44}
          className="hidden h-11 w-auto shrink-0 object-contain opacity-80 dark:invert sm:block"
        />
      )}
      <dl className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {filas.map(([etiqueta, valor]) => (
          <div key={etiqueta} className="contents">
            <dt className="text-muted-foreground">{etiqueta}</dt>
            <dd className="min-w-0 break-words font-medium">{valor}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Años cuando la cuenta da exacta, meses cuando no. Nadie dice "1,5 años". */
function formatDuracion(meses: number): string {
  if (meses % 12 === 0) {
    const años = meses / 12
    return `${años} ${años === 1 ? 'año' : 'años'}`
  }
  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`
}
