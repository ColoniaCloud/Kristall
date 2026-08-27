import Link from 'next/link'
import { MapPin } from 'lucide-react'
import SocialIcons from '@/components/common/SocialIcons'
import { OFFICE_MAPS_URL } from '@/lib/office'

/**
 * Footer global de la web, para usar en superficies aisladas (/cliente, /garantia)
 * que viven fuera del árbol [locale] y no tienen next-intl disponible.
 * Texto fijo en español: estas superficies son de un solo idioma (ver middleware.ts).
 */
export default function StaticFooter() {
  return (
    <footer className="sticky bottom-0 z-0 mt-auto bg-[#1A1A1A] px-8 py-8 pb-6 md:h-[50vh] md:flex md:flex-col md:justify-center md:py-14 md:pb-12">
      <div className="mx-auto w-full max-w-[1160px] grid grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-8 text-center lg:text-left">
        {/* Col 1: Branding */}
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center justify-center lg:justify-start mb-4">
            <img
              src="/cat/logob.svg"
              alt="Kristall"
              className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <div className="flex items-center justify-center lg:justify-start mb-4">
            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Av. Juan B Justo 2918, CABA</span>
            </a>
          </div>

          <div className="flex items-center justify-center lg:justify-start">
            <SocialIcons size={18} gap={14} className="text-white/40" />
          </div>
        </div>

        {/* Col 2: Productos */}
        <div>
          <h3 className="text-white font-medium text-[16px] mb-3">Productos</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/productos/autos" className="text-white/50 hover:text-white transition-colors">Polarizado automotriz</Link>
            </li>
            <li>
              <Link href="/productos/lineas/krypton" className="text-white/50 hover:text-white transition-colors">Seguridad</Link>
            </li>
            <li>
              <Link href="/productos/arquitectura" className="text-white/50 hover:text-white transition-colors">Arquitectura</Link>
            </li>
            <li>
              <Link href="/productos/lineas/ppf" className="text-white/50 hover:text-white transition-colors">PPF</Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Software + Empresa */}
        <div>
          <div className="mb-6">
            <h3 className="text-white font-medium text-[16px] mb-3">Software</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/servicios" className="text-white/50 hover:text-white transition-colors">
                  Información de software
                </Link>
              </li>
              <li>
                <Link href="/cliente/ingresar" className="text-white/50 hover:text-white transition-colors">Acceder al software</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-medium text-[16px] mb-3">Empresa</h3>
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
        </div>

        {/* Col 4: Sumate a Kristall */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-white font-medium text-[16px] mb-3">Sumate a Kristall</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/propuesta-aberturas" className="text-white/50 hover:text-white transition-colors">
                Propuesta Aberturas
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
      <div className="mx-auto w-full max-w-[1160px] mt-8 pt-6 border-t border-white/10">
        <p className="text-sm text-white/35 text-center">© 2026 Kristall Film. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
