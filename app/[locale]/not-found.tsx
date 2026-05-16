import { Link } from '@/i18n/routing'

export default function NotFound() {
  return (
    <section className="px-6 py-32 max-w-2xl mx-auto text-center">
      <p className="text-xs font-medium tracking-widest uppercase text-[#9A9A9A] mb-4">404</p>
      <h1
        className="text-4xl font-black text-[#0A0A0A] mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Página no encontrada
      </h1>
      <p className="text-[#5C5C5C] text-sm mb-8">
        El contenido que buscás no existe o fue movido.
      </p>
      <Link
        href="/"
        className="inline-block bg-[#0A0A0A] text-white text-sm font-medium px-6 py-3 rounded-full hover:bg-[#2a2a2a] transition-colors"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
