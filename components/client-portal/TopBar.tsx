'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Menu, ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NavLinks from './NavLinks'
import NotificationsBell from './NotificationsBell'
import type { AccessLevel } from '@/lib/client-portal/session'

interface Props {
  session: { name: string; company: string | null }
  /** Para el menú del celular; mismo criterio que el Sidebar de escritorio. */
  level: AccessLevel
}

export default function TopBar({ session, level }: Props) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/portal/auth/logout', { method: 'POST' })
    router.push('/cliente/ingresar')
    router.refresh()
  }

  return (
    <header className="flex items-center gap-2 border-b border-border bg-card px-4 md:px-8 py-3">
      {/* En celular la navegación es este sidebar, que entra desde la izquierda.
          En escritorio no existe: ahí el Sidebar está siempre a la vista. */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="crm-theme w-64 p-4">
          <SheetTitle className="mb-4">Kristall — Panel de Cliente</SheetTitle>
          <NavLinks level={level} onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* En escritorio el logo ya lo muestra el Sidebar; acá solo hace falta
          en celular, donde el menú está plegado detrás del botón. */}
      <Image
        src="/LogoPlano.png"
        alt="Kristall Film"
        width={2222}
        height={371}
        priority
        className="h-5 w-auto object-contain md:hidden"
      />

      <div className="ml-auto flex items-center gap-3">
        <NotificationsBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span className="max-w-[140px] truncate">{session.company ?? session.name}</span>
              <ChevronDown className="size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="crm-theme">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">{session.name}</div>
            <DropdownMenuItem onClick={handleLogout} variant="destructive">
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
