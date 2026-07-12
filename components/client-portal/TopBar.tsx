'use client'

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

interface Props {
  session: { name: string; company: string }
}

export default function TopBar({ session }: Props) {
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/portal/auth/logout', { method: 'POST' })
    router.push('/cliente/ingresar')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 md:px-8 py-3">
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="crm-theme w-64 p-4">
          <SheetTitle className="mb-4">Kristall — Panel de Cliente</SheetTitle>
          <NavLinks onNavigate={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      <div className="flex items-center gap-3 ml-auto">
        <NotificationsBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span className="max-w-[140px] truncate">{session.company}</span>
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
