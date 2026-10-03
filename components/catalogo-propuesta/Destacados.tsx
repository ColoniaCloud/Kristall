import { CONTENEDOR } from './layout'
import Reveal from './Reveal'

const DATOS = [
  { valor: '8', label: 'láminas de lanzamiento' },
  { valor: '95%', label: 'de rechazo infrarrojo en KeramX y Krypton' },
  { valor: '15 años', label: 'de garantía en PPF' },
  { valor: 'Digital', label: 'la garantía de cada instalación' },
]

/** Franja de cifras entre el hero y el carrusel: el "por qué" en cuatro números. */
export default function Destacados() {
  return (
    <section className={`${CONTENEDOR} pt-6`}>
      <div className="grid grid-cols-2 gap-px lg:grid-cols-4 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
        {DATOS.map((d, i) => (
          <Reveal key={d.label} delay={i * 80} className="bg-[#0A0A0A] px-4 py-5 lg:px-7 lg:py-8">
            <p
              className="text-[2.1rem] font-semibold leading-none tracking-[-0.01em] lg:text-[3rem]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {d.valor}
            </p>
            <p className="mt-2 text-[13px] leading-snug text-white/55 lg:text-[15px]">{d.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
