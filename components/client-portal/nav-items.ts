import {
  Tags,
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
 * Ítems del menú del portal, con **qué niveles** ven cada uno.
 *
 * ─── Por qué una lista y no un nivel mínimo ────────────────────────────────
 *
 * Porque los niveles no son una escalera. `RESELLER` no está por encima ni por
 * debajo de `INSTALLER`: comparte Compras y Cuenta corriente con BASIC, comparte
 * Stock con INSTALLER, y no comparte Mi Taller. Con un "nivel mínimo" eso no se
 * puede expresar, y el intento de forzarlo termina dándole el taller a un
 * revendedor o quitándole el stock.
 *
 * Esconder un ítem NO es la barrera de seguridad: el CRM revalida el nivel en
 * cada endpoint y responde 403. Esto es solo para no mostrarle al Cliente
 * secciones que no le sirven.
 */
const TODOS = ['BASIC', 'INSTALLER', 'RESELLER'] as const satisfies readonly AccessLevel[]
export const CLIENT_NAV_ITEMS = [
  { href: '/cliente/dashboard', label: 'Dashboard', icon: LayoutDashboard, niveles: TODOS },
  // Mi Taller va segundo, pegado al Dashboard: es donde el instalador pasa el
  // dia. Compras y Cuenta corriente son consultas, no trabajo diario.
  { href: '/cliente/taller', label: 'Mi Taller', icon: Wrench, niveles: ['INSTALLER'] },
  // Mis precios ocupa para el revendedor el lugar que Mi Taller ocupa para el
  // instalador: es lo que viene a mirar.
  { href: '/cliente/precios', label: 'Mis precios', icon: Tags, niveles: ['RESELLER'] },
  { href: '/cliente/compras', label: 'Compras', icon: ShoppingBag, niveles: TODOS },
  { href: '/cliente/cuenta', label: 'Cuenta corriente', icon: Wallet, niveles: TODOS },
  { href: '/cliente/stock', label: 'Stock', icon: PackageSearch, niveles: ['INSTALLER', 'RESELLER'] },
  { href: '/cliente/instalaciones', label: 'Instalaciones', icon: ShieldCheck, niveles: ['INSTALLER'] },
  { href: '/cliente/reclamos', label: 'Reclamos', icon: MessageSquareWarning, niveles: ['INSTALLER'] },
  { href: '/cliente/notificaciones', label: 'Notificaciones', icon: Bell, niveles: TODOS },
] as const satisfies readonly {
  href: string
  label: string
  icon: typeof LayoutDashboard
  niveles: readonly AccessLevel[]
}[]

export type ClientNavItem = (typeof CLIENT_NAV_ITEMS)[number]

/** Ítems visibles para un nivel dado: los que lo declaran, sin jerarquía. */
export function navItemsFor(level: AccessLevel): readonly ClientNavItem[] {
  return CLIENT_NAV_ITEMS.filter((i) => (i.niveles as readonly AccessLevel[]).includes(level))
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
