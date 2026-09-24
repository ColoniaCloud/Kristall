import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

/**
 * Las piezas de publicidad interna que se muestran dentro del panel.
 *
 * No hay CMS detrás: son archivos sueltos en `public/ads/<variante>/<lugar>/`.
 * Para cambiar la tanda se suben o se borran imágenes de esa carpeta y se
 * despliega —en Hostinger pushear es publicar—, sin tocar código ni la base.
 *
 * Se lee el directorio en vez de listar los nombres acá para que agregar una
 * quinta pieza no sea un cambio de código. El resultado se memoriza por
 * proceso: `public/` solo cambia con un deploy, y un deploy levanta un proceso
 * nuevo.
 */
export interface Ad {
  /** Ruta pública, lista para `next/image`. */
  src: string
  /** Medidas reales del archivo: sin ellas la columna salta mientras carga. */
  width: number
  height: number
}

/**
 * Los lugares que existen hoy. Es una unión y no un `string` para que pedir un
 * slot sin carpeta sea un error de compilación y no una columna vacía en
 * producción.
 */
export type AdSlot = 'desktop/dashboard' | 'mobile/dashboard'

const EXTENSIONES = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'])

const cache = new Map<AdSlot, Promise<Ad[]>>()

export function listAds(slot: AdSlot): Promise<Ad[]> {
  const cacheado = cache.get(slot)
  if (cacheado) return cacheado

  const pedido = leerSlot(slot).catch((err: unknown) => {
    // Una carpeta que falta o un archivo ilegible no pueden tumbar el
    // dashboard: la publicidad es lo menos importante de la pantalla. Se saca
    // del cache para que el próximo render lo vuelva a intentar.
    cache.delete(slot)
    console.error(`[ads] no se pudo leer public/ads/${slot}`, err)
    return []
  })

  cache.set(slot, pedido)
  return pedido
}

async function leerSlot(slot: AdSlot): Promise<Ad[]> {
  const dir = path.join(process.cwd(), 'public', 'ads', ...slot.split('/'))

  const archivos = (await readdir(dir))
    .filter((f) => EXTENSIONES.has(path.extname(f).toLowerCase()))
    // `numeric` para que 2.png vaya antes que 10.png. El orden del nombre es el
    // único control que tiene quien sube las piezas sobre el orden de la tanda.
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }))

  const ads = await Promise.all(
    archivos.map(async (file): Promise<Ad> => {
      const { width, height } = await sharp(path.join(dir, file)).metadata()
      return {
        // encodeURIComponent por los nombres con espacios o acentos: estas
        // imágenes las sube alguien a mano, no un uploader que las normaliza.
        src: `/ads/${slot}/${encodeURIComponent(file)}`,
        width,
        height,
      }
    })
  )

  return ads.filter((a) => a.width > 0 && a.height > 0)
}
