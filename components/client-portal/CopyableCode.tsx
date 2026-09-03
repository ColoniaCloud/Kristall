'use client'

import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/**
 * Un código destacado, con botón de copiar.
 *
 * Existe porque estos códigos se transcriben a mano. El de garantía tiene la
 * forma `LOT-20260705-0001-R003-I1`: veinticinco caracteres con guiones, dígitos
 * y una I que se confunde con un 1. Copiarlo a mano para pegarlo en un WhatsApp
 * es donde aparecen los errores, y un código mal tipeado manda al cliente a una
 * garantía que no existe.
 *
 * Se muestra en monoespaciada y con `select-all`: un clic lo selecciona entero,
 * para quien prefiera Ctrl+C o esté en un navegador donde el portapapeles no
 * está disponible.
 */
export default function CopyableCode({
  value,
  label,
}: {
  value: string
  /** Qué es este código. Va arriba, chico. */
  label?: string
}) {
  const [copiado, setCopiado] = useState(false)

  // El "copiado" vuelve solo a los 2 s. Sin esto queda un tilde permanente que
  // ya no dice nada sobre la última acción.
  useEffect(() => {
    if (!copiado) return
    const t = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(t)
  }, [copiado])

  async function copiar() {
    try {
      // `navigator.clipboard` no existe fuera de un contexto seguro ni en
      // algunos webviews. Si no está, se avisa en vez de fallar en silencio —
      // el texto igual se puede seleccionar de un clic.
      if (!navigator.clipboard) throw new Error('sin portapapeles')
      await navigator.clipboard.writeText(value)
      setCopiado(true)
    } catch {
      toast.error('No pudimos copiarlo. Seleccionalo y copialo a mano.')
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
      <div className="flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2 pl-3">
        <code className="min-w-0 flex-1 select-all break-all font-mono text-base font-semibold tabular-nums">
          {value}
        </code>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={copiar}
          aria-label={copiado ? 'Código copiado' : 'Copiar código'}
          className="shrink-0"
        >
          {copiado ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copiado ? 'Copiado' : 'Copiar'}
        </Button>
      </div>
    </div>
  )
}
