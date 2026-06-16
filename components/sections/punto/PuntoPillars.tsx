'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Users,
  ShoppingBag,
  Megaphone,
  TrendingUp,
  Globe,
  Zap,
  Layers,
  Sun,
  Activity,
  MapPin,
  Monitor,
  Share2,
  Tag,
  ShieldCheck,
  Package,
  MessageCircle,
} from 'lucide-react'
import AnimatedBorderCard from '@/components/common/AnimatedBorderCard'

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

type Benefit = {
  icon: React.ElementType
  label: string
  description: string
}

const pillars: {
  tag: string
  title: string
  body: string
  icon: React.ElementType
  benefits: Benefit[]
}[] = [
  {
    tag: 'DEMANDA',
    title: 'Llegá a clientes que ya están buscando',
    body: 'Kristall genera demanda de forma permanente y la canaliza al directorio de instaladores certificados. Cuando un cliente busca polarizado en tu zona, te encuentra a vos.',
    icon: Users,
    benefits: [
      {
        icon: Globe,
        label: 'Red de instaladores certificados',
        description:
          'Aparecé en kristallfilm.com como instalador verificado, con tu zona de cobertura y contacto directo.',
      },
      {
        icon: Zap,
        label: 'Tráfico calificado, sin esfuerzo de captación',
        description:
          'El cliente llega al directorio con la decisión casi tomada. Solo necesita elegir instalador.',
      },
    ],
  },
  {
    tag: 'CIERRE',
    title: 'Todo para convencer y cerrar en el momento',
    body: 'El cliente toca el producto, ve la diferencia y decide. Sin fricciones.',
    icon: ShoppingBag,
    benefits: [
      {
        icon: Layers,
        label: 'Muestrario físico',
        description: 'Muestras de cada línea para tu mostrador. Sin costo.',
      },
      {
        icon: Sun,
        label: 'Tótem solar demostrador',
        description:
          'Muestra el rechazo de calor en vivo. El cliente lo ve y cierra solo. Disponible para adquirir.',
      },
      {
        icon: Activity,
        label: 'Medidor solar infrarrojo',
        description:
          'Demuestra la performance de cada lámina con datos reales. Disponible para adquirir.',
      },
    ],
  },
  {
    tag: 'IMAGEN',
    title: 'Tu taller con presencia de marca alemana',
    body: 'Profesionalizá tu imagen y generá confianza desde el primer contacto.',
    icon: Megaphone,
    benefits: [
      {
        icon: MapPin,
        label: 'Listing en kristallfilm.com',
        description:
          'Tu taller en el directorio oficial con perfil verificado, zona de cobertura y contacto directo.',
      },
      {
        icon: Monitor,
        label: 'Landing page profesional',
        description:
          'Página propia con tu información y servicios, con imagen de marca Kristall.',
      },
      {
        icon: Share2,
        label: 'Contenido para redes sociales',
        description: 'Material listo para usar en Instagram y WhatsApp.',
      },
      {
        icon: Tag,
        label: 'Cartelería de fachada e interior',
        description:
          'Señalética que identifica tu taller como instalador certificado Kristall. Bonificada según nivel de certificación.',
      },
    ],
  },
  {
    tag: 'LEALTAD',
    title: 'Respaldo permanente para crecer',
    body: 'No te dejamos solos. Soporte técnico, garantía de marca y acceso preferencial.',
    icon: TrendingUp,
    benefits: [
      {
        icon: ShieldCheck,
        label: 'Garantía digital Kristall',
        description:
          'Cada instalación genera automáticamente un certificado de garantía para el cliente final. Genera confianza y diferencia tu servicio.',
      },
      {
        icon: Package,
        label: 'Acceso prioritario a producto',
        description:
          'Los instaladores certificados tienen preferencia en disponibilidad de stock y acceso anticipado a nuevas líneas.',
      },
      {
        icon: MessageCircle,
        label: 'Soporte WhatsApp',
        description: 'Ayuda en vivo cuando la necesitás.',
      },
    ],
  },
]

function SectionHeader() {
  const { ref, inView } = useInView(0.2)
  return (
    <div ref={ref}>
      <p
        className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/40 mb-4 transition-all duration-700"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transitionDelay: '0ms',
        }}
      >
        Todo lo que recibís como Punto Kristall
      </p>
      <h2
        className="text-3xl font-medium text-white mb-12 transition-all duration-700"
        style={{
          fontFamily: 'var(--font-display)',
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transitionDelay: '120ms',
        }}
      >
        Cuatro frentes. Un solo programa.
      </h2>
    </div>
  )
}

function PillarCard({
  tag,
  title,
  body,
  icon: Icon,
  benefits,
  delay,
}: {
  tag: string
  title: string
  body: string
  icon: React.ElementType
  benefits: Benefit[]
  delay: number
}) {
  const { ref, inView } = useInView(0.1)

  return (
    <AnimatedBorderCard borderRadius={16} color="white">
    <div
      ref={ref}
      className="relative rounded-2xl p-7 flex flex-col backdrop-blur-md bg-white/[0.08] border border-white/15 shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(24px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <Icon size={20} className="absolute top-5 right-5 text-white/10" />

      <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-white/50 mb-3 block">
        {tag}
      </span>
      <h3
        className="text-2xl font-medium text-[#E6A800] mb-3"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h3>
      <p className="text-base leading-relaxed text-white/80 mb-6">{body}</p>

      <ul className="flex flex-col gap-3 mt-auto">
        {benefits.map(({ icon: BIcon, label, description }) => (
          <li key={label} className="flex items-start gap-2.5">
            <BIcon size={13} className="text-[#E6A800] mt-[3px] flex-shrink-0" />
            <p className="text-[13px] text-white/70 leading-snug">
              <span className="font-semibold text-white/90">{label}</span>
              {' — '}
              {description}
            </p>
          </li>
        ))}
      </ul>
    </div>
    </AnimatedBorderCard>
  )
}

export default function PuntoPillars() {
  return (
    <section className="relative overflow-hidden py-16 px-10">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/cat/top-KLAR.jpg)',
          backgroundAttachment: 'fixed',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/80" />

      <div className="relative z-10 max-w-[1160px] mx-auto">
        <SectionHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(({ tag, title, body, icon, benefits }, i) => (
            <PillarCard
              key={tag}
              tag={tag}
              title={title}
              body={body}
              icon={icon}
              benefits={benefits}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
