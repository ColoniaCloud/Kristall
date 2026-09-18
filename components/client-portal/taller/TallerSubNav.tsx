'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { TALLER_SUB_ITEMS } from '@/components/client-portal/nav-items'

/**
 * El sub-menú de Mi Taller: sidebar vertical en escritorio, tira de tabs
 * horizontal scrolleable en celular — mismo array (`TALLER_SUB_ITEMS`), dos
 * contenedores según el ancho.
 *
 * Antes no había ninguna forma de moverse entre estas seis pantallas salvo
 * volver a la home de Mi Taller y tocar uno de los botones de ahí abajo.
 */
export default function TallerSubNav({ pedidosPendientes = 0 }: { pedidosPendientes?: number }) {
  const pathname = usePathname()

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border pb-2 md:w-48 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:border-border md:pb-0 md:pr-4">
      {TALLER_SUB_ITEMS.map(({ href, label, icon: Icon }) => {
        // "Resumen" (la base) solo está activo en la ruta exacta — si no, se
        // marcaría a sí mismo activo en cualquier otra pantalla de Mi Taller.
        const active = href === '/cliente/taller' ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            data-active={active}
            // Anclas del recorrido guiado de "taller" (ver recorrido.ts):
            // antes vivían en los botones de la home que sacamos, porque
            // este sub-menú los reemplaza uno a uno.
            data-tour={
              href === '/cliente/taller/turnos'
                ? 'nav-turnos'
                : href === '/cliente/taller/configuracion'
                  ? 'nav-configuracion'
                  : undefined
            }
            className={cn(
              'flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {label}
            {/* Solo cuando hay algo esperando: un cero permanente deja de
                significar nada y se vuelve invisible. */}
            {href === '/cliente/taller/turnos' && pedidosPendientes > 0 && (
              <span
                className={cn(
                  'ml-auto rounded-full px-1.5 text-xs font-semibold',
                  active ? 'bg-background/20' : 'bg-primary text-primary-foreground'
                )}
              >
                {pedidosPendientes}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
