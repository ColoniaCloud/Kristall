'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronDown, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import NotificationsBell from './NotificationsBell'

interface Props {
  session: { name: string; company: string | null }
}

export default function TopBar({ session }: Props) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/portal/auth/logout', { method: 'POST' })
    router.push('/cliente/ingresar')
    router.refresh()
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-4 md:px-8 py-3">
      {/* En escritorio el logo ya lo muestra el Sidebar; acá solo hace falta
          en celular, que ahora navega por la bottom nav y se quedó sin
          ninguna marca fija en pantalla. */}
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
