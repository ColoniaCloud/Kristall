import {
  Users,
  Navigation,
  Layers,
  Sun,
  BookOpen,
  BadgeCheck,
  Globe,
  Share2,
  Image,
  ShieldCheck,
  Headphones,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Benefit = {
  icon: LucideIcon
  title: string
  body: string
}

type Block = {
  tag: string
  headline: string
  description: string
  benefits: Benefit[]
}

const blocks: Block[] = [
  {
    tag: 'DEMANDA',
    headline: 'Traemos los clientes a tu puerta',
    description:
      'No esperás que aparezcan. Derivamos clientes de tu zona directo a tu taller.',
    benefits: [
      {
        icon: Users,
        title: 'Red de instaladores certificados',
        body: 'Formá parte del directorio oficial de Kristall Film y aparecé en kristallfilm.com como instalador verificado.',
      },
      {
        icon: Navigation,
        title: 'Derivación de clientes por zona',
        body: 'Clientes ruteados directo a tu local según tu área de cobertura geográfica.',
      },
    ],
  },
  {
    tag: 'CIERRE',
    headline: 'Todo para convencer y cerrar en el momento',
    description:
      'El cliente llega, toca el producto, ve la diferencia y cierra. Sin fricciones.',
    benefits: [
      {
        icon: Layers,
        title: 'Muestrario físico de cada lámina',
        body: 'El cliente toca, compara y elige en tu mostrador. Disponible por línea KLAR, KARBON, KERAMX, KRYPTON y PPF.',
      },
      {
        icon: Sun,
        title: 'Tótem solar demostrador',
        body: 'Muestra el rechazo de calor en vivo con tecnología infrarroja. Vende solo.',
      },
      {
        icon: BookOpen,
        title: 'Capacitación en venta presencial',
        body: 'Cómo presentar, justificar precio y cerrar más ventas. Capacitación incluida en el programa.',
      },
    ],
  },
  {
    tag: 'IMAGEN',
    headline: 'Tu taller con presencia de marca alemana',
    description:
      'Profesionalizá tu imagen y generá confianza desde el primer contacto.',
    benefits: [
      {
        icon: BadgeCheck,
        title: 'Instalador Certificado en kristallfilm.com',
        body: 'Tu taller aparece en el directorio oficial con perfil verificado y zona de cobertura.',
      },
      {
        icon: Globe,
        title: 'Sitio web gratis con agenda digital',
        body: 'Landing page profesional con tu información, servicios y sistema de turnos incluido.',
      },
      {
        icon: Share2,
        title: 'Contenido para redes sociales',
        body: 'Material listo para usar en Instagram y WhatsApp con imagen de marca Kristall.',
      },
      {
        icon: Image,
        title: 'Cartelería de fachada e interior',
        body: 'Señalética profesional para identificar tu taller como Punto Kristall certificado.',
      },
    ],
  },
  {
    tag: 'LEALTAD',
    headline: 'Respaldo permanente para crecer',
    description:
      'No te dejamos solo. Soporte técnico, garantía de marca y capacitación continua.',
    benefits: [
      {
        icon: ShieldCheck,
        title: 'Garantía digital Kristall',
        body: 'Certificado de marca generado automáticamente en cada instalación. Genera confianza y cierra ventas.',
      },
      {
        icon: Headphones,
        title: 'Capacitación técnica + soporte WhatsApp',
        body: 'Estándar de instalación Kristall y ayuda en vivo cuando la necesitás.',
      },
    ],
  },
]

export default function PuntoDetalle() {
  return (
    <section className="bg-[var(--bg)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto flex flex-col gap-16">
        {blocks.map(({ tag, headline, description, benefits }) => (
          <div key={tag} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] block mb-2">
                {tag}
              </span>
              <h3 className="font-display text-2xl font-medium text-[#0A0A0A] mb-3">
                {headline}
              </h3>
              <p className="text-sm text-[#5C5C5C] leading-relaxed">{description}</p>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-6">
              {benefits.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A0A0A] mb-1">{title}</p>
                    <p className="text-sm text-[#5C5C5C] leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
