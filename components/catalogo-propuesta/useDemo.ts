'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { trackEvent } from '@/lib/analytics'

const ERROR = 'No pudimos abrir la demo. Probá de nuevo en un momento.'

/**
 * Abre una sesión del portal de demostración y lleva a `destino`. Repite la
 * lógica de `components/sections/PortalInstaladores.tsx` (POST /api/portal/demo);
 * el endpoint ya limita a 5 demos por IP por hora.
 *
 * `donde` identifica el botón en GA4: la demo se abre desde la sección "Probalo"
 * y desde la de la página de turnos.
 */
export function useDemo(destino: string, donde: string) {
  const router = useRouter()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function entrar() {
    setCargando(true)
    setError(null)
    trackEvent('catalogo_demo_click', { donde })
    try {
      const res = await fetch('/api/portal/demo', { method: 'POST' })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null
        setError(res.status === 429 && body?.error ? body.error : ERROR)
        return
      }
      router.push(destino)
      router.refresh()
    } catch {
      setError(ERROR)
    } finally {
      setCargando(false)
    }
  }

  return { entrar, cargando, error }
}
