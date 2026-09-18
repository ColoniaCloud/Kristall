'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'general', label: 'General' },
  { key: 'pagina', label: 'Página pública' },
  { key: 'album', label: 'Álbum de fotos' },
  { key: 'servicios', label: 'Servicios' },
] as const

type Tab = (typeof TABS)[number]['key']

/**
 * Las cuatro secciones de Configuración, en tabs en vez de todas apiladas.
 *
 * Recibe cada sección ya renderizada (Server Components) y solo decide cuál
 * mostrar — nada se remonta al cambiar de tab (se esconde con `hidden`, no se
 * desmonta), mismo criterio que usa `TurnoWizard` en polarizar para no perder
 * el estado de un formulario a medio llenar si el instalador va y vuelve.
 */
export default function ConfiguracionTabs({
  general,
  pagina,
  album,
  servicios,
  tabInicial = 'general',
}: {
  general: React.ReactNode
  pagina: React.ReactNode
  album: React.ReactNode
  servicios: React.ReactNode
  /**
   * En demostración arranca en "pagina": 3 de los 4 pasos del recorrido
   * guiado de esta pantalla viven ahí (rubros/modalidades/handle), y un paso
   * cuyo ancla está en una tab que no es la activa se saltea en silencio
   * (ver `Recorrido.tsx`) — así llegan.
   */
  tabInicial?: Tab
}) {
  const [activa, setActiva] = useState<Tab>(tabInicial)
  const contenido: Record<Tab, React.ReactNode> = { general, pagina, album, servicios }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiva(t.key)}
            aria-current={activa === t.key}
            className={cn(
              'shrink-0 whitespace-nowrap border-b-2 px-3 py-2.5 text-sm font-medium transition-colors',
              activa === t.key
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t) => (
        <div key={t.key} className={activa === t.key ? 'contents' : 'hidden'}>
          {contenido[t.key]}
        </div>
      ))}
    </div>
  )
}
