import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import { LandingPeru } from '@/components/distribuidores-peru/LandingPeru'
import { WhatsAppPeru } from '@/components/distribuidores-peru/WhatsAppPeru'
import { WhatsAppIcon } from '@/components/catalogo-propuesta/whatsapp'
import { CONTENEDOR } from '@/components/catalogo-propuesta/layout'
import { CrmApiError } from '@/lib/crm/api'
import { getDistributorInvite, type DistributorInvite } from '@/lib/client-portal/api'
import '@/components/distribuidores-peru/peru.css'

/**
 * /distribuidores-peru/<token>: la misma landing, con una franja arriba que dice
 * a quién va dedicada. El nombre y el negocio los carga un SUPERADMIN en el CRM
 * (Contactos Perú → Invitaciones) y llegan por el token del link que se le manda
 * al invitado por WhatsApp y mail.
 *
 * Dinámica a propósito: cada visita se cuenta en el CRM («abierta») y un link
 * revocado tiene que dejar de andar en el acto.
 */
export const dynamic = 'force-dynamic'

type Resultado =
  | { kind: 'ok'; invitado: DistributorInvite }
  | { kind: 'no-existe' }
  | { kind: 'revocada' }
  /** El CRM no contestó: se muestra la página común antes que un error. */
  | { kind: 'sin-datos' }

/** `cache` para que metadata y página compartan una sola lectura (y cuenten una sola visita). */
const leerInvitacion = cache(async (token: string): Promise<Resultado> => {
  try {
    return { kind: 'ok', invitado: await getDistributorInvite(token) }
  } catch (err) {
    if (err instanceof CrmApiError) {
      if (err.status === 404 || err.status === 400) return { kind: 'no-existe' }
      if (err.status === 410) return { kind: 'revocada' }
    }
    console.error('distribuidores-peru: no se pudo leer la invitación', err)
    return { kind: 'sin-datos' }
  }
})

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  const r = await leerInvitacion(token)
  return {
    title: {
      absolute:
        r.kind === 'ok'
          ? `Propuesta para ${r.invitado.business} — Kristall Film`
          : 'Distribuidor Autorizado en Perú — Kristall Film',
    },
    // Una propuesta personal no se indexa ni se resume en previews de buscadores.
    robots: { index: false, follow: false },
  }
}

export default async function InvitacionPeruPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const r = await leerInvitacion(token)

  if (r.kind === 'no-existe') notFound()
  if (r.kind === 'revocada') return <Revocada />
  if (r.kind === 'sin-datos') return <LandingPeru />
  return <LandingPeru invitado={r.invitado} />
}

/** El link se desactivó desde el CRM. */
function Revocada() {
  return (
    <main className="kf-catalogo flex min-h-svh flex-col">
      <div className={`${CONTENEDOR} flex flex-1 flex-col justify-center py-16`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- SVG chico */}
        <img src="/cat/logob.svg" alt="Kristall Film" width={112} height={26} className="h-7 w-auto self-start" />
        <h1 className="mt-12 text-4xl font-semibold leading-tight lg:text-6xl" style={{ fontFamily: 'var(--font-display)' }}>
          Esta propuesta ya no está disponible.
        </h1>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 lg:text-lg">
          Si necesita una nueva, escríbanos y se la enviamos.
        </p>
        <div className="mt-8">
          <WhatsAppPeru
            donde="revocada"
            className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 text-base font-semibold text-[#0A0A0A] transition hover:bg-white/90 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5 text-[#25D366]" />
            Escribir por WhatsApp
          </WhatsAppPeru>
        </div>
      </div>
    </main>
  )
}
