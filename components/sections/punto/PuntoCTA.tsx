import Link from 'next/link'

const stats = [
  { value: '5 líneas', label: 'Productos disponibles' },
  { value: '15 años', label: 'Garantía PPF' },
  { value: '3 idiomas', label: 'Soporte técnico' },
  { value: '100%', label: 'Garantía de instalación' },
]

export default function PuntoCTA() {
  return (
    <section className="bg-[#0A0A0A] py-16 px-10">
      <div className="max-w-[800px] mx-auto text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/30 mb-4">
          ¿Listo para sumar tu taller?
        </p>

        <h2
          className="font-display font-medium text-white mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)' }}
        >
          Convertite en Punto Kristall
        </h2>

        <p className="text-base text-white/45 leading-relaxed mb-10 max-w-[480px] mx-auto">
          Completá el formulario y un asesor de Kristall te contacta para explicarte los
          requisitos y condiciones del programa.
        </p>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/contacto?programa=punto-kristall"
            className="btn-primary text-white px-8 py-4 rounded-lg text-base font-medium transition-all"
          >
            Quiero ser Punto Kristall
          </Link>
          <Link
            href="/productos"
            className="border border-white/20 text-white/60 px-8 py-4 rounded-lg text-base hover:text-white hover:border-white/40 transition-all"
          >
            Ver productos
          </Link>
        </div>

        <div className="flex justify-center gap-8 mt-12 flex-wrap border-t border-white/[0.08] pt-10">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-2xl font-medium text-white">{value}</p>
              <p className="text-xs text-white/30 mt-1 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
