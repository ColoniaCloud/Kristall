'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { bottomNavFor } from './nav-items'
import NavLinks from './NavLinks'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { AccessLevel } from '@/lib/client-portal/session'

/**
 * La navegación primaria en celular.
 *
 * Antes era un menú escondido detrás de una hamburguesa en el `TopBar` — un
 * tap extra para llegar a algo que se usa todo el día. Ahora las secciones
 * que más se tocan quedan siempre a la vista, al alcance del pulgar, y el
 * resto se junta detrás de "Más" (mismo mecanismo de `Sheet` que usaba el
 * menú viejo — ahí sí es la excepción, no la regla).
 *
 * Nunca se muestra en escritorio (`md:hidden`): ahí sigue mandando el
 * `Sidebar` de siempre, sin ningún cambio.
 */
export default function BottomNav({ level }: { level: AccessLevel }) {
  const pathname = usePathname()
  const [masAbierto, setMasAbierto] = useState(false)
  const { fixed, overflow } = bottomNavFor(level)

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
      {fixed.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-center text-[0.7rem] leading-tight font-medium transition-colors',
              active ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className="size-5" />
            {label}
          </Link>
        )
      })}

      {overflow.length > 0 && (
        <Sheet open={masAbierto} onOpenChange={setMasAbierto}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="flex flex-1 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[0.7rem] font-medium text-muted-foreground transition-colors"
            >
              <MoreHorizontal className="size-5" />
              Más
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="crm-theme">
            <SheetTitle>Más secciones</SheetTitle>
            <NavLinks level={level} items={overflow} onNavigate={() => setMasAbierto(false)} />
          </SheetContent>
        </Sheet>
      )}
    </nav>
  )
}
