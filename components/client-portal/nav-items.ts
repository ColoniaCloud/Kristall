import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  PackageSearch,
  ShieldCheck,
  MessageSquareWarning,
  Bell,
  Wrench,
} from 'lucide-react'
import type { AccessLevel } from '@/lib/client-portal/session'

/**
 * Ítems del menú del portal, con el nivel mínimo que los habilita.
 *
 * `BASIC` es el "Panel Clientes" que obtiene cualquier Cliente al activar su
 * cuenta. `INSTALLER` lo habilita a mano un operador del CRM.
 *
 * Esconder un ítem NO es la barrera de seguridad: el CRM revalida el nivel en
 * cada endpoint y responde 403. Esto es solo para no mostrarle al Cliente
 * secciones que no le sirven.
 */
export const CLIENT_NAV_ITEMS = [
  { href: '/cliente/dashboard', label: 'Dashboard', icon: LayoutDashboard, level: 'BASIC' },
  { href: '/cliente/compras', label: 'Compras', icon: ShoppingBag, level: 'BASIC' },
  { href: '/cliente/cuenta', label: 'Cuenta corriente', icon: Wallet, level: 'BASIC' },
  { href: '/cliente/taller', label: 'Mi Taller', icon: Wrench, level: 'INSTALLER' },
  { href: '/cliente/stock', label: 'Stock', icon: PackageSearch, level: 'INSTALLER' },
  { href: '/cliente/instalaciones', label: 'Instalaciones', icon: ShieldCheck, level: 'INSTALLER' },
  { href: '/cliente/reclamos', label: 'Reclamos', icon: MessageSquareWarning, level: 'INSTALLER' },
  { href: '/cliente/notificaciones', label: 'Notificaciones', icon: Bell, level: 'BASIC' },
] as const satisfies readonly {
  href: string
  label: string
  icon: typeof LayoutDashboard
  level: AccessLevel
}[]

export type ClientNavItem = (typeof CLIENT_NAV_ITEMS)[number]

/** Ítems visibles para un nivel dado. INSTALLER ve todo; BASIC solo los suyos. */
export function navItemsFor(level: AccessLevel): readonly ClientNavItem[] {
  return level === 'INSTALLER'
    ? CLIENT_NAV_ITEMS
    : CLIENT_NAV_ITEMS.filter((i) => i.level === 'BASIC')
}
