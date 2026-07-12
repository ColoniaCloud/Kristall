'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { CLIENT_NAV_ITEMS } from './nav-items'

export default function NavLinks({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void
  collapsed?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {CLIENT_NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`)
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            data-slot="nav-link"
            data-active={active}
            title={collapsed ? label : undefined}
            className={cn(
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-2',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed && label}
          </Link>
        )
      })}
    </nav>
  )
}
