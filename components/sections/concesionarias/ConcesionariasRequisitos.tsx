import { ChevronRight } from 'lucide-react'

const compromisos = [
  'Adoptar Kristall como lámina de tu salón',
  'Ofrecer el polarizado en la venta del 0km',
  'Que tu instalador tercerizado trabaje con lámina Kristall',
  'Activar la garantía digital cruzada en el sistema',
  'Usar las herramientas de cierre (tótem, medidor, muestrario)',
  'Mantener la experiencia premium con el cliente',
]

export default function ConcesionariasRequisitos() {
  return (
    <section className="bg-[var(--surface)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Columna izquierda */}
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#CC0000] mb-3 block">
            03 · LO QUE PEDIMOS
          </span>
          <h2
            className="text-3xl font-medium text-[#0A0A0A] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Qué pedimos a cambio
          </h2>
          <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
            El alta es ágil y sin obras. Te equipamos el salón, capacitamos a tu equipo y
            coordinamos con tu instalador.
          </p>
        </div>

        {/* Columna derecha */}
        <div className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6">
          <p className="text-sm font-semibold text-[#0A0A0A] mb-5">
            Compromisos del programa
          </p>
          <ul className="flex flex-col gap-3">
            {compromisos.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#0A0A0A] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ChevronRight size={11} className="text-white" />
                </div>
                <p className="text-sm text-[#5C5C5C] leading-relaxed">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
