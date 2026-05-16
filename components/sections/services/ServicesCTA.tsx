import { Link } from '@/i18n/routing'

export default function ServicesCTA() {
  return (
    <section className="bg-[var(--bg)]" style={{ padding: '64px 40px' }}>
      <div className="max-w-[640px] mx-auto text-center">
        <h2
          className="text-[#0A0A0A] mb-4"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
            fontWeight: 500,
          }}
        >
          ¿Listo para optimizar tu concesionaria?
        </h2>
        <p className="text-sm text-[#5C5C5C] leading-relaxed mb-8">
          Contactá a nuestro equipo y recibí una propuesta personalizada para tu operación.
          Respondemos en menos de 48 horas.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/contacto?servicio=concesionarias"
            className="inline-block bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#2a2a2a] transition-colors"
          >
            Solicitar propuesta
          </Link>
          <Link
            href="/productos"
            className="inline-block border border-[#0A0A0A] text-[#0A0A0A] px-6 py-3 rounded-lg text-sm font-medium hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            Ver productos
          </Link>
        </div>
      </div>
    </section>
  )
}
