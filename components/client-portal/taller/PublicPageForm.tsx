'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check, X, ExternalLink, Upload, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import CopyableCode from '@/components/client-portal/CopyableCode'
import type { WorkshopSettings } from '@/lib/client-portal/workshop'

/**
 * La página pública del taller: el nombre de usuario y los datos de contacto
 * que se muestran.
 *
 * El handle es una identidad pública y se elige una sola vez en la práctica:
 * cambiarlo rompe cualquier tarjeta o link que el instalador ya haya repartido.
 * Por eso la pantalla insiste con la disponibilidad antes de guardar y no
 * después, y por eso muestra la URL completa mientras se escribe.
 *
 * La dirección se pide acá y **no se hereda de la ficha del CRM**: el domicilio
 * fiscal no siempre es el local donde se atiende, y una dirección de negocio
 * publicada sin que nadie la haya confirmado es una fuga, no una función.
 */

const BASE_PUBLICA = 'polariz.ar'

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'consultando' }
  | { tipo: 'libre' }
  | { tipo: 'ocupado'; motivo: string }

/** La respuesta del servidor, atada al handle que se preguntó. */
type Respuesta = { handle: string; disponible: boolean; motivo: string | null }

const TIPOS_HERO = ['image/png', 'image/jpeg', 'image/webp']
/**
 * Lado máximo de la foto del hero. Mucho más grande que el logo (400px): acá
 * el detalle importa, es la imagen principal de la página, y ocupa todo el
 * ancho de la pantalla en desktop.
 */
const HERO_LADO_MAX = 1600

/**
 * Redimensiona y recomprime en el navegador. Devuelve un data URI.
 *
 * JPEG y no PNG, a diferencia del logo: esto es una foto de un trabajo, no un
 * logo con fondo transparente, y JPEG pesa una fracción para el mismo detalle
 * — mismo criterio que `achicarFoto` en el formulario público de turnos.
 */
async function achicarHero(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file)
  const escala = Math.min(1, HERO_LADO_MAX / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * escala)
  const h = Math.round(bitmap.height * escala)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('No se pudo procesar la imagen')
  ctx.drawImage(bitmap, 0, 0, w, h)

  return canvas.toDataURL('image/jpeg', 0.82)
}

/**
 * Ejemplo visual de cómo queda el hero, chico y estático — no pide ninguna
 * imagen real. Reproduce en miniatura la estructura de `HeroTaller.tsx` en
 * polarizar: una franja de degradé oscuro a la izquierda con el nombre y la
 * descripción encima, casi transparente a la derecha. Mismo lenguaje visual
 * que el hero de verdad para que no haga falta imaginarlo.
 */
function EjemploHero() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="relative h-28 w-full bg-gradient-to-br from-sky-900 via-slate-700 to-slate-500 sm:h-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative flex h-full w-[42%] flex-col justify-center gap-1.5 px-4">
          <div className="h-2.5 w-24 rounded-full bg-white/90 sm:w-28" />
          <div className="h-1.5 w-16 rounded-full bg-white/60 sm:w-20" />
        </div>
      </div>
      <p className="border-t border-border bg-muted/40 px-3 py-1.5 text-center text-xs text-muted-foreground">
        Así se va a ver
      </p>
    </div>
  )
}

