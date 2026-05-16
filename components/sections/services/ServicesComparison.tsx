import { Check } from 'lucide-react'
import { Link } from '@/i18n/routing'

const CONCESSIONAIRE_ITEMS = [
  'Instalación en flota completa',
  'Protocolo estandarizado',
  'Garantía Kristall Film',
  'Soporte técnico post-instalación',
  'Certificado por vehículo',
]

const APP_ITEMS = [
  'Dashboard de operaciones',
  'Gestión de órdenes de trabajo',
  'Control de inventario',
  'Reportes de productividad',
  'Historial por cliente y vehículo',
]

export default function ServicesComparison() {
  return (
    <section
      className="bg-[var(--surface)] border-t border-b border-[#E4E4E2]"
      style={{ padding: '64px 40px' }}
    >
      <div className="max-w-[1160px] mx-auto">
        <div className="text-center text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-3">
          ¿Qué incluye cada servicio?
        </div>
        <h2
          className="text-center text-2xl text-[#0A0A0A] mb-10"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
        >
          Comparativa de servicios
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card Concesionarias */}
          <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
            <div className="bg-[#0A0A0A] text-white rounded-xl px-4 py-3 mb-6">
              <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/50">
                Servicio
              </div>
              <div
                className="text-lg"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
              >
                Polarizado para concesionarias
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {CONCESSIONAIRE_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-[#0A0A0A]">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contacto?servicio=concesionarias"
              className="block text-center bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors w-full mt-6"
            >
              Solicitar propuesta
            </Link>
          </div>

          {/* Card Polarized App */}
          <div className="bg-[#0A0A0A] rounded-2xl p-6">
            <div className="bg-white/8 border border-white/10 rounded-xl px-4 py-3 mb-6">
              <div className="text-[10px] font-medium uppercase tracking-[0.1em] text-white/40">
                Software
              </div>
              <div
                className="text-lg text-white"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 500 }}
              >
                Polarized App
              </div>
            </div>
            <ul className="flex flex-col gap-3">
              {APP_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-white" strokeWidth={2.5} />
                  </div>
                  <span className="text-sm text-white/80">{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="block text-center border border-white/20 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-white hover:text-[#0A0A0A] transition-all w-full mt-6"
            >
              Solicitar demo
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
