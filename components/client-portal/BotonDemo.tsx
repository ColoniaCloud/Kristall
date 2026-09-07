'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, PlayCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/**
 * Entrar a la demostración, sin credenciales.
 *
 * Un botón y no un formulario: pedirle usuario y contraseña a alguien que
 * todavía no es cliente es fricción justo cuando querés que entre. Y `demo` con
 * contraseña `demo` es lo primero que prueban los bots que barren esta pantalla:
 * con un formulario estaríamos creando talleres descartables para robots.
 *
 * Detrás se crea un taller propio para esa persona, así que dos visitantes al
 * mismo tiempo no se pisan.
 */
export default function BotonDemo() {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)

  async function entrar() {
    setCargando(true)
    try {
      const res = await fetch('/api/portal/demo', { method: 'POST' })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos abrir la demostración')
        return
      }
      router.push('/cliente/taller')
      router.refresh()
    } catch {
      toast.error('Error de conexión. Probá de nuevo.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 border-t border-border pt-5">
      <p className="text-center text-sm text-muted-foreground">
        ¿Todavía no sos instalador Kristall?
      </p>
      <Button type="button" variant="outline" onClick={entrar} disabled={cargando}>
        {cargando ? <Loader2 className="size-4 animate-spin" /> : <PlayCircle className="size-4" />}
        Ver una demostración
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Entrás a un taller de prueba con datos de ejemplo. No hace falta registrarse.
      </p>
    </div>
  )
}
