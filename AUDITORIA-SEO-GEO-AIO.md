# Auditoría SEO / GEO / AIO — kristall-web

Fecha: 2026-09-26 · Sitio auditado: **producción** (`https://kristallfilm.com`), commit local `9d2cb93`
(el working tree solo difiere en `data/catalogo.json`, así que lo que se ve en producción es este código).

Enfoque del negocio asumido para priorizar: **B2B distribuidores + instaladores** como audiencia de
conversión, **usuario final informándose** como audiencia de captación. Todo hallazgo abajo está
verificado contra producción con `curl` y con el navegador; donde algo es inferencia y no medición, se
dice explícitamente.

---

## Estado de ejecución

**Fase 0 aplicada (2026-09-26), sin desplegar todavía.** Resueltos y verificados sobre un build local:
P0-1, P0-2, P0-3, P1-1 y P1-2. Ver «Fase 0 — qué se cambió» al final del documento. El resto de los
hallazgos sigue abierto tal como está descrito.

Corrección importante respecto de la primera versión de este informe: la causa de P0-3 (y de P0-2) **no
era** el streaming del shell ni el renderizado dinámico, como conjeturé. Era
`app/[locale]/loading.tsx`. El detalle está en la sección de P0-3, reescrita con la causa real.

---

## Resumen ejecutivo

La base técnica de SEO está **bien construida**: hay `generateMetadata` en las 13 rutas públicas,
`buildAlternates()` centralizado con canonical + hreflang correctos, sitemap generado desde el catálogo,
JSON-LD de `Product`/`BreadcrumbList`/`Organization`/`WebSite`/`BlogPosting`, CSP y cabeceras de
seguridad, redirects 301 para los slugs viejos. Eso ya está resuelto y no hay que rehacerlo.

Los problemas reales son de **otra naturaleza** y se agrupan en cuatro frentes:

1. **Tres defectos que rompen el crawl** — dos links a 404 en el bloque más visible del home, un 500
   determinístico en el blog, y soft-404 con status 200 en todo el namespace del catálogo.
2. **Renderizado 100% dinámico** — de todo el sitio público, **cero páginas** se prerenderizan. El
   `generateStaticParams` de las rutas de producto no hace nada. Todo se sirve con `no-store`.
3. **El locale `pt` es un fantasma** — el sitemap y los hreflang lo publican, pero sus `<title>` y
   `<meta description>` salen en español y ninguna página lo prerenderiza ni lo enlaza.
4. **Contenido insuficiente para GEO/AIO** — 97 palabras en una ficha de producto, blog con 0 artículos
   publicados, ni una FAQ en todo el sitio, y un `llms.txt` con datos técnicos que contradicen al
   catálogo real.

Impacto de negocio concentrado: las tres landings B2B (`/punto-kristall`, `/concesionarias`,
`/propuesta-aberturas`) —las páginas que traen distribuidores e instaladores— **no están en el nav
principal ni reciben un solo link desde el `<main>` del home**. Solo cuelgan del footer.

---

## P0 — Defectos que rompen el crawl

### P0-1 · Dos links a 404 en el bloque principal del home

`components/sections/HeroCategories.tsx:56` y `:89` apuntan a `/autos` y `/arquitectura`. Las rutas
reales son `/productos/autos` y `/productos/arquitectura`.

Verificado en producción:

```
/es/autos              404
/es/arquitectura       404
/es/productos/autos    200
```

Este es el bloque «Categorías de producto», la entrada primaria a los dos verticales del negocio. El
resultado es doble: el usuario que hace clic en «Automotive» o «Architectural» desde el home cae en un
404, y las dos páginas de nicho —que sí existen, sí están en el sitemap y sí tienen metadata— reciben
**cero link interno desde el home**. Googlebot descubre dos 404 en cada crawl de la página con más
autoridad del sitio.

Fix: cambiar ambos `href` a `/productos/autos` y `/productos/arquitectura`.

### P0-2 · HTTP 500 determinístico en cualquier slug de blog inexistente

```
GET /es/blog/no-existe  →  500 Internal Server Error  (reproducible, 2/2 intentos)
```

La respuesta es la página de error pelada de Next (2.1 KB), **no** nuestro layout — lo que indica que
el fallo ocurre antes de que se renderice el shell, es decir en `generateMetadata` o en el módulo de la
ruta `app/[locale]/blog/[slug]/page.tsx`, no en el `notFound()` del cuerpo. `/es/blog` responde 200, así
que la conexión a Payload/Postgres funciona: el fallo es específico de la rama «artículo no encontrado».

Por qué importa más que un 404 común: Google reduce la tasa de crawl de un sitio que devuelve 5xx, y
esta URL es trivialmente alcanzable (un link viejo, un slug cambiado, un scraper). Con el blog en 0
artículos, **hoy toda URL de blog que alguien pruebe devuelve 500**.

Fix: diagnosticar cuál de las dos ramas explota (log en producción o reproducción local con
`CRM_MOCK=1`), y agregar el caso «slug inexistente» como test de regresión.

### P0-3 · Soft-404 con status 200 en todo el namespace del catálogo

```
/es/productos/lineas/no-existe            200   ← debería ser 404
/es/productos/lineas/keram-x/no-existe    200   ← debería ser 404
/es/productos/no-existe                   200   ← debería ser 404
/es/pagina-que-no-existe                  404   ✓ (esta sí está bien)
```

Las tres primeras llaman `notFound()` correctamente en el código y renderizan
`app/[locale]/not-found.tsx`, pero la respuesta sale con **200**. Está parcialmente mitigado
(`<meta name="robots" content="noindex">` presente), pero:

