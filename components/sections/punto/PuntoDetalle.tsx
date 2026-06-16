'use client'

import { useEffect, useRef, useState } from 'react'
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

function BlockLeft({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView()
  return (
    <div
      ref={ref}
      className="transition-all duration-[600ms]"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateX(0)' : 'translateX(-24px)',
      }}
    >
      {children}
    </div>
  )
}

function BenefitItem({
  icon: Icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ElementType
  title: string
  description: string
  delay?: number
}) {
  const { ref, inView } = useInView()

  return (
    <div
      ref={ref}
      className="flex items-start gap-4 transition-all duration-500"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] flex items-center justify-center flex-shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-[15px] font-semibold text-[#0A0A0A] mb-1">{title}</p>
        <p className="text-[15px] text-[#5C5C5C] leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function PuntoDetalle() {
  return (
    <section className="bg-[var(--bg)] py-16 px-10">
      <div className="max-w-[1160px] mx-auto flex flex-col gap-16">

        {/* DEMANDA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <BlockLeft>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] block mb-2">
              DEMANDA
            </span>
            <h3 className="text-2xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Traemos los clientes a tu puerta
            </h3>
            <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
              No esperás que aparezcan. Derivamos clientes de tu zona directo a tu taller.
            </p>
          </BlockLeft>
          <div className="bg-[#F2F2F0] rounded-2xl p-6 flex flex-col gap-6">
            <BenefitItem
              icon={Users}
              title="Red de instaladores certificados"
              description="Formá parte del directorio oficial de Kristall Film y aparecé en kristallfilm.com como instalador verificado."
              delay={0}
            />
            <BenefitItem
              icon={Navigation}
              title="Derivación de clientes por zona"
              description="Clientes ruteados directo a tu local según tu área de cobertura geográfica."
              delay={100}
            />
          </div>
        </div>

        {/* CIERRE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <BlockLeft>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] block mb-2">
              CIERRE
            </span>
            <h3 className="text-2xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Todo para convencer y cerrar en el momento
            </h3>
            <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
              El cliente llega, toca el producto, ve la diferencia y cierra. Sin fricciones.
            </p>
          </BlockLeft>
          <div className="bg-[#F2F2F0] rounded-2xl p-6 flex flex-col gap-6">
            <BenefitItem
              icon={Layers}
              title="Muestrario físico de cada lámina"
              description="El cliente toca, compara y elige en tu mostrador. Disponible por línea KLAR, KARBON, KERAMX, KRYPTON y PPF."
              delay={0}
            />
            <BenefitItem
              icon={Sun}
              title="Tótem solar demostrador"
              description="Muestra el rechazo de calor en vivo con tecnología infrarroja. Vende solo."
              delay={100}
            />
            <BenefitItem
              icon={BookOpen}
              title="Capacitación en venta presencial"
              description="Cómo presentar, justificar precio y cerrar más ventas. Capacitación incluida en el programa."
              delay={200}
            />
          </div>
        </div>

        {/* IMAGEN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <BlockLeft>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] block mb-2">
              IMAGEN
            </span>
            <h3 className="text-2xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Tu taller con presencia de marca alemana
            </h3>
            <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
              Profesionalizá tu imagen y generá confianza desde el primer contacto.
            </p>
          </BlockLeft>
          <div className="bg-[#F2F2F0] rounded-2xl p-6 flex flex-col gap-6">
            <BenefitItem
              icon={BadgeCheck}
              title="Instalador Certificado en kristallfilm.com"
              description="Tu taller aparece en el directorio oficial con perfil verificado y zona de cobertura."
              delay={0}
            />
            <BenefitItem
              icon={Globe}
              title="Sitio web gratis con agenda digital"
              description="Landing page profesional con tu información, servicios y sistema de turnos incluido."
              delay={100}
            />
            <BenefitItem
              icon={Share2}
              title="Contenido para redes sociales"
              description="Material listo para usar en Instagram y WhatsApp con imagen de marca Kristall."
              delay={200}
            />
            <BenefitItem
              icon={Image}
              title="Cartelería de fachada e interior"
              description="Señalética profesional para identificar tu taller como Punto Kristall certificado."
              delay={300}
            />
          </div>
        </div>

        {/* LEALTAD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <BlockLeft>
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#E6A800] block mb-2">
              LEALTAD
            </span>
            <h3 className="text-2xl font-medium text-[#0A0A0A] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Respaldo permanente para crecer
            </h3>
            <p className="text-[15px] text-[#5C5C5C] leading-relaxed">
              No te dejamos solo. Soporte técnico, garantía de marca y capacitación continua.
            </p>
          </BlockLeft>
          <div className="bg-[#F2F2F0] rounded-2xl p-6 flex flex-col gap-6">
            <BenefitItem
              icon={ShieldCheck}
              title="Garantía digital Kristall"
              description="Certificado de marca generado automáticamente en cada instalación. Genera confianza y cierra ventas."
              delay={0}
            />
            <BenefitItem
              icon={Headphones}
              title="Capacitación técnica + soporte WhatsApp"
              description="Estándar de instalación Kristall y ayuda en vivo cuando la necesitás."
              delay={100}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
