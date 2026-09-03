import Image from 'next/image'
import type { WarrantyStatus } from '@/lib/warranty/api'

/**
 * Cabecera de las pantallas de garantía: Kristall a la izquierda, el taller a
 * la derecha.
 *
 * Las dos marcas juntas dicen algo cierto y que a la persona le importa:
 * **Kristall respalda la garantía, el taller hizo el trabajo.** El día que haya
 * un problema, va a golpearle la puerta al taller, y verlo acá es lo que hace
 * que este papel se sienta suyo y no de una marca lejana.
 *
 * Si el taller no cargó logo va su nombre. Nunca queda un hueco: media cabecera
 * vacía se lee como algo roto, no como algo que falta.
 */
export default function WarrantyHeader({
  installer,
  logoUrl,
}: {
  installer: WarrantyStatus['installer']
  /** URL absoluta al logo del taller, ya resuelta contra el CRM. */
  logoUrl: string | null
}) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border pb-5">
      <Image
        src="/LogoPlano.png"
        alt="Kristall Film"
        width={140}
        height={32}
        className="h-8 w-auto"
        priority
      />

      {installer && (
        <div className="flex min-w-0 items-center gap-3 border-l border-border pl-4">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={installer.name}
              className="max-h-8 max-w-[9rem] object-contain"
            />
          ) : (
            <span className="truncate text-sm font-semibold">{installer.name}</span>
          )}
        </div>
      )}
    </header>
  )
}
