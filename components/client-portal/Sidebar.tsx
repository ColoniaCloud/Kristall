'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import NavLinks from './NavLinks'

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'hidden md:flex shrink-0 flex-col bg-card py-4 transition-[width] duration-200',
        collapsed ? 'w-16 items-center px-2' : 'w-56 px-3'
      )}
    >
      <div
        className={cn(
          'mb-6 flex items-center',
          collapsed ? 'flex-col gap-2' : 'justify-between px-1'
        )}
      >
        {collapsed ? (
          <Image
            src="/ProfilePic.jpg"
            alt="Kristall"
            width={239}
            height={239}
            className="size-8 rounded-md object-cover"
          />
        ) : (
          <Image
            src="/LogoPlano.png"
            alt="Kristall Film"
            width={2222}
            height={371}
            priority
            className="h-6 w-auto object-contain"
          />
        )}

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          className="flex shrink-0 items-center justify-center rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <NavLinks collapsed={collapsed} />
    </aside>
  )
}
