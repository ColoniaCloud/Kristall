import Link from 'next/link'
import { ArrowUpRight, CalendarClock, LayoutDashboard, MapPin, QrCode } from 'lucide-react'
import { CONTENEDOR, SECCION, TITULO } from './layout'
import Reveal from './Reveal'
import { FlagStripe } from './Hero'

type Herramienta = {
  icon: React.ElementType
  tag: string
  titulo: string
  texto: string
  puntos: string[]
  link?: { href: string; label: string }
}

const HERRAMIENTAS: Herramienta[] = [
  {
    icon: LayoutDashboard,
    tag: 'Portal de Cliente',
    titulo: 'Tu cuenta Kristall, en el celular',
    texto: 'Todo lo que compraste y lo que tenés, sin pedir un resumen por WhatsApp.',
    puntos: ['Compras y estado de pagos', 'Stock de rollos en tu taller', 'Tu lista de precios', 'Avisos y novedades'],
  },
  {
    icon: CalendarClock,
    tag: 'Mi Taller',
    titulo: 'Agenda, turnos y órdenes en un solo lugar',
    texto: 'Ordená el día del taller y llevá el historial de cada cliente y cada auto.',
    puntos: ['Agenda y turnos', 'Órdenes de trabajo', 'Fichero de clientes'],
  },
  {
    icon: QrCode,
    tag: 'Garantía Digital',
    titulo: 'Cada instalación con su garantía, sin papeles',
    texto: 'Tu cliente recibe un código único y activa su garantía online. Vos quedás como el instalador de esa lámina.',
    puntos: ['Código único por rollo e instalación', 'El cliente la activa desde el celular', 'Reclamos con seguimiento'],
  },
  {
    icon: MapPin,
    tag: 'Punto Kristall',
    titulo: 'Te mandamos clientes',
    texto: 'Sumá tu taller a la red de instaladores certificados y recibí a los que ya buscan polarizado en tu zona.',
    puntos: ['Aparecés en kristallfilm.com', 'Muestrario y material para cerrar la venta', 'Soporte por WhatsApp'],
    link: { href: '/es/punto-kristall', label: 'Conocer el programa' },
  },
]

/** "Más que lámina": las cuatro herramientas que recibe el taller. */
export default function Suite() {
  return (
    <section className={SECCION}>
      <div className={CONTENEDOR}>
        <p className="flex items-center gap-3 text-[12px] font-medium uppercase tracking-[0.16em] text-[#E6A800]">
          <FlagStripe />
          La suite Kristall
        </p>
        <h2 className={`mt-3 ${TITULO}`} style={{ fontFamily: 'var(--font-display)' }}>
          Más que lámina:
          <span className="block text-white/55">un sistema para tu negocio.</span>
        </h2>

        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-2 lg:gap-5">
          {HERRAMIENTAS.map((h, i) => (
            <Reveal key={h.tag} className="h-full">
              <article className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161616] to-[#0F0F0F] p-6 lg:p-8">
                <span
                  className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-semibold leading-none text-white/[0.04]"
                  style={{ fontFamily: 'var(--font-display)' }}
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
                <div className="grid size-12 place-items-center rounded-2xl bg-white/[0.06] ring-1 ring-white/10">
                  <h.icon className="size-6 text-white" aria-hidden="true" />
                </div>
                <p className="mt-5 text-[12px] font-medium uppercase tracking-[0.14em] text-white/55">{h.tag}</p>
                <h3
                  className="mt-1.5 text-2xl font-semibold leading-tight tracking-[-0.01em]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {h.titulo}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/65">{h.texto}</p>
                <ul className="mt-4 space-y-2">
                  {h.puntos.map((p) => (
                    <li key={p} className="flex items-center gap-2.5 text-[15px] text-white/85">
                      <span className="size-1.5 shrink-0 rounded-full bg-[#CC0000]" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                {h.link && (
                  <Link
                    href={h.link.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-[#E6A800]"
                  >
                    {h.link.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
