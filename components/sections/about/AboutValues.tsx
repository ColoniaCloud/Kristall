import { RefreshCw, Eye, Award, Leaf, Headphones } from 'lucide-react'

const SMALL_CARDS = [
  {
    Icon: Award,
    title: 'Garantía extendida',
    desc: 'Respaldo de marca en cada instalación certificada.',
  },
  {
    Icon: Leaf,
    title: 'Eficiencia energética',
    desc: 'Reducción de carga térmica en edificios y vehículos.',
  },
  {
    Icon: Headphones,
    title: 'Soporte técnico',
    desc: 'Equipo especializado para instaladores y distribuidores.',
  },
]

export default function AboutValues() {
  return (
    <section className="bg-[var(--bg)]" style={{ padding: '0 40px 64px' }}>
      <div className="max-w-[1160px] mx-auto">
        <div className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A] mb-6">
          Nuestros valores
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          {/* Card 01 */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6">
            <div
              className="leading-none mb-3 text-white/[0.06]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '40px',
                fontWeight: 500,
              }}
            >
              01
            </div>
            <div className="text-sm font-medium text-white mb-2">Precisión ante todo</div>
            <div className="text-xs text-white/45 leading-relaxed">
              Cada lámina es medida, ensayada y validada antes de salir de producción. No existe
              tolerancia al defecto.
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white border border-[#E4E4E2] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <RefreshCw size={18} className="text-[#9A9A9A] mb-3" />
            <div className="text-sm font-medium text-[#0A0A0A] mb-2">Consistencia de proceso</div>
            <div className="text-xs text-[#5C5C5C] leading-relaxed">
              El mismo estándar productivo en cada lote. Lo que instalás hoy es idéntico a lo que
              instalaste el año pasado.
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-white border border-[#E4E4E2] rounded-2xl p-6 shadow-[var(--shadow-card)]">
            <Eye size={18} className="text-[#9A9A9A] mb-3" />
            <div className="text-sm font-medium text-[#0A0A0A] mb-2">Transparencia técnica</div>
            <div className="text-xs text-[#5C5C5C] leading-relaxed">
              Publicamos fichas técnicas completas. Cada especificación es medible y verificable
              por el instalador o el cliente final.
            </div>
          </div>

          {/* Card 04 */}
          <div className="bg-[#1A1A1A] rounded-2xl p-6">
            <div
              className="leading-none mb-3 text-white/[0.06]"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '40px',
                fontWeight: 500,
              }}
            >
              04
            </div>
            <div className="text-sm font-medium text-white mb-2">Alcance regional</div>
            <div className="text-xs text-white/45 leading-relaxed">
              Tecnología de origen alemán disponible hoy en Argentina y América Latina, con soporte
              local y tiempos de respuesta regionales.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SMALL_CARDS.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white border border-[#E4E4E2] rounded-xl p-4 shadow-[var(--shadow-card)]"
            >
              <Icon size={15} className="text-[#9A9A9A] mb-2" />
              <div className="text-[13px] font-medium mb-1 text-[#0A0A0A]">{title}</div>
              <div className="text-[11px] text-[#9A9A9A] leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