export default function PublicPageForm({
  settings,
  heroSrc,
  demo = false,
}: {
  settings: WorkshopSettings
  /**
   * Ruta ya resuelta hacia la foto del hero actual, si hay — mismo criterio
   * que `logoSrc` en `WorkshopSettingsForm`: `settings.heroUrl` es relativa al
   * CRM, y se arma la URL completa en la página para no repartir
   * `CRM_BASE_URL` en el bundle del cliente más de lo necesario.
   */
  heroSrc: string | null
  /** En demostración la página pública cuelga de `/demo/`, no de la raíz. */
  demo?: boolean
}) {
  const router = useRouter()
  const inputHero = useRef<HTMLInputElement>(null)
  const [handle, setHandle] = useState(settings.handle ?? '')
  const [respuesta, setRespuesta] = useState<Respuesta | null>(null)
  const [sugerencias, setSugerencias] = useState<string[]>([])
  const [guardando, setGuardando] = useState(false)
  const [subiendoHero, setSubiendoHero] = useState(false)
  const [heroPreview, setHeroPreview] = useState<string | null>(heroSrc)
  const [form, setForm] = useState({
    publicAddress: settings.publicAddress ?? '',
    publicPhone: settings.publicPhone ?? '',
    publicEmail: settings.publicEmail ?? '',
    description: settings.description ?? '',
    socialInstagram: settings.socialInstagram ?? '',
    socialFacebook: settings.socialFacebook ?? '',
    socialTiktok: settings.socialTiktok ?? '',
    socialGoogle: settings.socialGoogle ?? '',
  })
  const [modos, setModos] = useState({
    worksAtShop: settings.worksAtShop,
    worksOnSite: settings.worksOnSite,
    worksForDealers: settings.worksForDealers,
  })
  const [rubros, setRubros] = useState({
    doesAutomotive: settings.doesAutomotive,
    doesArchitectural: settings.doesArchitectural,
  })
  const [tema, setTema] = useState(settings.pageTheme)
  const [acento, setAcento] = useState(settings.accentColor)

  /**
   * El rubro cambia la FORMA de la página, no un texto.
   *
   * Con arquitectura marcada aparece un bloque de servicios nuevo, el
   * formulario aprende a pedir dirección en vez de patente, y sale una tarjeta
   * de visita. Por eso se avisa qué pasó y no un «guardado» genérico.
   *
   * Desmarcar el último lo rechaza el CRM: un taller sin rubro no tiene página
   * posible. El error vuelve por `guardar` y se revierte el check.
   */
  async function cambiarRubro(k: keyof typeof rubros, v: boolean) {
    const previo = rubros
    setRubros({ ...rubros, [k]: v })
    const ok = await guardar(
      { [k]: v },
      v ? 'Listo, ya se ve en tu página' : 'Listo, lo sacamos de tu página'
    )
    if (!ok) setRubros(previo)
  }

  /**
   * Marcar o desmarcar guarda en el momento.
   *
   * Es un check: mandarlo a buscar un botón «guardar» después de tocarlo es
   * fricción sin ninguna ventaja, y el riesgo de perder el cambio por navegar
   * antes de guardar desaparece.
   */
  function cambiarModo(k: keyof typeof modos, v: boolean) {
    const proximo = { ...modos, [k]: v }
    setModos(proximo)
    guardar({ [k]: v }, 'Listo, así se va a ver tu página')
  }

  function cambiarTema(v: typeof tema) {
    setTema(v)
    guardar({ pageTheme: v }, 'Listo, así se va a ver el fondo de tu página')
  }

  function cambiarAcento(v: typeof acento) {
    setAcento(v)
    guardar({ accentColor: v }, 'Listo, así se van a ver los botones de tu página')
  }

  // El handle guardado es el que ya es suyo: no tiene sentido consultarlo.
  const sinCambios = handle === (settings.handle ?? '')

  // El estado se DERIVA, no se guarda. Guardarlo obligaba a un setState dentro
  // del efecto, que dispara un render en cascada por cada tecla — y además abría
  // la puerta a mostrar «libre» de una consulta vieja mientras se escribe otra
  // cosa. Atando la respuesta al handle que se preguntó, eso no puede pasar:
  // si no coinciden, todavía estamos consultando.
  const estado: Estado =
    !handle || sinCambios
      ? { tipo: 'inicial' }
      : respuesta?.handle !== handle
        ? { tipo: 'consultando' }
        : respuesta.disponible
          ? { tipo: 'libre' }
          : { tipo: 'ocupado', motivo: respuesta.motivo ?? 'No se puede usar.' }

  const publicable = Boolean(settings.handle) || estado.tipo === 'libre'

  // Sugerencias solo si todavía no eligió. Al que ya tiene handle, ofrecerle
  // otros lo invita a cambiarlo, que es justo lo que no queremos.
  useEffect(() => {
    if (settings.handle) return
    fetch('/api/portal/workshop/handle')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.sugerencias?.length) return
        setSugerencias(d.sugerencias)
        setHandle((actual) => actual || d.sugerencias[0])
      })
      .catch(() => {})
  }, [settings.handle])

  // Debounce de 400 ms. Sin esto se consulta en cada tecla, y el rate limit del
  // CRM es por api key y lo comparte todo el portal: escribir un handle largo
  // se comería la cuota de todos.
  useEffect(() => {
    if (!handle || sinCambios) return
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/portal/workshop/handle?handle=${encodeURIComponent(handle)}`)
        const d = await res.json()
        setRespuesta({ handle, disponible: Boolean(d.disponible), motivo: d.motivo ?? null })
      } catch {
        // Sin respuesta se queda en «consultando», que es honesto: no sabemos.
      }
    }, 400)
    return () => clearTimeout(t)
  }, [handle, sinCambios])

  async function guardar(patch: Record<string, unknown>, mensaje: string) {
    setGuardando(true)
    try {
      const res = await fetch('/api/portal/workshop/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(body.error ?? 'No pudimos guardar')
        return false
      }
      toast.success(mensaje)
      router.refresh()
      return true
    } finally {
      setGuardando(false)
    }
  }

  async function elegirHero(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!TIPOS_HERO.includes(file.type)) {
      toast.error('Tiene que ser PNG, JPG o WEBP')
      return
    }
    setSubiendoHero(true)
    try {
      const dataUri = await achicarHero(file)
      // `achicarHero` siempre recomprime a JPEG, sea cual sea el tipo original.
      const ok = await guardar(
        { heroImage: dataUri, heroImageMimeType: 'image/jpeg' },
        'Foto del hero actualizada'
      )
      if (ok) setHeroPreview(dataUri)
    } catch {
      toast.error('No pudimos procesar esa imagen. Probá con otra.')
    } finally {
      setSubiendoHero(false)
    }
  }

  async function quitarHero() {
    const ok = await guardar({ heroImage: null }, 'Foto del hero quitada')
    if (ok) setHeroPreview(null)
  }

  // El mismo prefijo que usa el CRM para sus rutas espejo. Va acá y no solo en
  // el link de "Verla" porque la dirección también se muestra para copiar, y
  // una dirección que no se puede pegar en el navegador no sirve de nada.
  const prefijo = demo ? `${BASE_PUBLICA}/demo` : BASE_PUBLICA
  const urlCompleta = `${prefijo}/${settings.handle ?? handle}`

  return (
    <section className="flex flex-col gap-5 rounded-lg border border-border bg-card p-4 md:p-6">
      <div>
        <h2 className="font-heading text-lg font-semibold">Tu página pública</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Una página con tu logo y tus servicios, donde tus clientes te piden turno.
        </p>
      </div>

      <div className="flex flex-col gap-3 border-b border-border pb-5">
        <div>
          <p className="text-sm font-medium">Foto de portada</p>
          <p className="text-xs text-muted-foreground">
            Aparece de fondo, a todo el ancho, arriba de tu página. Elegí una buena foto
            horizontal de un trabajo que hayas hecho — es lo primero que ve quien entra.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
          <EjemploHero />

          <div className="flex flex-col gap-2">
            {heroPreview ? (
              <div className="overflow-hidden rounded-lg border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={heroPreview} alt="Foto de portada" className="h-28 w-full object-cover sm:h-32" />
              </div>
            ) : (
              <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground sm:h-32">
                Todavía no subiste ninguna
              </div>
            )}
            <input
              ref={inputHero}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={elegirHero}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={subiendoHero}
                onClick={() => inputHero.current?.click()}
              >
                {subiendoHero ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                {heroPreview ? 'Cambiar foto' : 'Subir foto'}
              </Button>
              {heroPreview && (
                <Button type="button" variant="ghost" size="sm" onClick={quitarHero}>
                  <Trash2 className="size-4" />
                  Quitar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <fieldset className="flex flex-col gap-2 border-b border-border pb-5">
        <legend className="sr-only">Color de fondo de tu página</legend>
        <p className="text-sm font-medium">Color de fondo de tu página</p>
        <p className="text-xs text-muted-foreground">
          Con un fondo oscuro el texto se ve casi blanco; con uno claro, casi negro — se ajusta
          solo para que siempre se pueda leer.
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {(
            [
              { v: 'BLANCO' as const, t: 'Blanco', muestra: 'bg-white text-neutral-900 border-border' },
              { v: 'GRIS_CLARO' as const, t: 'Gris claro', muestra: 'bg-neutral-200 text-neutral-900 border-neutral-300' },
              { v: 'GRIS_OSCURO' as const, t: 'Gris oscuro', muestra: 'bg-neutral-800 text-white border-neutral-700' },
              { v: 'NEGRO' as const, t: 'Negro', muestra: 'bg-black text-white border-neutral-800' },
            ]
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={tema === o.v}
              disabled={guardando}
              onClick={() => cambiarTema(o.v)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${o.muestra} ${
                tema === o.v ? 'ring-2 ring-sky-500 ring-offset-1 ring-offset-background' : ''
              }`}
            >
              <span className="font-medium">{o.t}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2 border-b border-border pb-5">
        <legend className="sr-only">Color de acento de tu página</legend>
        <p className="text-sm font-medium">Color de acento</p>
        <p className="text-xs text-muted-foreground">
          Es el color de los botones y los links de tu página — como el que arma el turno.
        </p>
        <div className="mt-1 flex flex-wrap gap-2">
          {(
            [
              { v: 'AZUL' as const, t: 'Azul', hex: '#0284c7' },
              { v: 'VERDE' as const, t: 'Verde', hex: '#059669' },
              { v: 'VIOLETA' as const, t: 'Violeta', hex: '#7c3aed' },
              { v: 'ROJO' as const, t: 'Rojo', hex: '#dc2626' },
              { v: 'NARANJA' as const, t: 'Naranja', hex: '#ea580c' },
              { v: 'ROSA' as const, t: 'Rosa', hex: '#db2777' },
            ]
          ).map((o) => (
            <button
              key={o.v}
              type="button"
              aria-pressed={acento === o.v}
              aria-label={o.t}
              title={o.t}
              disabled={guardando}
              onClick={() => cambiarAcento(o.v)}
              className={`size-9 rounded-full border-2 transition-all ${
                acento === o.v ? 'ring-2 ring-offset-2 ring-offset-background' : 'border-transparent'
              }`}
              style={{
                backgroundColor: o.hex,
                borderColor: acento === o.v ? o.hex : 'transparent',
                ...(acento === o.v ? ({ '--tw-ring-color': o.hex } as React.CSSProperties) : {}),
              }}
            />
          ))}
        </div>
      </fieldset>

      <div data-tour="handle" className="flex flex-col gap-1.5">
        <Label htmlFor="handle">Nombre de usuario</Label>
        <div className="flex items-center gap-2">
          <span className="shrink-0 text-sm text-muted-foreground">{prefijo}/</span>
          <Input
            id="handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
            placeholder="tallercarlos"
            className="font-mono"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
          />
          <Disponibilidad estado={estado} />
        </div>

        {estado.tipo === 'ocupado' && (
          <span className="text-sm text-destructive">{estado.motivo}</span>
        )}

        {sugerencias.length > 0 && !settings.handle && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Sugerencias:</span>
            {sugerencias.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHandle(s)}
                className="rounded-full border border-border px-2 py-0.5 font-mono text-xs hover:border-sky-500 hover:bg-muted"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {settings.handle
            ? 'Si lo cambiás, los links que ya repartiste dejan de funcionar.'
            : 'Elegilo con cuidado: es la dirección que vas a repartir, y cambiarla rompe los links viejos.'}
        </p>

        {!sinCambios && (
          <Button
            type="button"
            size="sm"
            className="mt-1 self-start"
            disabled={guardando || estado.tipo !== 'libre'}
            onClick={() => guardar({ handle }, 'Nombre de usuario guardado')}
          >
            {guardando && <Loader2 className="size-4 animate-spin" />}
            Guardar nombre
          </Button>
        )}
      </div>

      {settings.handle && (
        <CopyableCode value={urlCompleta} label="La dirección de tu página" />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicAddress">Dirección que se muestra</Label>
          <Input
            id="publicAddress"
            value={form.publicAddress}
            onChange={(e) => setForm({ ...form, publicAddress: e.target.value })}
            placeholder="Av. Siempreviva 742, Springfield"
          />
          <p className="text-xs text-muted-foreground">
            Es la que ven tus clientes. Puede ser distinta de la que tenemos en tu ficha.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicPhone">Teléfono que se muestra</Label>
          <Input
            id="publicPhone"
            type="tel"
            value={form.publicPhone}
            onChange={(e) => setForm({ ...form, publicPhone: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Con este armamos el botón de WhatsApp de tu página.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="publicEmail">Email que se muestra</Label>
          <Input
            id="publicEmail"
            type="email"
            value={form.publicEmail}
            onChange={(e) => setForm({ ...form, publicEmail: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            No es el de tu cuenta: es el de atención al público.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Descripción breve</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          maxLength={280}
          placeholder="Ej: más de 15 años polarizando autos y vidrieras en Villa del Parque."
        />
        <p className="text-xs text-muted-foreground">
          Se muestra en tu página, junto a tu nombre. {form.description.length}/280.
        </p>
      </div>

      <div className="flex flex-col gap-2 border-t border-border pt-4">
        <p className="text-sm font-medium">Redes sociales</p>
        <p className="text-xs text-muted-foreground">
          Completá el link de las que uses — las que dejes vacías no se muestran en tu página.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              { k: 'socialInstagram' as const, t: 'Instagram', p: 'https://instagram.com/tutaller' },
              { k: 'socialFacebook' as const, t: 'Facebook', p: 'https://facebook.com/tutaller' },
              { k: 'socialTiktok' as const, t: 'TikTok', p: 'https://tiktok.com/@tutaller' },
              { k: 'socialGoogle' as const, t: 'Google (Maps o Negocio)', p: 'https://g.page/tutaller' },
            ]
          ).map((o) => (
            <div key={o.k} className="flex flex-col gap-1.5">
              <Label htmlFor={o.k}>{o.t}</Label>
              <Input
                id={o.k}
                type="url"
                value={form[o.k]}
                onChange={(e) => setForm({ ...form, [o.k]: e.target.value })}
                placeholder={o.p}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sobre qué trabaja. Va ANTES de «cómo trabajás» porque es la pregunta
          más de fondo: define qué bloques existen en su página, mientras que la
          de abajo solo prende y apaga tarjetas dentro de ellos. */}
      <fieldset data-tour="rubros" className="flex flex-col gap-2 border-t border-border pt-4">
        <legend className="sr-only">Sobre qué trabajás</legend>
        <p className="text-sm font-medium">¿Sobre qué trabajás?</p>
        <p className="text-xs text-muted-foreground">
          Define qué le pedimos a tu cliente cuando te escribe: a quien tiene un auto, la patente;
          a quien tiene una casa, la dirección.
        </p>
        <div className="mt-1 flex flex-col gap-2">
          {(
            [
              { k: 'doesAutomotive' as const, t: 'Vehículos' },
              { k: 'doesArchitectural' as const, t: 'Vidrios de casas, oficinas y edificios' },
            ]
          ).map((o) => (
            <label key={o.k} className="inline-flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                className="size-4"
                checked={rubros[o.k]}
                disabled={guardando}
                onChange={(e) => cambiarRubro(o.k, e.target.checked)}
              />
              {o.t}
            </label>
          ))}
        </div>
        {rubros.doesAutomotive && rubros.doesArchitectural && (
          <p className="text-xs text-muted-foreground">
            Como hacés las dos cosas, al cargar un servicio vas a poder elegir sobre cuál es. En tu
            página se muestran en dos listas separadas.
          </p>
        )}
      </fieldset>

      {/* Cómo trabaja. Define qué tarjetas aparecen activas en su página: las
          que no marque se muestran igual pero apagadas, porque decir «esto no lo
          hago» también informa y evita que la página cambie de forma según el
          taller. */}
      <fieldset data-tour="modalidades" className="flex flex-col gap-2 border-t border-border pt-4">
        <legend className="sr-only">Cómo trabajás</legend>
        <p className="text-sm font-medium">¿Cómo trabajás?</p>
        <p className="text-xs text-muted-foreground">
          Podés marcar más de una. Lo que no marques aparece en tu página como no disponible.
        </p>
        {rubros.doesArchitectural && !rubros.doesAutomotive && (
          // Las tres opciones de abajo son de taller de autos. A quien solo hace
          // arquitectura no se le esconden —puede tener local— pero se le dice
          // que su página va a ofrecer visita, que es lo que su cliente busca.
          <p className="text-xs text-muted-foreground">
            En arquitectura tu página ofrece siempre «pedir una visita para medir»: nadie lleva su
            ventana al taller.
          </p>
        )}
        <div className="mt-1 flex flex-col gap-2">
          {(
            [
              { k: 'worksAtShop' as const, t: 'Trabajo solo en mi taller' },
              { k: 'worksOnSite' as const, t: 'Trabajo a domicilio' },
              { k: 'worksForDealers' as const, t: 'Trabajo en concesionarias' },
            ]
          ).map((o) => (
            <label key={o.k} className="inline-flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                className="size-4"
                checked={modos[o.k]}
                disabled={guardando}
                onChange={(e) => cambiarModo(o.k, e.target.checked)}
              />
              {o.t}
            </label>
          ))}
        </div>
        {!modos.worksAtShop && !modos.worksOnSite && !modos.worksForDealers && (
          <p className="text-xs text-destructive">
            Si no marcás ninguna, tu página no le ofrece nada a tus clientes.
          </p>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          disabled={guardando}
          onClick={() => guardar(form, 'Datos de contacto guardados')}
        >
          Guardar datos
        </Button>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            className="size-4"
            checked={settings.publicPageEnabled}
            disabled={guardando || !publicable}
            onChange={(e) =>
              guardar(
                { publicPageEnabled: e.target.checked },
                e.target.checked ? 'Tu página está publicada' : 'Tu página dejó de mostrarse'
              )
            }
          />
          <span className={publicable ? undefined : 'text-muted-foreground'}>
            Publicar mi página
          </span>
        </label>

        {settings.publicPageEnabled && settings.handle && (
          <a
            href={`https://${urlCompleta}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-sm text-sky-600 hover:underline dark:text-sky-400"
          >
            Verla <ExternalLink className="size-3.5" />
          </a>
        )}
      </div>

      {!publicable && (
        <p className="text-xs text-muted-foreground">
          Elegí un nombre de usuario para poder publicarla.
        </p>
      )}
    </section>
  )
}

function Disponibilidad({ estado }: { estado: Estado }) {
  if (estado.tipo === 'consultando') {
    return <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" />
  }
  if (estado.tipo === 'libre') return <Check className="size-4 shrink-0 text-emerald-600" />
  if (estado.tipo === 'ocupado') return <X className="size-4 shrink-0 text-destructive" />
  return <span className="size-4 shrink-0" />
}
