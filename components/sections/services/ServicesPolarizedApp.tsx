import Image from 'next/image'
import { ClipboardList, Package, BarChart3, Clock } from 'lucide-react'

const FEATURES = [
  {
    Icon: ClipboardList,
    title: 'Órdenes de trabajo',
    desc: 'Gestión completa del ciclo de cada instalación',
  },
  {
    Icon: Package,
    title: 'Control de inventario',
    desc: 'Stock de láminas en tiempo real por referencia',
  },
  {
    Icon: BarChart3,
    title: 'Reportes y métricas',
    desc: 'Dashboard con KPIs de productividad y ventas',
  },
  {
    Icon: Clock,
    title: 'Historial de servicios',
    desc: 'Registro completo por vehículo y cliente',
  },
]

export default function ServicesPolarizedApp() {
  return (
    <section
      className="bg-[#0A0A0A]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Columna izquierda — imagen */}
        <div className="relative h-[440px] rounded-2xl overflow-hidden bg-[#1A1A1A] border border-white/8">
          {/* TODO: Reemplazar con screenshot real de Polarized App */}
          <Image
            src="/porsche.png"
            alt="Polarized App"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/60 to-transparent" />
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm border border-white/15 rounded-lg px-3 py-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-400 inline-block mr-2 animate-pulse" />
            <span className="text-xs text-white/70">Sistema activo</span>
          </div>
        </div>

        {/* Columna derecha — contenido */}
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-4">
            Software de gestión
          </div>
          <h2
            className="text-white mb-4 leading-tight"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
              fontWeight: 500,
            }}
          >
            Polarized App
          </h2>
          <p className="text-sm text-white/55 leading-relaxed mb-8">
            Plataforma de gestión operativa diseñada específicamente para concesionarias que
            trabajan con laminado. Control de órdenes, inventario y reportes en tiempo real.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white/5 border border-white/8 rounded-xl p-4"
              >
                <Icon size={16} className="text-white/40 mb-2" />
                <div className="text-sm font-medium text-white mb-1">{title}</div>
                <div className="text-xs text-white/45 leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="border border-white/25 text-white px-6 py-3 rounded-lg text-sm hover:bg-white hover:text-[#0A0A0A] transition-all"
          >
            Solicitar demo
          </button>
        </div>
      </div>
    </section>
  )
}
