import { Layers, ShieldCheck, Sun, BookOpen, Package, Info } from 'lucide-react'

const items = [
  {
    icon: Layers,
    title: 'Muestrarios físicos',
    body: 'De toda la gama, para mostrar y comparar en el escritorio de venta.',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía digital cruzada',
    body: 'Certificado de marca para cada cliente. Respaldo que protege la reputación de tu salón.',
  },
  {
    icon: Sun,
    title: 'Tótem solar demostrador',
    body: 'Muestra el rechazo de calor en vivo. Argumento de venta que trabaja solo.',
  },
  {
    icon: BookOpen,
    title: 'Capacitación al equipo',
    body: 'A tu fuerza de ventas: cómo presentar la gama y justificar el precio premium.',
  },
  {
    icon: Package,
    title: 'Gama completa disponible',
    body: 'Desde la línea KLAR hasta la premium KERAMX, lista para cada segmento del salón.',
  },
]

export default function ConcesionariasEquipamiento() {
  return (
    <section className="bg-[var(--bg)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#CC0000] mb-3 block">
          02 · QUÉ APORTAMOS
        </span>
        <h2
          className="text-3xl font-medium text-[#0A0A0A] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Lo que dejamos en tu salón
        </h2>
        <p className="text-[15px] text-[#5C5C5C] leading-relaxed mb-12">
          Equipamos tu concesionaria con todo lo necesario para vender polarizado premium desde
          el primer día.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="bg-white border border-[#E4E4E2] rounded-2xl p-6 flex items-start gap-4 shadow-[var(--shadow-card)]"
            >
              <div className="w-11 h-11 rounded-xl bg-[#E6A800] flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-[#0A0A0A]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A0A0A] mb-1.5">{title}</p>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nota al pie */}
        <div className="mt-6 bg-[#F2F2F0] border border-[#E4E4E2] rounded-xl p-4 flex items-start gap-3">
          <Info size={15} className="text-[#9A9A9A] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#5C5C5C] italic">
            El tester solar de calor (medidor) se adquiere por separado — es la herramienta de
            cierre más efectiva en el escritorio de venta.
          </p>
        </div>
      </div>
    </section>
  )
}
