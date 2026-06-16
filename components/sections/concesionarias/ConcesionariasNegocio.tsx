import { TrendingUp } from 'lucide-react'

const steps = [
  {
    num: '01',
    title: 'Lo ofrecés en la entrega',
    body: 'Sumás el polarizado Kristall a la venta del 0km, con muestrario y demo en el escritorio.',
  },
  {
    num: '02',
    title: 'El cliente elige y lo siente',
    body: 'Con el medidor de calor comprueba la diferencia al instante y pide su garantía Kristall.',
  },
  {
    num: '03',
    title: 'Tu instalador coloca',
    body: 'Tu tercerizado instala con lámina Kristall. Vos capturás el margen del upsell, sin sumar tareas.',
  },
]

export default function ConcesionariasNegocio() {
  return (
    <section className="bg-[var(--surface)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto">
        <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#CC0000] mb-3 block">
          01 · EL NEGOCIO
        </span>
        <h2
          className="text-3xl font-medium text-[#0A0A0A] mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Más margen, sin cambiar tu operación
        </h2>
        <p className="text-[15px] text-[#5C5C5C] leading-relaxed mb-12 max-w-[600px]">
          Tu instalador tercerizado sigue colocando como hasta hoy. La diferencia es que ahora
          trabaja con lámina Kristall: el cliente pide la marca y su garantía digital, y vos
          capturás un upsell premium en cada entrega.
        </p>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {steps.map(({ num, title, body }) => (
            <div
              key={num}
              className="bg-[#F2F2F0] border border-[#E4E4E2] rounded-2xl p-6"
            >
              <span
                className="text-3xl font-medium text-[#CC0000] block mb-3"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {num}
              </span>
              <p className="text-sm font-semibold text-[#0A0A0A] mb-2">{title}</p>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* Callout */}
        <div className="bg-[#0A0A0A] rounded-2xl p-6 flex items-start gap-5">
          <div className="w-12 h-12 rounded-xl bg-[#E6A800] flex items-center justify-center flex-shrink-0">
            <TrendingUp size={22} className="text-[#0A0A0A]" />
          </div>
          <div>
            <p
              className="text-xl font-medium text-white mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Más margen{' '}
              <span className="text-[#E6A800]">en cada auto.</span>
            </p>
            <p className="text-sm text-white/50 leading-relaxed">
              El posicionamiento premium alemán y las herramientas de demostración justifican un
              mejor precio de venta. Eso es más margen para tu concesionaria en cada 0km que
              sale del salón.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
