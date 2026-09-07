import Link from 'next/link'

/**
 * La banda que avisa que esto es una demostración.
 *
 * Va en el layout del portal, o sea en **todas** las pantallas, y no se puede
 * cerrar. Alguien va a sacarle una captura a esto y mandarla por WhatsApp; que
 * el aviso esté en la captura es justamente el punto.
 *
 * También dice que se borra solo, porque la pregunta que sigue a "qué lindo
 * esto" es "¿y lo que cargué queda?".
 */
export default function BandaDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-amber-100 px-4 py-2 text-center text-sm text-amber-900">
      <span>
        <strong className="font-semibold">Estás en una demostración.</strong> Los datos son de
        ejemplo y se borran solos: tocá todo lo que quieras.
      </span>
      <Link href="/cliente/ingresar" className="underline underline-offset-2 hover:no-underline">
        Salir
      </Link>
    </div>
  )
}
