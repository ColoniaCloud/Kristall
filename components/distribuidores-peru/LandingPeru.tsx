import Image from 'next/image'
import { BadgeCheck, Globe, LayoutDashboard, Mail, Megaphone, ShieldCheck } from 'lucide-react'
import Aparece from '@/components/distribuidores-peru/Aparece'
import HeroVideo from '@/components/catalogo-propuesta/HeroVideo'
import VideoSistema from '@/components/distribuidores-peru/VideoSistema'
import { MensajePeru, WhatsAppFlotante, WhatsAppPeru } from '@/components/distribuidores-peru/WhatsAppPeru'
import { demora, paso } from '@/components/distribuidores-peru/movimiento'
import Bandera from '@/components/distribuidores-peru/Bandera'
import { PAISES, type Pais } from '@/components/distribuidores-peru/paises'
import { WhatsAppIcon } from '@/components/catalogo-propuesta/whatsapp'
import { CONTENEDOR, SECCION, TITULO } from '@/components/catalogo-propuesta/layout'
import {
  CONTACTO,
  DESTACADAS,
  PASOS,
  POR_QUE,
  RECIBE,
  TABLA,
  TABLA_ARQUITECTURA,
  VIDEO_ID,
} from '@/data/distribuidores-peru'
import '@/components/distribuidores-peru/peru.css'

const TITULO_VIDEO = 'Presentación del sistema Kristall'

const GRUPOS_TABLA = [
  { titulo: 'Automotriz', lineas: TABLA },
  { titulo: 'Arquitectura', lineas: TABLA_ARQUITECTURA },
]

