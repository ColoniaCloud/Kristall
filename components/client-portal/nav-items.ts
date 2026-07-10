import { LayoutDashboard, ShoppingBag, PackageSearch, ShieldCheck, MessageSquareWarning, Bell } from 'lucide-react'

export const CLIENT_NAV_ITEMS = [
  { href: '/cliente/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/cliente/compras', label: 'Compras', icon: ShoppingBag },
  { href: '/cliente/stock', label: 'Stock', icon: PackageSearch },
  { href: '/cliente/instalaciones', label: 'Instalaciones', icon: ShieldCheck },
  { href: '/cliente/reclamos', label: 'Reclamos', icon: MessageSquareWarning },
  { href: '/cliente/notificaciones', label: 'Notificaciones', icon: Bell },
] as const
