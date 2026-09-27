import Link from 'next/link'
import './globals.css'
import { fontsClassName } from '@/lib/fonts'

/**
 * 404 raíz — y, en la práctica, **el que más se sirve**. Los 404 que resuelve el
 * router (una ruta que no matchea, o un slug de catálogo fuera de
 * generateStaticParams por `dynamicParams = false`) se rechazan antes de entrar al
 * segmento [locale], así que caen acá y no en app/[locale]/not-found.tsx.
 *
 * Por eso tiene que ser autosuficiente: renderiza su propio <html>/<body> y no
 * puede usar next-intl (no hay locale que resolver en este punto) ni Header/Footer,
 * que son componentes cliente y dependen del NextIntlClientProvider del layout de
 * [locale]. El texto va en español, el locale por defecto del sitio.
 *
 * Los enlaces cubren los cuatro idiomas para que quien caiga acá desde /en, /de o
 * /pt tenga una salida a su propia versión del sitio.
 */
const LOCALES = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'pt', label: 'Português' },
]

export const metadata = {
  title: 'Página no encontrada — Kristall Film',
  robots: { index: false, follow: true },
}

export default function RootNotFound() {
  return (
    <html lang="es" className={fontsClassName}>
      <body className="bg-[#F2F2F0] text-[#0A0A0A]">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#9A9A9A]">404</p>
          <h1
            className="mb-4 text-4xl font-black"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Página no encontrada
          </h1>
          <p className="mb-8 text-sm text-[#5C5C5C]">
            El contenido que buscás no existe o fue movido.
          </p>
          <Link
            href="/es"
            className="btn-primary inline-block rounded-full px-6 py-3 text-sm font-medium text-white transition-all"
          >
            Volver al inicio
          </Link>
          <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {LOCALES.map(({ code, label }) => (
              <Link
                key={code}
                href={`/${code}`}
                className="text-xs text-[#9A9A9A] underline underline-offset-2 transition-colors hover:text-[#0A0A0A]"
              >
                {label}
              </Link>
            ))}
          </nav>
        </main>
      </body>
    </html>
  )
}
