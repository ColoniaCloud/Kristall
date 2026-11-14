import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { cache } from 'react'
import { LandingPeru } from '@/components/distribuidores-peru/LandingPeru'
import { MensajePeru, WhatsAppPeru } from '@/components/distribuidores-peru/WhatsAppPeru'
import { esPais, PAISES, type Pais } from '@/components/distribuidores-peru/paises'
import { WhatsAppIcon } from '@/components/catalogo-propuesta/whatsapp'
import { CONTENEDOR } from '@/components/catalogo-propuesta/layout'
import { CrmApiError } from '@/lib/crm/api'
import { getDistributorInvite, type DistributorInvite } from '@/lib/client-portal/api'
import '@/components/distribuidores-peru/peru.css'

/**
 * La propuesta personalizada: la landing con un encabezado arriba que dice a
 * quién va dedicada. La comparten las cuatro rutas por país
 * (`/distribuidores-peru/<token>`, `-argentina`, `-uruguay` y
 * `/propuesta-distribuidor/<token>`); cada una solo dice qué país es.
 *
 * El nombre, el negocio y el país salen del CRM con el token. El link de
 * WhatsApp entra siempre por la ruta de Perú (la plantilla de Meta tiene esa
 * base fija), así que si el invitado es de otro país se lo redirige a su ruta.
 *
 * Las rutas son dinámicas a propósito: cada visita se cuenta en el CRM
 * («abierta») y un link revocado tiene que dejar de andar en el acto.
 */

type Resultado =
  | { kind: 'ok'; invitado: DistributorInvite }
  /** El invitado es de otro país: va a la ruta que le corresponde. */
  | { kind: 'otro-pais'; pais: Pais }
  | { kind: 'no-existe' }
  | { kind: 'revocada' }
  /** El CRM no contestó: se muestra la página común antes que un error. */
  | { kind: 'sin-datos' }

/** `cache` para que metadata y página compartan una sola lectura (y cuenten una sola visita). */
const leerInvitacion = cache(async (token: string, pais: Pais): Promise<Resultado> => {
  try {
    const r = await getDistributorInvite(token, pais)
    if ('moved' in r) {
      // Un país que esta versión de la web no conoce cae en la página sin país.
      const destino = esPais(r.country) ? r.country : 'OTHER'
      return destino === pais ? { kind: 'sin-datos' } : { kind: 'otro-pais', pais: destino }
    }
    return { kind: 'ok', invitado: r }
  } catch (err) {
    if (err instanceof CrmApiError) {
      if (err.status === 404 || err.status === 400) return { kind: 'no-existe' }
      if (err.status === 410) return { kind: 'revocada' }
    }
    console.error('distribuidores: no se pudo leer la invitación', err)
    return { kind: 'sin-datos' }
  }
})

export async function metadataInvitacion(token: string, pais: Pais): Promise<Metadata> {
  const r = await leerInvitacion(token, pais)
  return {
    title: {
      absolute: r.kind === 'ok' ? `Propuesta para ${r.invitado.business} — Kristall Film` : PAISES[pais].titulo,
    },
    // Una propuesta personal no se indexa ni se resume en previews de buscadores.
    robots: { index: false, follow: false },
  }
}

export async function PaginaInvitacion({ token, pais }: { token: string; pais: Pais }) {
  const r = await leerInvitacion(token, pais)

  if (r.kind === 'otro-pais') redirect(`${PAISES[r.pais].ruta}/${encodeURIComponent(token)}`)
  if (r.kind === 'no-existe') notFound()
  if (r.kind === 'revocada') return <Revocada pais={pais} />
  if (r.kind === 'sin-datos') return <LandingPeru pais={pais} />
  return <LandingPeru pais={pais} invitado={r.invitado} />
}

/** El link se desactivó desde el CRM. */
function Revocada({ pais }: { pais: Pais }) {
  return (
    <main className="kf-catalogo flex min-h-svh flex-col">
      <div className={`${CONTENEDOR} flex flex-1 flex-col justify-center py-16`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG chico */}
        <img src="/LogoFondoOscuro.png" alt="Kristall Film" width={112} height={26} className="h-7 w-auto self-start" />
        <h1 className="mt-12 text-4xl font-semibold leading-tight lg:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
          Esta propuesta ya no está disponible.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 lg:text-lg">
          Si necesita una nueva, escríbanos y se la enviamos.
        </p>
        <div className="mt-8">
          <MensajePeru mensaje={PAISES[pais].mensaje}>
            <WhatsAppPeru
              donde="revocada"
              className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-xl btn-primary px-6 text-base transition hover:bg-white/90 active:scale-[0.98]"
            >
              <WhatsAppIcon className="size-5 text-[#25D366]" />
              Escribir por WhatsApp
            </WhatsAppPeru>
          </MensajePeru>
        </div>
      </div>
    </main>
  )
}
