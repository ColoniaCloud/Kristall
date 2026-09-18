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

/**
 * Los cuatro que van fijos en la bottom nav del celular, para INSTALLER.
 *
 * Mi Taller es donde el instalador pasa el día (turnos, agenda, órdenes);
 * Stock y Cuenta corriente son las consultas más frecuentes después de eso.
 * El resto (Compras, Instalaciones, Reclamos, Notificaciones) va detrás del
 * botón "Más".
 */
const FIJOS_INSTALLER = [
  '/cliente/dashboard',
  '/cliente/taller',
  '/cliente/stock',
  '/cliente/cuenta',
] as const

/**
 * Cómo se reparten los ítems del nivel entre la bottom nav y el "Más".
 *
 * BASIC tiene exactamente 4 secciones hoy, así que entran todas fijas sin
 * necesitar overflow — si en el futuro se le agrega una quinta, esta función
 * es el único lugar que hay que tocar para decidir cuál corre al "Más".
 */
export function bottomNavFor(level: AccessLevel): {
  fixed: readonly ClientNavItem[]
  overflow: readonly ClientNavItem[]
} {
  const items = navItemsFor(level)
  if (level === 'BASIC') return { fixed: items, overflow: [] }

  const porHref = new Map(items.map((i) => [i.href, i]))
  const fixed = FIJOS_INSTALLER.map((href) => porHref.get(href)).filter(
    (i): i is ClientNavItem => Boolean(i)
  )
  const fijosSet = new Set<string>(FIJOS_INSTALLER)
  const overflow = items.filter((i) => !fijosSet.has(i.href))
  return { fixed, overflow }
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