/** Rótulo de sección: dorado, como en el PDF de la propuesta. */
function Rotulo({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] font-medium uppercase tracking-[0.18em] text-[#E6A800]">{children}</p>
}

const ICONOS_POR_QUE = [ShieldCheck, LayoutDashboard, Megaphone, BadgeCheck]

/** A quién va dedicada la propuesta (lo que el CRM devuelve para el token). */
export type Invitado = { name: string; business: string }

/** El mensaje que llega por WhatsApp cuando el invitado toca cualquier botón. */
function mensajeDe(pais: Pais, invitado?: Invitado): string {
  if (!invitado) return PAISES[pais].mensaje
  return `Hola! Soy ${invitado.name} de ${invitado.business}. Vi la propuesta del Programa Distribuidor Autorizado de Kristall y quiero conocerlo.`
}

/**
 * Encabezado sobre la portada, con forma de mail (avatar, De, Para, Asunto): la
 * propuesta se siente enviada a esa persona. Solo aparece en la versión
 * personalizada (/distribuidores-peru/<token>). El nombre y el negocio salen del
 * CRM; el remitente es el mismo que firma el WhatsApp y el mail reales.
 */
function Dedicatoria({ invitado }: { invitado: Invitado }) {
  const filas: { etiqueta: string; valor: React.ReactNode; clase?: string }[] = [
    {
      etiqueta: 'De',
      valor: (
        <>
          <span className="text-white">Carlos Arrúa</span>
          <span className="text-white/45"> · Kristall Film</span>
        </>
      ),
    },
    {
      etiqueta: 'Para',
      valor: (
        <>
          <span className="text-white">{invitado.name}</span>
          <span className="text-white/45"> · {invitado.business}</span>
        </>
      ),
    },
    {
      etiqueta: 'Asunto',
      valor: (
        <>
          Propuesta del Programa Distribuidor Autorizado para{' '}
          <span className="text-[#E6A800]">{invitado.business}</span>
        </>
      ),
      clase: 'text-lg font-semibold leading-snug text-white lg:text-2xl',
    },
  ]

  return (
    <aside
      aria-label="Propuesta personalizada"
      className="relative z-10 border-b border-white/10 bg-[#0E0E0E] pt-[env(safe-area-inset-top)]"
    >
      <div className={`${CONTENEDOR} flex gap-4 py-5 lg:gap-5 lg:py-7`}>
        <span
          aria-hidden="true"
          className="kp-in mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E6A800] text-lg font-semibold text-[#0A0A0A] lg:size-12 lg:text-xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          K
        </span>
        <dl className="min-w-0 flex-1 text-[14px] lg:text-[15px]">
          {filas.map((f, i) => (
            <div
              key={f.etiqueta}
              className={`kp-in grid grid-cols-[3.5rem_1fr] items-baseline gap-x-3 lg:grid-cols-[4.5rem_1fr] ${
                i < filas.length - 1 ? 'border-b border-white/[0.07] py-1.5' : 'pb-0.5 pt-3'
              }`}
              style={demora(80 + 100 * i)}
            >
              <dt className="text-white/45">{f.etiqueta}</dt>
              <dd className={`min-w-0 break-words ${f.clase ?? 'text-white/80'}`} style={f.clase ? { fontFamily: 'var(--font-display)' } : undefined}>
                {f.valor}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </aside>
  )
}

/**
 * La landing de distribuidores. `pais` elige la versión (bandera y nombre del
 * país en la portada, mensaje de WhatsApp); sin `pais` es la de Perú, que es la
 * página pública original. El nombre del componente quedó de cuando solo
 * existía esa.
 */
export function LandingPeru({ invitado, pais = 'PE' }: { invitado?: Invitado; pais?: Pais }) {
  return (
    <MensajePeru mensaje={mensajeDe(pais, invitado)}>
    <main className="kf-catalogo">
      {invitado && <Dedicatoria invitado={invitado} />}
      <Hero pais={pais} />

      {/* ——— Por qué Kristall ——— */}
      <section id="sistema" className={`scroll-mt-4 ${SECCION}`}>
        <div className={CONTENEDOR}>
          <Aparece className="max-w-3xl">
            <div className="kp-item" style={paso(0)}>
              <Rotulo>Por qué Kristall</Rotulo>
            </div>
            <h2 className={`kp-item mt-4 ${TITULO}`} style={{ ...paso(1), fontFamily: 'var(--font-display)' }}>
              El producto no es solo la lámina. Es todo lo que la rodea.
            </h2>
            <p className="kp-item mt-5 max-w-2xl text-base leading-relaxed text-white/65 lg:text-lg" style={paso(2)}>
              Vender láminas requiere más que buen rendimiento. Kristall le entrega a su red las herramientas para
              diferenciarse, retener clientes y generar demanda.
            </p>
          </Aparece>

          <Aparece className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:mt-16">
            {POR_QUE.map((item, i) => {
              const Icono = ICONOS_POR_QUE[i]
              return (
                <article key={item.titulo} className="kp-item bg-[#0A0A0A] p-6 lg:p-10" style={paso(i)}>
                  <Icono className="size-6 text-[#E6A800]" strokeWidth={1.75} aria-hidden="true" />
                  <h3 className="mt-5 text-xl font-semibold lg:text-2xl" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/65 lg:text-base">{item.texto}</p>
                </article>
              )
            })}
          </Aparece>

          <Aparece className="mt-12 lg:mt-16">
            <blockquote
              className="kp-item max-w-4xl border-l-2 border-[#E6A800] pl-5 text-[clamp(1.5rem,5.5vw,2.6rem)] font-semibold leading-[1.12] lg:pl-8"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              La garantía la pide el cliente final.{' '}
              <span className="text-white/55">Por eso el instalador vuelve a comprar Kristall.</span>
            </blockquote>
          </Aparece>
        </div>
      </section>

      {/* ——— Video ——— */}
      <section id="video" className={`scroll-mt-4 border-y border-white/[0.06] bg-[#0E0E0E] ${SECCION}`}>
        <div className={CONTENEDOR}>
          <Aparece className="lg:grid lg:grid-cols-[1fr_2fr] lg:items-end lg:gap-14">
            <div>
              <div className="kp-item" style={paso(0)}>
                <Rotulo>Cómo funciona</Rotulo>
              </div>
              <h2 className={`kp-item mt-4 ${TITULO}`} style={{ ...paso(1), fontFamily: 'var(--font-display)' }}>
                El sistema, en un video.
              </h2>
              <p className="kp-item mt-5 text-base leading-relaxed text-white/65 lg:text-lg" style={paso(2)}>
                Un recorrido por la suite que recibe su red: del pedido en el Portal de Cliente a la Garantía Digital
                activada en cada instalación.
              </p>
            </div>
            <div className="kp-item mt-8 lg:mt-0" style={paso(3)}>
              <VideoSistema id={VIDEO_ID} titulo={TITULO_VIDEO} />
            </div>
          </Aparece>
        </div>
      </section>

      {/* ——— Portafolio ——— */}
      <section id="portafolio" className={`scroll-mt-4 ${SECCION}`}>
        <div className={CONTENEDOR}>
          <Aparece className="max-w-4xl">
            <div className="kp-item" style={paso(0)}>
              <Rotulo>Líneas de lanzamiento</Rotulo>
            </div>
            <h2 className={`kp-item mt-4 ${TITULO}`} style={{ ...paso(1), fontFamily: 'var(--font-display)' }}>
              Una línea para cada cliente. <span className="text-white/55">Una escalera para vender más.</span>
            </h2>
          </Aparece>

          <Aparece className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-5">
            {DESTACADAS.map((l, i) => (
              <article
                key={l.nombre}
                className="kp-item flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141414]"
                style={paso(i)}
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={l.foto}
                    alt={`Lámina ${l.nombre} instalada`}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 400px"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/10 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col px-5 pb-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-2xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                      {l.nombre}
                    </h3>
                    <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#E6A800]">{l.rubro}</span>
                  </div>
                  <p className="mt-2 text-[15px] leading-relaxed text-white/65">{l.descripcion}</p>
                  <p className="mt-auto pt-4 text-sm font-medium tabular-nums text-[#E6A800]">{l.datos}</p>
                </div>
              </article>
            ))}
          </Aparece>

          {/* Tabla: en PC una tabla de verdad; en celular, una fila por línea con los datos debajo. */}
          <Aparece className="mt-12 lg:mt-16">
            <div className="kp-item" style={paso(0)}>
              <table className="hidden w-full border-collapse text-left lg:table">
                <caption className="sr-only">Especificaciones de las líneas automotrices y de arquitectura</caption>
                <thead className="text-[13px] text-white/55">
                  <tr className="border-b border-white/20">
                    {['Línea', 'Tecnología', 'VLT', 'IR', 'UV', 'Garantía'].map((h, i) => (
                      <th key={h} scope="col" className={`py-3 font-medium ${i >= 3 ? 'text-right' : ''} ${i === 5 ? '' : 'pr-6'}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                {GRUPOS_TABLA.map((g) => (
                  <tbody key={g.titulo}>
                    <tr>
                      <th scope="colgroup" colSpan={6} className="pb-2 pt-8 text-left text-sm font-medium text-[#E6A800]">
                        {g.titulo}
                      </th>
                    </tr>
                    {g.lineas.map((l) => (
                      <tr key={l.slug} className="border-b border-white/[0.07]">
                        <th scope="row" className="py-4 pr-6 text-left text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                          {l.nombre}
                        </th>
                        <td className="py-4 pr-6 text-white/70">{l.tecnologia}</td>
                        <td className="py-4 pr-6 tabular-nums text-white/70">{l.vlt}</td>
                        <td className="py-4 pr-6 text-right tabular-nums">{l.ir}</td>
                        <td className="py-4 pr-6 text-right tabular-nums">{l.uv}</td>
                        <td className="py-4 text-right tabular-nums">{l.garantia}</td>
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>

              <div className="lg:hidden">
              {GRUPOS_TABLA.map((g) => (
              <section key={g.titulo} aria-label={g.titulo} className="mt-8 first:mt-0">
              <h3 className="mb-2 text-sm font-medium text-[#E6A800]">{g.titulo}</h3>
              <ul className="divide-y divide-white/[0.08] border-y border-white/15">
                {g.lineas.map((l) => (
                  <li key={l.slug} className="py-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                        {l.nombre}
                      </span>
                      <span className="text-sm tabular-nums text-white/80">{l.garantia}</span>
                    </div>
                    <p className="mt-0.5 text-[13px] text-white/55">{l.tecnologia}</p>
                    <dl className="mt-2 flex gap-5 text-[13px] tabular-nums">
                      <div className="flex gap-1.5">
                        <dt className="text-white/45">VLT</dt>
                        <dd className="text-white/85">{l.vlt}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-white/45">IR</dt>
                        <dd className="text-white/85">{l.ir}</dd>
                      </div>
                      <div className="flex gap-1.5">
                        <dt className="text-white/45">UV</dt>
                        <dd className="text-white/85">{l.uv}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
              </section>
              ))}
              </div>
            </div>
            <p className="kp-item mt-5 max-w-3xl text-[13px] leading-relaxed text-white/55 lg:text-sm" style={paso(1)}>
              Rollos automotrices de 1.52 × 30 m (PPF 1.52 × 15 m). Kore se elige por calidad óptica, color estable y terminación
              superior. Precios y condiciones comerciales se presentan en reunión.
            </p>
          </Aparece>
        </div>
      </section>

      {/* ——— Qué recibe su empresa ——— */}
      <section id="recibe" className={`scroll-mt-4 border-t border-white/[0.06] ${SECCION}`}>
        <div className={`${CONTENEDOR} lg:grid lg:grid-cols-[1fr_1.4fr] lg:gap-16`}>
          <Aparece>
            <div className="kp-item" style={paso(0)}>
              <Rotulo>Distribuidor autorizado</Rotulo>
            </div>
            <h2 className={`kp-item mt-4 ${TITULO}`} style={{ ...paso(1), fontFamily: 'var(--font-display)' }}>
              Usted vende el producto. <span className="text-white/55">La marca trabaja con usted.</span>
            </h2>
            <div className="kp-item mt-8 hidden lg:block" style={paso(2)}>
              <WhatsAppPeru
                donde="recibe"
                className="inline-flex h-14 items-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-[#0A0A0A] transition hover:bg-white/90 active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-5 text-[#25D366]" />
                Quiero ser distribuidor
              </WhatsAppPeru>
            </div>
          </Aparece>

          <Aparece className="mt-10 lg:mt-0">
            <ul className="grid gap-x-10 sm:grid-cols-2">
              {RECIBE.map((r, i) => (
                <li key={r.titulo} className="kp-item border-t border-white/12 py-5" style={paso(i)}>
                  <h3 className="flex items-center gap-3 text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                    <span className="h-px w-5 shrink-0 bg-[#E6A800]" aria-hidden="true" />
                    {r.titulo}
                  </h3>
                  <p className="mt-2 pl-8 text-[15px] leading-relaxed text-white/60">{r.texto}</p>
                </li>
              ))}
            </ul>
          </Aparece>
        </div>
      </section>

      {/* ——— Cómo empezar ——— */}
      <section id="empezar" className={`scroll-mt-4 bg-[#0E0E0E] ${SECCION}`}>
        <div className={CONTENEDOR}>
          <Aparece>
            <div className="kp-item" style={paso(0)}>
              <Rotulo>Cómo empezar</Rotulo>
            </div>
            <h2 className={`kp-item mt-4 ${TITULO}`} style={{ ...paso(1), fontFamily: 'var(--font-display)' }}>
              Cuatro pasos para activar su red.
            </h2>
          </Aparece>

          {/* Una secuencia real: por eso los números. En celular la línea baja por la izquierda; en PC cruza arriba. */}
          <Aparece className="mt-10 lg:mt-14">
            <ol className="relative grid gap-8 border-l border-white/15 pl-6 lg:grid-cols-4 lg:gap-8 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-8">
              {PASOS.map((p, i) => (
                <li key={p} className="kp-item relative" style={paso(i)}>
                  <span
                    className="absolute -left-[29px] top-2 size-2.5 rounded-full bg-[#E6A800] lg:-top-[37px] lg:left-0"
                    aria-hidden="true"
                  />
                  <span className="block text-4xl font-semibold tabular-nums text-[#E6A800] lg:text-5xl" style={{ fontFamily: 'var(--font-display)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="mt-2 max-w-[16rem] text-base leading-snug text-white/80 lg:text-lg">{p}</p>
                </li>
              ))}
            </ol>
          </Aparece>
        </div>
      </section>

      {/* ——— Cierre ——— */}
      <section id="contacto" data-sin-flotante className="relative isolate overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,rgba(230,168,0,0.12),transparent_60%)]" />
        <div className={`${CONTENEDOR} lg:grid lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-16`}>
          <Aparece>
            <h2
              className="kp-item text-[clamp(3.25rem,16vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.02em]"
              style={{ ...paso(0), fontFamily: 'var(--font-display)' }}
            >
              Hablemos.
            </h2>
            <p className="kp-item mt-6 max-w-md text-base leading-relaxed text-white/65 lg:text-lg" style={paso(1)}>
              Coordinamos una reunión, vemos qué líneas le convienen a su mercado y armamos el primer pedido.
            </p>
            <p className="kp-item mt-6 text-sm text-white/55" style={paso(2)}>
              {CONTACTO.firma}
            </p>
          </Aparece>

          <Aparece className="mt-10 lg:mt-0">
            <div className="kp-item flex flex-col gap-3" style={paso(0)}>
              <WhatsAppPeru
                donde="cierre"
                className="flex h-16 items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 text-lg font-semibold text-[#0A0A0A] shadow-[0_10px_40px_rgba(37,211,102,0.25)] transition hover:bg-[#2fe072] active:scale-[0.98]"
              >
                <WhatsAppIcon className="size-6" />
                Escribir por WhatsApp
              </WhatsAppPeru>
              <a
                href={`mailto:${CONTACTO.email}`}
                className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 text-base font-medium text-white transition hover:bg-white/10 active:scale-[0.98]"
              >
                <Mail className="size-5" aria-hidden="true" />
                {CONTACTO.email}
              </a>
            </div>
            <p className="kp-item mt-5 text-center text-sm tabular-nums text-white/55 lg:text-left" style={paso(1)}>
              WhatsApp {CONTACTO.telefonoVisible}
            </p>
          </Aparece>
        </div>
      </section>

      {/* ——— Barra final: toda la franja es el link a la web global ——— */}
      <footer data-sin-flotante>
        {/* <a> y no <Link>: la web global tiene otro layout raíz (otro <html>), así que
            la navegación es una carga completa igual; un <a> lo dice sin rodeos. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/es"
          className="group flex min-h-16 w-full items-center justify-center gap-3 bg-[#E6A800] px-5 pb-[env(safe-area-inset-bottom)] text-base font-semibold text-[#0A0A0A] transition-colors hover:bg-[#f2b70f] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-[#0A0A0A] lg:min-h-20 lg:text-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <Globe className="size-5 transition-transform duration-300 group-hover:rotate-12 lg:size-6" aria-hidden="true" />
          Ir a la web global
        </a>
      </footer>

      <WhatsAppFlotante />
    </main>
    </MensajePeru>
  )
}

/** Primera pantalla: la portada del PDF (fondo negro, plano en diagonal y trazo dorado). */
function Hero({ pais }: { pais: Pais }) {
  const nombrePais = PAISES[pais].nombre
  const lineas = [['Más', 'que'], ['una', 'lámina.'], ['Un', 'sistema.']]
  let n = 0

  return (
    <section className="relative isolate flex min-h-[92svh] flex-col overflow-hidden lg:min-h-[100svh]">
      {/* Mismo video de fondo que /catalogo-propuesta: póster en el HTML y el
          video recién cuando la página terminó de cargar (ver HeroVideo). */}
      <HeroVideo />
      {/* Velo semitransparente: deja ver el video pero el texto se lee en
          cualquier cuadro. Abajo funde con el negro de la sección siguiente. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 via-50% to-[#0A0A0A]" />
      <div className="absolute inset-0 -z-10 hidden bg-gradient-to-r from-black/70 via-black/30 to-transparent lg:block" />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon points="64,0 100,0 100,62" fill="#ffffff" fillOpacity="0.035" />
        <path d="M0 86 L100 72" stroke="#ffffff" strokeOpacity="0.07" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>
      {/* El trazo dorado va en su propia capa: se "dibuja" destapándose de arriba
          hacia abajo (clip-path), porque con non-scaling-stroke el truco del
          stroke-dasharray mide en píxeles de pantalla y sale punteado. */}
      <svg
        aria-hidden="true"
        className="kp-trazo pointer-events-none absolute inset-0 -z-10 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path d="M76 0 L100 34" stroke="#E6A800" strokeWidth="1.25" vectorEffect="non-scaling-stroke" fill="none" />
      </svg>

      <header className={`${CONTENEDOR} flex items-center justify-between pt-[max(1.25rem,env(safe-area-inset-top))] lg:pt-8`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- logo chico, no gana nada con el optimizador */}
        <img src="/LogoPlano.png" alt="Kristall Film" width={112} height={26} className="kp-in h-6 w-auto lg:h-7" />
        {/* La versión sin país (invitados de fuera de Perú, Argentina y Uruguay) no lleva píldora. */}
        {pais !== 'OTHER' && nombrePais && (
          <span className="kp-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-medium tracking-[0.08em] text-white/85 backdrop-blur" style={demora(100)}>
            <Bandera pais={pais} />
            {nombrePais.toUpperCase()}
          </span>
        )}
      </header>

      <div className={`${CONTENEDOR} mt-auto pt-16 lg:pt-10`}>
        <p className="kp-in text-[12px] font-medium uppercase tracking-[0.2em] text-[#E6A800]" style={demora(150)}>
          Programa Distribuidor Autorizado
        </p>

        <h1
          className="mt-5 text-[clamp(3rem,13vw,5rem)] font-semibold leading-[0.98] tracking-[-0.015em] lg:text-[7rem]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {lineas.map((palabras, i) => (
            <span key={i} className={`block ${i === 2 ? 'text-[#E6A800]' : ''}`}>
              {palabras.map((p) => (
                <span key={p} className="kp-in mr-[0.22em] inline-block last:mr-0" style={demora(250 + 80 * n++)}>
                  {p}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <span className="kp-regla mt-7 block h-[2px] w-12 bg-[#E6A800] lg:mt-9" style={demora(800)} aria-hidden="true" />

        <p className="kp-in mt-6 max-w-xl text-base leading-relaxed text-white/75 lg:text-xl" style={demora(850)}>
          Líneas Standard y Premium para el sector automotor y la arquitectura, respaldadas por un sistema: Garantía Digital en cada
          instalación y una suite digital para que su red venda más.
        </p>

        <div className="kp-in mt-8 flex flex-col gap-3 sm:flex-row lg:mt-10" style={demora(950)}>
          <WhatsAppPeru
            donde="hero"
            className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 text-base font-semibold text-[#0A0A0A] transition hover:bg-white/90 active:scale-[0.98]"
          >
            <WhatsAppIcon className="size-5 text-[#25D366]" />
            Quiero ser distribuidor
          </WhatsAppPeru>
          <a
            href="#video"
            className="inline-flex h-14 items-center justify-center whitespace-nowrap rounded-xl border border-white/20 bg-white/5 px-6 text-base font-medium text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
          >
            Ver cómo funciona
          </a>
        </div>

        {/* Los tres pilares del pie de la portada del PDF. */}
        <dl className="mt-14 grid border-t border-white/12 pb-8 lg:mt-20 lg:grid-cols-3 lg:gap-10 lg:pb-12">
          {[
            ['Automotriz', 'Nanoceramic, Nanocarbon, Dyed, Seguridad y PPF.'],
            ['Arquitectura', 'Control Solar, Espejado, Seguridad y Decorativa.'],
            [
              'Suite Kristall',
              'CRM y ERP de control, Panel de instaladores, Agentes de IA, Incentivo de marketing y Garantías digitales por rollo e instalación.',
            ],
          ].map(([t, d], i) => (
            <div
              key={t}
              className="kp-in grid grid-cols-[7.5rem_1fr] gap-3 border-b border-white/[0.07] py-3.5 lg:block lg:border-b-0 lg:py-5"
              style={demora(1050 + 100 * i)}
            >
              <dt className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#E6A800] lg:text-[12px]">{t}</dt>
              <dd className="text-sm leading-snug text-white/75 lg:mt-2 lg:text-[15px]">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
