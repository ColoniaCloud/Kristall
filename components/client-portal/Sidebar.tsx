import NavLinks from './NavLinks'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col border-r border-border bg-card px-3 py-6">
      <div className="px-3 mb-6">
        <span className="font-heading text-lg font-semibold">Kristall</span>
        <p className="text-xs text-muted-foreground">Panel de Cliente</p>
      </div>
      <NavLinks />
    </aside>
  )
}
