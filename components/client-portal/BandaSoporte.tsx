/**
 * La banda que avisa que quien está adentro es alguien de Kristall
 * configurándole el panel al Cliente ("Entrar como el cliente", desde el CRM).
 *
 * Va en todas las pantallas y no se puede cerrar, como la de la demostración:
 * todo lo que se cargue acá queda en la cuenta real del Cliente, y eso tiene
 * que estar a la vista mientras se trabaja.
 *
 * "Salir" es un `<a>` común al logout por GET, que borra la cookie y redirige
 * al login. No un `<Link>`: es un route handler, no una página, y hace falta
 * una navegación completa para que la redirección y la cookie se apliquen.
 */
export default function BandaSoporte({
  operador,
  cliente,
  venceEn,
  activada,
}: {
  operador: string
  cliente: string
  venceEn: string
  activada: boolean
}) {
  const hora = new Date(venceEn).toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  })

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-sky-100 px-4 py-2 text-center text-sm text-sky-950">
      <span>
        <strong className="font-semibold">
          {operador}, estás configurando el panel de {cliente}.
        </strong>{' '}
        Lo que cargues queda en su cuenta. La sesión vence a las {hora}.
        {!activada && ' Al terminar, mandale la invitación desde el CRM para que elija su contraseña.'}
      </span>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- route handler, ver arriba */}
      <a href="/api/portal/auth/logout" className="underline underline-offset-2 hover:no-underline">
        Salir
      </a>
    </div>
  )
}