- El status 200 hace que Google lo clasifique como soft-404 y lo reporte en Search Console.
- El `<link rel="canonical">` de esa página apunta a `https://kristallfilm.com/es` — un 404 no debe
  canonicalizar al home; eso invita a consolidar señales de URLs basura hacia la portada.
- El `<title>` sale duplicado: `Kristall Film | Kristall Film`.
- Es un espacio de URLs infinito y crawleable: cualquier bot puede generar variantes indefinidamente.

**Causa raíz (verificada, no hipótesis): `app/[locale]/loading.tsx`.**

Ese archivo crea un límite de Suspense sobre todo el árbol `[locale]`, la respuesta pasa a servirse en
streaming, y Next manda la cabecera de status (200) **antes** de procesar el `notFound()`. Es un
comportamiento conocido de Next ([#76474](https://github.com/vercel/next.js/issues/76474),
[#64446](https://github.com/vercel/next.js/issues/64446)).

Cómo se aisló, descartando un sospechoso por vez:

| Prueba | Resultado |
|---|---|
| `notFound()` en una page mínima bajo `[locale]` | 200 |
| Ruta inexistente (`/es/nada`, la maneja el router) | 404 ✓ |
| La misma page con el `not-found.tsx` anidado apartado | 200 — no era eso |
| La misma page en modo dev, sin prerender ni ISR | 200 — no era el prerender |
| La misma page fuera de `[locale]`, sin `loading.tsx` encima | **404 ✓** |
| Con `app/[locale]/loading.tsx` apartado | **404 en todas** ✓ |

Un falso positivo que vale anotar para no volver a caerse en él: el `x-middleware-rewrite` que next-intl
emite siempre (incluso cuando reescribe al mismo path) parecía el culpable, porque la única ruta que daba
404 era la que quedaba fuera del matcher del middleware. Quitando ese rewrite no-op el status siguió en
200: lo que esa ruta tampoco tenía era el `loading.tsx`.

Fix adicional independiente: `app/[locale]/not-found.tsx` está **hardcodeado en español**. Un visitante
de `/en`, `/de` o `/pt` que cae en un 404 lee «Página no encontrada». Debería usar `getTranslations`.

---

## P1 — Renderizado y performance

### P1-1 · Cero páginas prerenderizadas: todo el sitio público se renderiza en cada request

Evidencia del build local (`.next/prerender-manifest.json`):

```
prerendered: 4
  /robots.txt
  /sitemap.xml
  /garantia
  /garantia/acceder
```

Ni el home, ni `/productos`, ni las 136 URLs de línea/producto del sitemap. Y en producción, **todas**
las páginas salen con:

```
Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
```

Causa: **`setRequestLocale` no se llama en ningún archivo del repo** (verificado con grep en `app/`,
`lib/`, `i18n/`). `next-intl` lo exige para habilitar renderizado estático; sin él, `getTranslations()` y
`getMessages()` leen la request y toda página queda opt-in a dinámico. Consecuencia directa: los
`generateStaticParams()` de `productos/[nicho]`, `lineas/[linea]` y `lineas/[linea]/[producto]` —y el
`export const revalidate = 3600` de blog, concesionarias, punto-kristall y propuesta-aberturas— **no
tienen ningún efecto**.

Qué cuesta esto:

- TTFB medido: **125 ms en desktop, 833 ms en móvil** para contenido que es idéntico para todos y que
  cambia una vez por build.
- Cada página del sitemap se re-renderiza en cada crawl de Googlebot, GPTBot, ClaudeBot y
  PerplexityBot, sobre hosting compartido de Hostinger. Esto se conecta con el incidente ya documentado
  de procesos en la cuenta: el costo por request es real, no teórico.
- `no-store` impide cualquier caché de CDN o de navegador.

Fix: llamar `setRequestLocale(locale)` en `app/[locale]/layout.tsx` y en cada `page.tsx` bajo
`[locale]`, siguiendo la guía de `next-intl` para static rendering. Es el cambio con mejor relación
impacto/esfuerzo de toda la auditoría: arregla TTFB, crawl budget, consumo de procesos y probablemente
P0-3, sin tocar una línea de contenido.

### P1-2 · 6.2 MB de imagen en el home, servida cruda como background CSS

Medición real de la home en producción, tras scroll completo:

| Recurso | Peso | Tiempo |
|---|---|---|
| `/futermail.png` | **6180 KB** | 14.6 s |
| `/sr.mp4` | 3566 KB | 9.8 s |
| `/builds.jpg` | 993 KB | 14.7 s |
| resto (JS, CSS, hero.webp optimizada) | ~240 KB | — |

`load` event de la home: **15.3 s** en desktop.

Las tres son `background-image` / `<video src>` en CSS o JSX plano, así que **no pasan por
`next/image`**: no hay conversión a WebP/AVIF, ni resize por breakpoint, ni lazy loading.

- `components/sections/ContactCTA.tsx:15` — `bg-[url('/futermail.png')]`, 6.2 MB. El nombre del archivo
  delata que es un asset de plantilla de mail reutilizado como fondo decorativo del CTA. Además lleva
  `bg-fixed`, que degrada el scroll en móvil y iOS lo ignora.
- `components/sections/BrandStory.tsx:113` — `url(/builds.jpg)`, 993 KB.
- `components/sections/ShowRoomComingSoon.tsx:57` — `<video src="/sr.mp4" preload="auto" aria-hidden>`,
  3.5 MB, decorativo, en una sección de 220 px de alto. **Con `preload="auto"` se descarga completo
  también en móvil**: medido, 3.57 de los 3.6 MB del peso total móvil de la home son este video.

Fix, por orden de impacto:

1. `preload="none"` + `poster` en el video, y no cargarlo bajo `prefers-reduced-data` / conexiones
   lentas. Recomprimir a ~400 KB (es un loop decorativo de 220 px).
2. Reemplazar los dos `background-image` por `<Image fill>` con `sizes`, o al menos recomprimir
   `futermail.png` a WebP (un fondo de esa escala debería pesar <150 KB, no 6 MB).
3. Revisar los 20+ PNG de `public/Productos/destacadas/` (2.1–2.9 MB cada uno). Hoy sí pasan por
   `next/image`, pero optimizar un PNG de 2.8 MB en caliente con `sharp` en hosting compartido es caro
   por request; conviene bajarlos al origen.

### P1-3 · Las fuentes cuelgan de una cadena serializada de 3 niveles

`app/globals.css:1-2` carga DM Sans y Anybody con `@import url('https://fonts.googleapis.com/...')`, y
`Clash Display` con un `@font-face` que apunta a `/fonts/`. **`next/font` no se usa en ninguna parte**
del repo (verificado con grep).

Cadena medida en producción:

```
 873 ms → 878 ms    CSS propio (/_next/static/css/...)
 883 ms → 1797 ms   fonts.googleapis.com/css2 (DM Sans)   ← descubierto DENTRO del CSS
1845 ms → 2855 ms   /fonts/ClashDisplay-Variable.woff2     ← descubierto DENTRO del CSS
```

El texto no llega a su tipografía final hasta **~2.9 s**, y ~2 s de eso es latencia de descubrimiento
evitable. No hay `preconnect` a `fonts.googleapis.com` ni a `fonts.gstatic.com`, y el woff2 local
tampoco está precargado.

Fix: migrar las tres a `next/font` (`next/font/google` para DM Sans y Anybody, `next/font/local` para
Clash Display). Autohostea, precarga e inyecta el `@font-face` en el CSS crítico — elimina los dos
saltos de la cadena.

---

## P2 — Internacionalización: el locale `pt` publicado pero no implementado

`i18n/routing.ts` declara `['es','en','de','pt']` y `i18n/messages/pt.json` está **completo** (503
claves, cero faltantes respecto de `es` — verificado). El problema no es la traducción, es el cableado.

Verificado en producción, `GET /pt`:

```
<html lang="pt">
<title>Inicio | Kristall Film</title>                    ← español
<meta name="description" content="Láminas polarizantes…"> ← español
<h1>Performance aplicada ao conforto</h1>                 ← portugués ✓
```

El cuerpo está en portugués, la metadata en español. Google lee una página declarada `pt`, apuntada por
un hreflang `pt`, listada en el sitemap (45 URLs `/pt/`), con título y descripción en otro idioma.

Causa: los objetos `pageMeta` de cada page tienen solo `es`/`en`/`de` y caen a `es` por el
`?? pageMeta.es`. Afecta a: `page.tsx`, `productos/page.tsx`, `contacto`, `nosotros`, `servicios`,
`blog`, `concesionarias`, `punto-kristall`, `propuesta-aberturas`.

Y hay cuatro lugares más donde `pt` quedó afuera:

| Archivo | Línea | Qué falta |
|---|---|---|
| `app/[locale]/productos/[nicho]/page.tsx` | 11 | `generateStaticParams` sin `pt` |
| `app/[locale]/productos/lineas/[linea]/page.tsx` | 12 | idem |
| `app/[locale]/productos/lineas/[linea]/[producto]/page.tsx` | 14 | idem |
| `app/[locale]/blog/[slug]/page.tsx` | 24 | `const locales = ['es','en','de']` |
| `components/layout/Header.tsx` | 234 | el selector de idioma no ofrece `pt` |
| `app/robots.ts` | — | `Disallow` cubre `/es/carrito`, `/en/carrito`, `/de/carrito` — falta `/pt/carrito` |
| `lib/blog.ts` | 14 | `type BlogLocale = 'es'\|'en'\|'de'` — un artículo en `/pt` cae a contenido `es` |
| `components/layout/Footer.tsx` | 13 | `useLocale() as 'es'\|'en'\|'de'`; en `pt` la dirección pierde el link a Maps |

Como el Header no ofrece `pt`, las 45 URLs portuguesas **no reciben ningún link interno**: son páginas
huérfanas que solo existen en el sitemap.

Decisión previa a los fixes: **¿el mercado `pt` (Brasil) está abierto o no?** Son dos caminos opuestos:

- **Sí** → completar `pageMeta.pt` en las 9 pages, sumar `pt` a los 4 `generateStaticParams` y a
  `BlogLocale`, habilitarlo en el Header, y sumar `/pt/carrito` al robots.
- **Todavía no** → sacar `pt` de `lib/seo.ts:LOCALES` y de `i18n/routing.ts`. El `pt.json` queda en el
  repo esperando. Publicar hreflang y sitemap de un idioma a medio implementar es peor que no tenerlo.

Recomendación: si no hay operación comercial en Brasil en este trimestre, la segunda. Hoy el estado
intermedio es el peor de los dos.

---

## P3 — GEO / AIO: qué puede citar un modelo de este sitio

Esta es la parte más débil, y es la que más pesa para la audiencia B2B: un instalador o un distribuidor
que le pregunta a ChatGPT, Claude o Perplexity «qué lámina cerámica conviene para calor en Buenos
Aires» o «cómo me hago distribuidor de láminas» necesita que haya algo sustantivo que citar.

### P3-1 · Las fichas de producto tienen 97 palabras

Medido en `/es/productos/lineas/keram-x/knce05` (`<main>`, texto visible): **97 palabras**. Encabezados
de la página: un solo `<h1>`, y después directamente los `<h3>` del footer. **Ni un `<h2>` en todo el
cuerpo.**

Todo el contenido único de la ficha es la tabla de especificaciones (VLT 5%, IR 95%, UV 99%, 2 ply,
KNCE05) más la descripción de línea, que se **repite idéntica en las dos fichas de la línea** y en la
página de línea. Para un motor de IA, la página no responde ninguna pregunta: no dice para qué vehículo
sirve, cómo se compara con Karbon, qué ancho de rollo viene, qué cubre la garantía de 10 años, qué
normativa de VLT aplica en Argentina, ni nada de la operación B2B (pedido mínimo, metros por rollo,
precio de distribución).

La página de línea está igual: **152 palabras** en `/es/productos/lineas/keram-x`.

Fix mínimo por ficha (apunta a 350–500 palabras de contenido propio, no relleno):
- Un `<h2>` «Para qué sirve» con 2–3 casos de uso concretos.
- Un `<h2>` «Cómo se compara» con la diferencia real contra la línea vecina (los datos ya están en
  `data/catalogo.json`: Karbon IR 73–86 vs Keram X IR 95 — eso se puede generar).
- Un `<h2>` «Qué cubre la garantía» con los años y el alcance.
- Datos de rollo (ancho, metraje) y condiciones de compra mayorista.

### P3-2 · El blog tiene 0 artículos publicados

El sitemap de producción tiene **180 URLs y ninguna de `/blog/`**. La lógica de
`app/[locale]/blog/page.tsx:27` es correcta y se autonoindexa por falta de contenido — pero eso
confirma el hueco: **el sitio no tiene una sola pieza de contenido informativo**.

Es el canal natural para captar al «usuario común que busca información» y para ser citado por modelos.
Temas con demanda evidente y cero cobertura hoy: qué significa VLT, qué VLT es legal en Argentina,
nano-cerámica vs nano-carbono, cuánto dura un polarizado, PPF vs polarizado, cómo se cuida una lámina
recién instalada, cómo se verifica una garantía.

### P3-3 · No hay una sola FAQ en el sitio, y el helper de FAQ schema es código muerto

`lib/seo.ts` exporta cuatro helpers de JSON-LD que **ningún archivo importa** (verificado con grep
sobre `app/`, `components/`, `lib/`):

| Helper | Estado |
|---|---|
| `faqJsonLd()` | nunca usado |
| `organizationJsonLd()` | nunca usado |
| `localBusinessJsonLd()` | nunca usado |
| `breadcrumbJsonLd()` | nunca usado (las páginas arman el breadcrumb inline) |

Y no existe contenido de FAQ en ninguna parte (grep sobre `i18n/messages/es.json`, `components/sections/`
y `app/[locale]/`: cero resultados). `FAQPage` es el formato que los motores de IA consumen con más
facilidad; el helper está escrito y esperando contenido.

### P3-4 · El `Organization` que sí se publica es más pobre que el que está sin usar

El que llega al HTML es el objeto inline de `app/[locale]/layout.tsx:11-32`. El de `lib/seo.ts:75` está
muerto. Comparación:

| Campo | Vivo (layout) | Muerto (`lib/seo.ts`) |
|---|---|---|
| `sameAs` (LinkedIn, Facebook, Instagram) | **ausente** | presente |
| `email` de contacto | ausente | presente |
| `logo` | `/LogoPlano.png` ✓ | `/logo.png` — **el archivo no existe** |
| `areaServed`, `knowsLanguage` | presentes | ausentes |

`sameAs` es la señal principal para que un buscador o un modelo vincule la entidad «Kristall Film» con
sus perfiles reales. Los tres links existen en `components/common/SocialIcons.tsx:52-55` y se renderizan
en el footer, pero no están en el grafo. Y `localBusinessJsonLd()` —con dirección Av. Juan B Justo 2918,
teléfono y email— nunca se emite, así que el showroom de CABA no tiene marcado estructurado.

Fix: fusionar ambos en un solo `organizationJsonLd()` (con `sameAs`, `email`, `areaServed`,
`knowsLanguage` y `logo: /LogoPlano.png`), usarlo desde el layout, y emitir `localBusinessJsonLd()` en
`/contacto` y `/nosotros`.

### P3-5 · `llms.txt` contradice al catálogo real

`public/llms.txt` y `public/llms-full.txt` están escritos a mano y **no se generan desde
`data/catalogo.json`**, así que ya divergieron. Contraste con el catálogo real (21 productos, 13 líneas):

| Afirmación en `llms-full.txt` | Catálogo real |
|---|---|
| KLASS: VLT 5%, 15%, 35%, 50% | solo **5% y 15%** |
| KLASS: UV 99% | KLS05 99%, KLS15 **92%** |
| KARBON: garantía **7 años** | **10 años** |
| KARBON: IR ~50–70% | **73% y 86%** |
| KARBON: VLT 5/15/35/50 | solo 5% y 15% |
| KERAMX: VLT 5/15/35/70 | solo 5% y 15% |
| KRYPTON: VLT 5/20/35/transparente, IR 85–90% | un solo producto: KS4-15, VLT **15%**, IR **95%** |
| «VLT available from 5% to 50%» | hasta **90%** (Klear) y 70% (Kaiser) |

Y faltan **tres líneas enteras**: **Kron** (3 productos), **Kore** (2) y **Kaiser** (1). Un modelo que
lea este archivo va a afirmar con confianza que Karbon tiene 7 años de garantía y que existe un Keram X
al 35%. Es peor que no tener el archivo: es desinformación con formato de fuente autorizada.

Tres problemas estructurales más en los mismos archivos:

- **Cero URLs.** El sentido de `llms.txt` es ser un índice de links a las páginas del sitio. Estos
  archivos solo mencionan `https://kristallfilm.com`. No hay un link a `/es/productos/lineas/keram-x`,
  ni a `/es/punto-kristall`, ni a `/es/concesionarias`.
- **Idiomas cruzados.** `llms.txt` está íntegramente en inglés, `llms-full.txt` en español. El mercado
  primario es `es`.
- **Contradicción de identidad.** `llms.txt` abre con «Kristall Film is a premier **manufacturer** and
  distributor», mientras el `Organization` del sitio dice «**Distribuidor oficial**». Un modelo va a
  repetir que Kristall fabrica. Hay que decidir cuál es y decir lo mismo en los dos lados.
- **Naming obsoleto.** Describe «Polarized App» como el software, pero el home ya reemplazó ese bloque
  por «Portal Instaladores» (commit `9d2cb93`). Y llama «Keramx» a lo que en el sitio es «Keram X»
  (slug `keram-x`).

Fix: generar `llms.txt` desde `data/catalogo.json` en el mismo `prebuild` que corre
`scripts/sync-catalogo.mjs`, con un índice de links por línea y producto. Es el mismo patrón de deriva
que ya tiene el PDF del catálogo: si no se genera, se desactualiza sin que nadie lo note.

### P3-6 · El `Product` schema no tiene `description` ni `offers`

`lib/seo.ts:productJsonLd()` emite `name`, `sku`, `url`, `image`, `brand`, `category` y
`additionalProperty` (VLT/IR/UVR/garantía — bien resuelto). Faltan:

- **`description`** — el campo que un motor de IA usa para resumir el producto. Está disponible:
  `tp(linea.descKey)`.
- **`offers`** — sin `offers`, `review` o `aggregateRating`, Google **no muestra rich result de
  producto**. Para un catálogo B2B sin precio público, la salida es un `Offer` con
  `availability: InStock`, `priceCurrency: ARS` y `businessFunction`, o bien declarar los productos como
  `ProductModel` (que no exige oferta) en lugar de `Product`.
- `material`, `width` / `additionalProperty` de ancho de rollo — datos que un instalador busca.

---

## P4 — Arquitectura de links y contenido B2B

### P4-1 · Las tres landings B2B no están en el nav ni reciben links del home

`components/layout/Header.tsx:71-90` define el nav: Inicio, Productos (→ catálogo, garantía), Nosotros,
Blog, Software (→ servicios, acceso), Contacto.

**No aparecen** `/punto-kristall`, `/concesionarias` ni `/propuesta-aberturas`. Y en el home, los 17
links internos del `<main>` medidos en producción son: `/productos`, `/contacto`, las 13 líneas de
producto, y los dos 404 del P0-1. **Ninguno a las tres landings B2B.** Solo cuelgan del footer.

Para un sitio cuyo objetivo declarado es captar distribuidores e instaladores, las páginas que hacen
exactamente eso son las que menos autoridad interna reciben. Google reparte PageRank interno por links;
el footer es la posición de menor peso.

Fix: una entrada de nav de primer nivel —«Distribuidores», «Sumate» o similar— con las tres como hijas,
y un bloque en el home que las enlace con texto de anclaje descriptivo. El `<h1>` del home
(«Performance aplicada al confort») y sus `<h2>` no contienen una sola palabra de intención B2B:
ni «distribuidor», ni «mayorista», ni «instalador».

### P4-2 · El `<h1>` del home se lee concatenado

`h1.innerHTML` en producción:

```html
<span class="block" style="font-weight:600">Performance</span><span class="block" style="font-weight:400">aplicada al confort</span>
```

Dos `<span class="block">` sin espacio ni salto entre ellos. El navegador lo muestra bien porque
`block` los apila, pero al extraer el texto sin estilos —que es lo que hace un crawler de texto o un
modelo— sale **«Performanceaplicada al confort»**. Mismo patrón en la página de línea: **«Línea Keram
X— Nano Ceramic»**.

Fix: un espacio explícito entre los spans (`{' '}`) o un `aria-label` en el `<h1>`.

### P4-3 · `lastmod` del sitemap es inútil

`app/sitemap.ts` pone `lastModified: new Date()` en todas las entradas estáticas, de nicho, de línea y
de producto. Verificado: las 180 URLs del sitemap de producción comparten **2 valores distintos** de
`<lastmod>` — o sea, la hora del build.

Eso le dice a Google que las 180 páginas cambiaron simultáneamente en cada deploy, lo que hace que
ignore la señal (o desconfíe de todo el sitemap). Fix: usar `generadoEl` de `data/catalogo.json` para
las URLs de catálogo y una fecha fija por página estática.

### P4-4 · Redirect del dominio raíz en 307 y `www` sin canonicalizar

```
GET https://kristallfilm.com/       →  307 Temporary Redirect → /es
GET https://www.kristallfilm.com/   →  307 Temporary Redirect → /es
```

Dos detalles:

- **307 en lugar de 308/301.** El redirect raíz → `/es` es permanente por diseño. Un 307 le dice a
  Google que no consolide señales. `next-intl` usa 307 por defecto; se puede forzar permanente en el
  middleware.
- **`www` sirve el sitio en vez de redirigir al apex.** El canonical apunta al apex, así que el riesgo
  de contenido duplicado está mitigado, pero conviene un 301 de `www` → apex a nivel host o middleware
  para no depender solo del canonical.

### P4-5 · `robots.txt` no menciona `llms.txt` ni tiene política explícita para crawlers de IA

El `robots.txt` actual tiene un solo bloque `User-Agent: *` con `Allow: /`, lo que **permite**
GPTBot, ClaudeBot, PerplexityBot y OAI-SearchBot por omisión — está bien si la intención es ser citado.
Dos mejoras:

- Declarar `llms.txt` (no hay estándar de `robots.txt` para eso, pero sí conviene un
  `<link rel="llms-txt">` o al menos que esté enlazado y accesible; hoy responde 200 pero nada lo
  anuncia).
- Decidir explícitamente sobre `Google-Extended` (entrenamiento de Gemini) en lugar de dejarlo al
  default.

---

## Lo que está bien y no hay que tocar

Para que la lista de arriba no dé una impresión falsa:

- `buildAlternates()` genera canonical + hreflang + `x-default` correctos y consistentes en las 13
  rutas. Los hreflang se emiten de verdad en el HTML (verificado).
- El comentario de `app/[locale]/layout.tsx:71` sobre `{default, template}` y el de `lib/seo.ts:9`
  sobre el no-deep-merge de `openGraph` documentan dos trampas reales de Next que ya están resueltas.
  No las rompan.
- Los 301 del middleware para `/propuesta-vidrierias` → `/propuesta-aberturas` y
  `/productos/categorias/*` → `/productos/lineas/*`, con el caso especial de `vitral` → nicho, están
  bien pensados.
- `/carrito` con `robots: noindex, follow` y `/blog` autonoindexándose sin artículos: las dos
  decisiones son correctas y están comentadas.
- `resolveProductImage()` chequeando el archivo en disco para no emitir una `og:image` rota.
- GA4 con `send_page_view: false` + tracker propio para no duplicar el pageview inicial.
- El `viewport` es correcto y **no hay desborde horizontal en móvil** (medido a 375 px).
- `BreadcrumbList` en líneas y fichas, `BlogPosting` completo con `dateModified` y `publisher`.

---

## Orden de ejecución sugerido

| # | Tarea | Esfuerzo | Por qué en este orden |
|---|---|---|---|
| 1 | Arreglar los dos `href` de `HeroCategories` (P0-1) | minutos | Un 404 en el bloque principal del home; es una línea por link |
| 2 | `setRequestLocale` en layout + pages (P1-1) | horas | Desbloquea prerender, TTFB, crawl budget, consumo de procesos, y probablemente P0-3 |
| 3 | Diagnosticar el 500 del blog (P0-2) | horas | Un 5xx público baja la tasa de crawl de todo el sitio |
| 4 | `preload="none"` + poster en `sr.mp4`, recomprimir `futermail.png` (P1-2) | horas | 9.7 MB → ~1 MB en la home, sin rediseñar nada |
| 5 | Decidir `pt`: completar o retirar (P2) | decisión + horas | Es una decisión de negocio, no técnica; hoy el estado intermedio es el peor |
| 6 | Generar `llms.txt` desde el catálogo (P3-5) | horas | Hoy el archivo desinforma activamente a los modelos |
| 7 | Nav + links del home a las landings B2B (P4-1) | horas | Impacto directo en la audiencia que paga |
| 8 | `next/font` (P1-3) | horas | ~2 s del critical path |
| 9 | Fusionar el `Organization`, emitir `LocalBusiness`, `description`+`offers` en `Product` (P3-4, P3-6) | horas | Entidad y rich results |
| 10 | Contenido: FAQs con `FAQPage`, engordar fichas, arrancar el blog (P3-1, P3-2, P3-3) | semanas | El trabajo de fondo para GEO/AIO; el helper ya está escrito esperando contenido |

Los puntos 1 a 4 son defectos: se arreglan y se cierran. Del 5 al 9 es cableado. El 10 es el único que
requiere trabajo editorial sostenido, y es el que determina si un modelo puede citar a Kristall Film
cuando alguien pregunta por láminas en Latinoamérica.

---

## Fase 0 — qué se cambió

Aplicado el 2026-09-26 sobre el commit `9d2cb93`. **Nada de esto está desplegado todavía**: en Hostinger
pushear es publicar, así que el deploy es una decisión aparte.

### P0-1 · Los dos 404 del home

`components/sections/HeroCategories.tsx` — `/autos` → `/productos/autos` y `/arquitectura` →
`/productos/arquitectura`. Verificado en el HTML renderizado: ya no queda ninguna referencia a los slugs
viejos.

### P1-1 · Renderizado estático

- `app/[locale]/layout.tsx`: `setRequestLocale(locale)` + su propio `generateStaticParams()` desde
  `routing.locales` (sin esto el segmento `[locale]` no tiene params conocidos en build y nada se
  prerenderiza).
- Las 14 pages bajo `[locale]`: `setRequestLocale(locale)`. Las nueve que no recibían `params` ahora lo
  reciben.
- Los tres `generateStaticParams` del catálogo pasaron de `['es','en','de']` hardcodeado a
  `routing.locales` — de paso elimina una fuente de deriva y suma las rutas de catálogo en `pt`.

Resultado medido:

| | Antes | Después |
|---|---|---|
| Rutas prerenderizadas | 4 | **188** (46 por locale, simétrico) |
| `Cache-Control` del sitio público | `private, no-cache, no-store, must-revalidate` | `s-maxage=31536000` |

### P0-2 y P0-3 · Status codes

- **Eliminado `app/[locale]/loading.tsx`** (la causa raíz, ver arriba). Con eso `notFound()` devuelve 404
  real en todo el árbol `[locale]`, incluido `/blog/[slug]`, que era el que devolvía 500 en producción.
  Se pierde el skeleton de carga: decisión tomada a conciencia, porque las 188 páginas ahora se sirven
  prerenderizadas desde caché y ya no hay tiempo de render que tapar — y ese skeleton tenía forma de home
  (hero + stats + grid) y se mostraba igual en `/contacto` y `/blog`.
- `dynamicParams = false` en las tres rutas del catálogo. Con el `loading.tsx` afuera ya no hace falta
  para el status, pero se deja porque sigue siendo correcto: el catálogo es un set cerrado que sale de
  `data/catalogo.json` en el `prebuild`, y así el router rechaza los slugs inventados en vez de generar y
  cachear una página de 404 por cada URL que pruebe un bot.

Verificación final (build local, `next start`):

```
404 ✓  /es/blog/no-existe   /en/blog/no-existe   /pt/blog/no-existe
404 ✓  /es/productos/lineas/no-existe   /es/productos/lineas/keram-x/no-existe
404 ✓  /es/productos/no-existe   /es/nada
200 ✓  las 17 rutas válidas comprobadas (4 locales), todas con s-maxage
```

### P1-2 · Peso del home

| Asset | Antes | Después |
|---|---|---|
| `futermail.png` → `futermail.webp` | 6180 KB | **232 KB** (−96%) |
| `builds.jpg` → `builds.webp` (solo el background CSS) | 993 KB | **71 KB** (−93%) |
| `sr.mp4` | 3566 KB bajados siempre, también en celular | `preload="none"`: solo si el visitante llega a la sección |

Total de imágenes del home: **~7.2 MB → 612 KB**. También se sacó `bg-fixed` del CTA (degrada el scroll
en móvil y iOS lo ignora).

Los `.png` originales quedan en `public/` por si hacen falta; nada los referencia. El `.webp` se generó
con el `sharp` que ya es dependencia del proyecto.

### Lo que quedó sin hacer, a propósito

- **`sr.mp4` sigue pesando 3.5 MB.** Ahora se baja tarde, pero cuando se baja son 3.5 MB para un loop
  decorativo de 220 px. Recomprimirlo necesita ffmpeg, que no está en este entorno. Tampoco se le puso
  `poster` por lo mismo (no se puede extraer un frame); visualmente no se nota porque la sección tiene
  fondo `#1A1A1A` y un overlay `black/65` encima.
- **Los 20+ PNG de `public/Productos/destacadas/`** (2.1–2.9 MB cada uno) siguen igual. Pasan por
  `next/image`, así que el navegador recibe WebP optimizado, pero optimizar un PNG de 2.8 MB en caliente
  con `sharp` en hosting compartido es caro por request. Conviene bajarlos al origen.
- **`app/[locale]/not-found.tsx` sigue hardcodeado en español** (P0-3, último párrafo). Ahora devuelve 404
  correcto, pero un visitante de `/en`, `/de` o `/pt` lee «Página no encontrada».
- **Todo P2 (el locale `pt`), P3 y P4.** P2 necesita una decisión de negocio; P3 y P4 son el trabajo de
  fondo.

### Hallazgos nuevos, fuera del alcance de la Fase 0

- **`payload.config.ts` tiene `push: true`.** Un `next dev` local sincroniza schema contra el Postgres de
  producción — se vio en el log del dev server («Pulling schema from database»). Vale revisarlo aparte.
- **`.claude/launch.json`, entrada `kristall-web-mock`**: `set CRM_MOCK=1 && pnpm dev` deja el valor con
  un espacio al final, así que `CRM_MOCK` no matchea `'1'` y le pega al CRM real igual.

---

## Fase 1 — el locale `pt`, completado

Decisión tomada el 2026-09-26: **el mercado `pt` (Brasil) se está abriendo**, así que se completó el
cableado en vez de retirar el locale. Sigue sin desplegar.

### Metadatos

`pageMeta.pt` en las 9 pages que caían a español (`page`, `productos`, `nosotros`, `servicios`,
`contacto`, `blog`, `concesionarias`, `punto-kristall`, `propuesta-aberturas`). La copia usa la
terminología que ya trae `pt.json`, que es de Brasil y no una traducción literal del español:
«Insulfilm automotivo», «Películas», «Concessionárias», «Ponto Kristall», «Proposta Esquadrias»,
«Sobre nós», «zero-quilômetro». Verificado: las 9 páginas devuelven título y descripción propios en pt.

### Un solo tipo `Locale`

La causa de que `pt` se quedara afuera en cinco lugares era que cada componente repetía el union
`'es' | 'en' | 'de'` a mano. Ahora `i18n/routing.ts` exporta `type Locale` derivado de `routing.locales`,
y lo usan `Header`, `Footer`, `TopBar` y `LanguageSelector`. Además:

- El selector del menú mobile (`Header.tsx`) itera `routing.locales` en vez de una lista fija.
- `LanguageSelector` pasó de un array a un `Record<Locale, …>`: si mañana se suma un idioma al routing y
  no se le da bandera, **no compila** — en vez de desaparecer del selector en silencio, que es justo lo
  que le había pasado a `pt`.
- `app/robots.ts` deriva los `Disallow` de `/carrito` de `routing.locales` (faltaba `/pt/carrito`).
- `blog/[slug]` genera sus params desde `routing.locales`; `BlogLocale` incluye `pt`.

### Hallazgo nuevo: el sitio no tenía un solo link interno entre idiomas

Al revisar el selector apareció algo que la primera pasada de la auditoría no vio. El informe decía que
«el Header no ofrece pt»: eso era **inexacto** — el `LanguageSelector` del TopBar ya ofrecía pt con
bandera de Brasil. El problema real era peor y afectaba a los cuatro idiomas: el desplegable se montaba
solo al abrirlo y navegaba con `router.replace` sobre `<button>`, así que **el HTML servido no contenía
ningún link a `/en`, `/de` ni `/pt`**. Los rastreadores llegaban a las otras locales únicamente por
hreflang y sitemap, sin grafo de links interno.

Arreglado: el desplegable se renderiza siempre y se oculta con `hidden` (que además lo saca del orden de
tabulación y del árbol de accesibilidad), y cada opción es un `<Link>` con `locale`, o sea un `<a href>`
real. Verificado en una ficha de producto: los cuatro `href` a `/es|/en|/de|/pt/...` están en el HTML.

### Blog en portugués

`payload/collections/Articles.ts` suma `title_pt`, `excerpt_pt` y `content_pt`. `title_pt` queda **sin
`required`**, a diferencia de es/en/de: la columna se agrega sobre una tabla que ya existe, así que tiene
que ser nullable; el fallback de `lib/blog.ts` sirve el título en español hasta que se traduzca. Cuando el
contenido en pt esté al día se puede pasar a `required`.

Las tres columnas se crearon en el Postgres de Neon con SQL explícito y aditivo, en una transacción
(`ALTER TABLE articles ADD COLUMN IF NOT EXISTS`, tipos espejando es/en/de: `varchar`, `varchar`, `jsonb`,
las tres nullable). Se eligió eso antes que un push de Payload porque `push: true` sincroniza **todo** el
esquema y aplicaría de una vez cualquier deriva acumulada. La tabla tenía 0 filas.

Sin esas columnas el build registraba `column "title_pt" does not exist` en cada consulta al blog; después
de crearlas el build queda limpio.

### El 404, y lo que quedó sabido sobre cómo se sirve

Se tradujo `app/[locale]/not-found.tsx` (namespace `not_found` en los cuatro idiomas) y hubo que hacerlo
**componente cliente**: con `getTranslations()` del lado servidor la página salía vacía, porque cuando Next
renderiza ese boundary no hay request locale que resolver. `useTranslations` lee el
`NextIntlClientProvider` del layout, que sí lo tiene.

Midiendo eso apareció un detalle que conviene tener anotado, porque es contraintuitivo:

| Tipo de 404 | Qué boundary lo atiende | Status | Cuerpo en el HTML |
|---|---|---|---|
| Ruta que no matchea (`/es/nada`) | `app/not-found.tsx` (**raíz**) | 404 ✓ | sí ✓ |
| Catálogo fuera de `generateStaticParams` | `app/not-found.tsx` (**raíz**) | 404 ✓ | sí ✓ |
| `notFound()` explícito (`/blog/[slug]`) | `app/[locale]/not-found.tsx` | 404 ✓ | **no** |

Los 404 que resuelve el router se rechazan antes de entrar al segmento `[locale]`, así que caen en el
`not-found.tsx` **raíz** — no en el de `[locale]`, que es el que se tradujo. Y ese raíz era una página
pelada, sin estilos, con un `<h1>` suelto. Se reescribió: autosuficiente (su propio `<html>`, sin next-intl
ni Header/Footer, que son cliente y dependen del provider de `[locale]`), con los estilos del sitio y links
de salida a los cuatro idiomas. Es el 404 que de hecho ve casi todo el mundo.

**Limitación conocida que queda abierta:** `/blog/[slug]` con un slug inexistente devuelve el status 404
correcto, pero su cuerpo viaja solo en el payload RSC y el HTML sale vacío. Para un rastreador da igual —
lo que importa es el 404—, pero una persona que llegue desde un link de blog roto ve una página en blanco.
Se probó quitando el `not-found.tsx` de `[locale]` para que cayera al raíz y no cambia: es inherente al
`notFound()` explícito dentro de `[locale]`. Con el blog en 0 artículos no hay links rotos que lleven ahí;
vale revisarlo cuando haya contenido.

### Verificación

```
52/52 rutas válidas en 200   (13 rutas × 4 idiomas)
9/9   pages con título y descripción propios en pt
404 ✓ /es|/pt/nada · /es|/pt/productos/lineas/no-existe · /es/productos/no-existe · /es|/en|/de|/pt/blog/no-existe
robots.txt incluye /pt/carrito
canonical y hreflang correctos en /pt (x-default sigue apuntando a es)
links <a> a los 4 idiomas presentes en el HTML servido, también en fichas de producto
```

### Lo que falta para que `pt` esté completo del lado de contenido

Nada de esto es código:

- **Traducir los artículos del blog** cuando existan (los campos ya están en el CMS).
- **`x-default` apunta a `/es`**, que es lo correcto hoy. Si Brasil pasa a ser un mercado prioritario,
  revisar si conviene.
- **El PDF del catálogo y `llms.txt` siguen solo en un idioma** (P3-5).
- **La dirección de CABA con link a Google Maps sigue siendo solo para `es`** (`Footer`/`TopBar`, vía
  `hasOffice = locale === 'es'`). Se dejó tal cual porque es una decisión comercial, no un bug: si hay
  operación en Brasil con dirección propia, ahí hay que tocarlo.
