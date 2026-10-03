'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Copy, Check, Share2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

/**
 * El link de garantía de un rollo, para que el revendedor se lo pase a quien se
 * lo compre.
 *
 * ─── Por qué esto existe ───────────────────────────────────────────────────
 *
 * Un instalador no lo necesita: genera sus propios sub-códigos desde el portal.
 * Un revendedor **no instala**, así que este link es lo único que le puede
 * entregar a su comprador — y sin él, el rollo sale, se vende, se instala, y la
 * garantía no se activa nunca.
 *
 * Se copia el link entero y no el código: lo que el comprador va a hacer es
 * abrirlo, y un código suelto obliga a explicarle dónde pegarlo.
 *
 * `navigator.share` cuando existe, porque esto se usa desde el celular y el
 * destino real es un WhatsApp. Si no está, cae al portapapeles; si tampoco,
 * avisa en vez de fallar callado.
 */

// Que el navegador sepa compartir no cambia mientras la página está abierta.
const sinSuscripcion = () => () => {}

export default function CopiarLinkGarantia({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false)
  // `navigator` no existe en el servidor: el snapshot de servidor dice `false` y
  // React recién usa el del cliente después de hidratar, así no se desincroniza.
  const puedeCompartir = useSyncExternalStore(
    sinSuscripcion,
    () => typeof navigator.share === 'function',
    () => false,
  )

  useEffect(() => {
    if (!copiado) return
    const t = setTimeout(() => setCopiado(false), 2000)
    return () => clearTimeout(t)
  }, [copiado])

  async function compartir() {
    if (puedeCompartir) {
      try {
        await navigator.share({
          title: 'Garantía Kristall Film',
          text: 'Activá la garantía de tu lámina Kristall Film acá:',
          url,
        })
        return
      } catch (err) {
        // Cancelar el diálogo de compartir tira AbortError. No es un error que
        // haya que mostrarle a nadie: la persona decidió no compartir.
        if (err instanceof Error && err.name === 'AbortError') return
        // Cualquier otra cosa: se sigue al portapapeles, que es el plan B.
      }
    }
    try {
      if (!navigator.clipboard) throw new Error('sin portapapeles')
      await navigator.clipboard.writeText(url)
      setCopiado(true)
    } catch {
      toast.error('No pudimos copiarlo. Abrí el link y copialo de la barra.')
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={compartir} className="shrink-0">
      {copiado ? (
        <Check className="size-4" />
      ) : puedeCompartir ? (
        <Share2 className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
      {copiado ? 'Copiado' : puedeCompartir ? 'Compartir garantía' : 'Copiar garantía'}
    </Button>
  )
}
