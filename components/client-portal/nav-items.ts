import {
  LayoutDashboard,
  ShoppingBag,
  Wallet,
  PackageSearch,
  ShieldCheck,
  MessageSquareWarning,
  Bell,
  Wrench,
  CalendarDays,
  ClipboardList,
  Users,
  Inbox,
  Settings,
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
  // Mi Taller va segundo, pegado al Dashboard: es donde el instalador pasa el
  // dia. Compras y Cuenta corriente son consultas, no trabajo diario.
  { href: '/cliente/taller', label: 'Mi Taller', icon: Wrench, level: 'INSTALLER' },
  { href: '/cliente/compras', label: 'Compras', icon: ShoppingBag, level: 'BASIC' },
  { href: '/cliente/cuenta', label: 'Cuenta corriente', icon: Wallet, level: 'BASIC' },
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

/**
 * Las pantallas de Mi Taller. Viven acá y no en `taller/layout.tsx` para que
 * sea el mismo array el que dibuja el sidebar secundario en escritorio y la
 * tira de tabs horizontal en celular (`TallerSubNav.tsx`) — una sola fuente,
 * dos contenedores según el ancho.
 */
export const TALLER_SUB_ITEMS = [
  { href: '/cliente/taller', label: 'Resumen', icon: LayoutDashboard },
  { href: '/cliente/taller/agenda', label: 'Agenda', icon: CalendarDays },
  { href: '/cliente/taller/ordenes', label: 'Órdenes', icon: ClipboardList },
  { href: '/cliente/taller/clientes', label: 'Clientes', icon: Users },
  { href: '/cliente/taller/turnos', label: 'Pedidos de turno', icon: Inbox },
  { href: '/cliente/taller/configuracion', label: 'Configuración', icon: Settings },
] as const satisfies readonly {
  href: string
  label: string
  icon: typeof LayoutDashboard
}[]
