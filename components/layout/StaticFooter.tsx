import Link from 'next/link'
import Image from 'next/image'

/**
 * Footer global de la web, para usar en superficies aisladas (/cliente, /garantia)
 * que viven fuera del árbol [locale] y no tienen next-intl disponible.
 * Texto fijo en español: estas superficies son de un solo idioma (ver middleware.ts).
 */
export default function StaticFooter() {
  return (
    <footer className="sticky bottom-0 z-0 mt-auto bg-[#1A1A1A] px-8 py-8 pb-6 md:py-14 md:pb-12">
      <div className="mx-auto max-w-[1160px] grid grid-cols-2 lg:grid-cols-5 gap-8 text-center md:text-left">
        {/* Col 1: Branding */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center md:justify-start mb-3">
            <Image
              src="/LogoPlano.png"
              alt="Kristall"
              width={117}
              height={26}
              className="h-[26px] w-auto"
            />
          </div>
          <p className="text-sm text-white/40 leading-relaxed">
            Un sistema integral para instaladores y distribuidores.
          </p>
        </div>

        {/* Col 2: Productos */}
        <div>
          <h3 className="text-white font-medium text-[15px] mb-3">Productos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">Polarizado automotriz</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">Seguridad</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">Arquitectura</Link>
            </li>
            <li>
              <Link href="/productos" className="text-white/50 hover:text-white transition-colors">PPF</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Software */}
        <div>
          <h3 className="text-white font-medium text-[15px] mb-3">Software</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">
                Polarized App
              </Link>
            </li>
            <li>
              <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">Dashboard y reportes</Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Empresa */}
        <div>
          <h3 className="text-white font-medium text-[15px] mb-3">Empresa</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/nosotros" className="text-white/50 hover:text-white transition-colors">
                Nosotros
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-white/50 hover:text-white transition-colors">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-white/50 hover:text-white transition-colors">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 5: Sumate a Kristall */}
        <div>
          <h3 className="text-white font-medium text-[15px] mb-3">Sumate a Kristall</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/propuesta-vidrierias" className="text-white/50 hover:text-white transition-colors">
                Vidrierías y aberturas
              </Link>
            </li>
            <li>
              <Link href="/concesionarias" className="text-white/50 hover:text-white transition-colors">
                Concesionarias
              </Link>
            </li>
            <li>
              <Link href="/punto-kristall" className="text-white/50 hover:text-white transition-colors">
                Punto Kristall
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto max-w-[1160px] mt-8 pt-6 border-t border-white/10">
        <p className="text-sm text-white/35 text-center">© 2026 Kristall Film. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
