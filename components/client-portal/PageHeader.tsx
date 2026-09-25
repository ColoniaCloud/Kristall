import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * La cabecera de toda pantalla del panel.
 *
 * Existe porque cada pantalla venía armando la suya: algunas con subtítulo,
 * otras sin él, unas con el botón de acción en un `flex justify-between` y
 * otras con el título suelto. Cuatro de las siete pantallas del portal no
 * explicaban en ninguna parte qué era lo que estabas mirando.
 *
 * Los cuatro slots cubren las cinco formas que había dispersas — título solo,
 * título con bajada, título con botón, título con estado al lado, y detalle
 * con vuelta atrás. Si aparece una sexta, el lugar de resolverla es acá: una
 * pantalla que se arma su propia cabecera es por donde vuelve a empezar la
 * deriva.
 */
export default function PageHeader({
  title,
  description,
  action,
  badge,
  back,
}: {
  title: string
  /** Una línea, en presente y en segunda persona. Opcional solo si el título ya lo dice todo. */
  description?: React.ReactNode
  /** El botón principal de la pantalla, o una cifra de resumen. Va a la derecha. */
  action?: React.ReactNode
  /** Estado de lo que se está mirando. Va pegado al título, no a la derecha. */
  badge?: React.ReactNode
  /** Para las pantallas de detalle: a dónde se vuelve, y cómo se llama ese lugar. */
  back?: { href: string; label: string }
}) {
  return (
    <header className="flex flex-col gap-3">
      {back && (
        <Link
          href={back.href}
          className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {back.label}
        </Link>
      )}

      <div
        className={cn(
          // Separación generosa contra el bloque de título: un botón aislado se
        // nota más que uno grande pegado a un párrafo.
        'flex flex-wrap justify-between gap-x-6 gap-y-4 md:gap-x-10',
          // Con bajada el botón se alinea arriba, contra el título. Sin bajada
          // se centra: un botón de 44px arriba de un título de 33 queda
          // visiblemente desbalanceado.
          description ? 'items-start' : 'items-center'
        )}
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            {/* 31px en escritorio contra los 19 del título de sección: antes
                eran 25 contra 19 y los dos niveles se confundían. En celular
                se queda en 25, que es lo que entra sin partir un nombre
                largo de cliente en tres renglones. */}
            <h1 className="font-heading text-2xl font-semibold md:text-3xl">{title}</h1>
            {badge}
          </div>
          {description && (
            // max-w para que en una pantalla ancha el renglón no se estire
            // hasta volverse incómodo de leer.
            <p className="mt-1 max-w-prose text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
    </header>
  )
}
