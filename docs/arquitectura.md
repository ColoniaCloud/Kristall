# Kristall Film — Architecture

## Rol del agente
Sos el desarrollador principal de Kristall Film. Este documento es tu fuente de verdad para el sitio de marca (home, catálogo, blog, contacto). Antes de escribir cualquier código, leé la sección relevante. No improvises decisiones de arquitectura — si algo no está acá, preguntá antes de asumir.

Este documento **no cubre** el Panel de Cliente (`/cliente/*`) ni las Garantías públicas (`/garantia/*`) — son superficies aparte que le piden datos en vivo al CRM externo (`crm-polarizados`). Su contrato está en `CLIENT_PORTAL_API.md` y `WARRANTY_API.md`, en la raíz de este repo. El `CLAUDE.md` en la raíz del monorepo (`POLARIZADOS/CLAUDE.md`, un nivel arriba de `kristall-web/`) explica cómo se relacionan los dos proyectos.

---

## Stack

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js | 15 (App Router) |
| Lenguaje | TypeScript | 5.x estricto |
| Estilos | Tailwind CSS + CSS variables | 4.x |
| Componentes | shadcn/ui | latest |
| CMS / Admin | Payload CMS | 3.x |
| Base de datos | PostgreSQL via Neon | serverless |
| Auth | Payload Auth nativo | built-in |
| Storage | Cloudinary + next-cloudinary | latest |
| i18n | next-intl | 3.x |
| Email | Resend | latest |
| Forms | react-hook-form + zod | latest |
| Deploy | Vercel | — |

---

## Estructura de carpetas

```
kristall-web/
├── payload.config.ts
├── middleware.ts                  # HTTPS + redirects de slugs viejos + next-intl
├── data/
│   └── catalogo.json              # Generado por scripts/sync-catalogo.mjs — no editar a mano
├── scripts/
│   └── sync-catalogo.mjs          # Google Sheets → data/catalogo.json (corre en `prebuild`)
├── app/
│   ├── [locale]/                  # Routing por idioma (es/en/de)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home
│   │   ├── productos/
│   │   │   ├── page.tsx           # Catálogo completo con filtros
│   │   │   ├── [nicho]/page.tsx   # /productos/autos · /productos/arquitectura
│   │   │   └── lineas/[linea]/
│   │   │       ├── page.tsx             # Detalle de línea (ej. /productos/lineas/kaiser)
│   │   │       └── [producto]/page.tsx  # Ficha de producto (ej. .../kaiser/kai70) — página real, no modal
│   │   ├── servicios/page.tsx
│   │   ├── nosotros/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── carrito/                # Cotización — sin checkout, ver sección "Catálogo y carrito"
│   │   │   ├── page.tsx
│   │   │   └── CarritoClient.tsx
│   │   ├── concesionarias/, propuesta-aberturas/, punto-kristall/
│   │   └── contacto/page.tsx
│   ├── (client-portal)/cliente/**  # Fuera de alcance de este doc — ver CLIENT_PORTAL_API.md
│   ├── (warranty)/garantia/**      # Fuera de alcance de este doc — ver WARRANTY_API.md
│   ├── (payload)/
│   │   └── admin/[[...segments]]/page.tsx
│   ├── sitemap.ts · robots.ts
│   └── api/
│       ├── [...slug]/route.ts     # REST de Payload (lo usa el admin)
│       ├── leads/route.ts         # Contacto + consulta de producto + cotización de carrito
│       ├── portal/**              # Puente al CRM — ver CLIENT_PORTAL_API.md
│       └── garantia/**            # Puente al CRM — ver WARRANTY_API.md
├── components/
│   ├── layout/
│   │   ├── Header.tsx             # Incluye el ícono + contador del carrito
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx, BrandStory.tsx, ProductsGrid.tsx, ServicesSection.tsx, StatsRow.tsx, ContactCTA.tsx
│   ├── product/
│   │   ├── ProductCard.tsx        # Tile del grid — recibe un Producto, linkea a su página de ficha
│   │   ├── ProductDetail.tsx      # Ficha técnica + AddToCartControl + consulta rápida (contenido de la página de producto, no un modal)
│   │   ├── ProductsClient.tsx     # Filtros de /productos (línea, VLT, UV)
│   │   └── CategoryCard.tsx       # Tile de línea (home y /productos/[nicho])
│   ├── cart/
│   │   ├── AddToCartControl.tsx   # Selector de cantidad (rollos) + agregar
│   │   ├── CartDrawer.tsx, CartItem.tsx, QuoteModal.tsx
│   └── common/
├── payload/
│   └── collections/
│       ├── Products.ts    # SIN USO por el sitio público desde este refactor — ver nota abajo
│       ├── Articles.ts, Leads.ts, Orders.ts, Dealers.ts, Media.ts, Users.ts
├── i18n/
│   ├── routing.ts
│   └── messages/{es,en,de}.json
├── lib/
│   ├── catalogo.ts     # Lee data/catalogo.json — única fuente del catálogo para la UI
│   ├── cart.ts          # Store zustand del carrito de cotización (persist en localStorage)
│   ├── crm/api.ts       # Único punto de fetch al CRM externo (Panel Cliente + Garantías)
│   ├── resend.ts, rate-limit.ts, seo.ts, blog.ts, session.ts, utils.ts
├── types/
│   └── payload-types.ts # Generado por Payload — no editar a mano
└── docs/
    └── arquitectura.md  # Este archivo
```

---

## Design System

### Principio
La interfaz ES el argumento de venta. Cada decisión visual comunica precisión alemana. Sin ornamentos, sin gradientes, sin efectos dramáticos.

### Tokens CSS — globals.css

```css
:root {
  --bg: #F2F2F0;
  --surface: #FFFFFF;
  --text-primary: #0A0A0A;
  --text-secondary: #5C5C5C;
  --text-muted: #9A9A9A;
  --accent: #0A0A0A;
  --border: #E4E4E2;
  --border-strong: #C8C8C4;
  --shadow-card: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
  --shadow-hover: 0 4px 20px rgba(0,0,0,0.10);
  --de-black: #1A1A1A;
  --de-red: #CC0000;
  --de-gold: #E6A800;
  --r: 8px;
  --rl: 12px;
  --font-display: 'Clash Display', sans-serif;
  --font-body: 'DM Sans', sans-serif;
}
```

### Tipografía

| Uso | Fuente | Tamaño | Weight |
|-----|--------|--------|--------|
| Hero / Display | Clash Display | clamp(2.5rem, 5vw, 4.5rem) | 600 |
| Section headings | Clash Display | clamp(1.8rem, 3vw, 2.8rem) | 500 |
| Subheadings | DM Sans | 1.125rem | 500 |
| Body | DM Sans | 1rem | 400 |
| Labels / caps | DM Sans | 0.6875rem | 500 — uppercase tracking-widest |
| Small | DM Sans | 0.875rem | 400 |

### Componentes base

```tsx
// Card bento
className="bg-white border border-[#E4E4E2] border-[0.5px] rounded-xl
           shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]
           transition-shadow duration-300"

// Botón primario
className="bg-[#0A0A0A] text-white px-6 py-3 rounded-lg text-sm
           font-medium tracking-wide hover:opacity-85 transition-opacity"

// Botón outline
className="border border-[#C8C8C4] border-[0.5px] text-[#0A0A0A] px-6 py-3
           rounded-lg text-sm font-medium hover:bg-[#0A0A0A] hover:text-white
           hover:border-[#0A0A0A] transition-all duration-200"

// Bento grid
className="grid grid-cols-12 gap-2 p-2"   // gap = 8px

// Label caps
className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#9A9A9A]"
```

### Reglas de diseño — NUNCA violar

- Sin gradientes de color
- Sin sombras dramáticas (solo las definidas en tokens)
- Sin bordes redondeados excesivos (máximo 12px en cards)
- Sin colores saturados fuera de los acentos alemanes
- El negro `#0A0A0A` es el único color de acento principal
- Los colores alemanes (rojo, dorado) son SOLO decorativos, nunca en botones CTA
- Fondo global siempre `#F2F2F0`, nunca blanco puro

---

## Rutas y páginas

### Routing i18n

```
/                              → redirect → /es
/es · /en · /de                → Home
/es/productos                  → Catálogo completo, con filtros por línea/VLT/UV
/es/productos/autos            → Landing del nicho "autos" (líneas de esa familia)
/es/productos/arquitectura     → Landing del nicho "arquitectura"
/es/productos/lineas/[linea]   → Detalle de línea, ej. /es/productos/lineas/kaiser
/es/productos/lineas/[linea]/[producto] → Ficha de producto, ej. .../kaiser/kai70 (slug = código en minúsculas)
/es/servicios                  → Servicios (Polarized App)
/es/nosotros                   → Nosotros
/es/blog · /es/blog/[slug]     → Blog
/es/carrito                    → Carrito de cotización (noindex — ver "Catálogo y carrito")
/es/contacto                   → Contacto
/admin                         → Payload CMS admin (sin locale)
/cliente/* · /garantia/*       → Fuera de este doc, ver CLIENT_PORTAL_API.md / WARRANTY_API.md
```

`/productos/categorias/*` (la URL vieja de línea, indexada antes de este refactor) ya no existe como
página: `middleware.ts` la redirige 301 a `/productos/lineas/*`, salvo `vitral` — esa línea se retiró
del catálogo y redirige a `/productos/arquitectura`.

### Middleware

`middleware.ts` resuelve, en este orden: forzado de HTTPS en producción → redirect del slug viejo de
`propuesta-aberturas` → redirect de `/productos/categorias/*` → si la ruta es `/cliente/*` o
`/garantia/*`, se saltea `next-intl` (son superficies de un solo idioma) → para todo lo demás, corre
`next-intl` normal. El código completo y actualizado está en `middleware.ts`, en la raíz del repo —
no lo dupliques acá, léelo directamente para no trabajar con una copia desactualizada.

---

## Catálogo y carrito de cotización

### El catálogo no vive en Payload

La colección `products` de Payload existe en el schema pero **el sitio público no la lee** — ningún
componente ni ruta hace `collection: 'products'`. Sigue teniendo **27 filas** de una carga vieja
(modelo pre-refactor: SKU, tier, variantes con precio) que nadie borró. Decisión tomada: se deja
como está, dormida — no vale el riesgo de tocarla. Payload corre con `push: true`, así que sacarla
del `payload.config.ts` sin respaldo antes se llevaría la tabla puesta; si en algún momento hace
falta liberar ese espacio, exportar primero.

El catálogo real sale de una planilla de Google Sheets que gestiona el equipo comercial (columnas:
Categoría, Subcategoría, Línea, Código Kristall, Código China, VLT, UVR, IR, Garantía, Thickness,
Stock).

```
Google Sheets (fuente de verdad)
  → scripts/sync-catalogo.mjs   (fetch CSV, valida, escribe)
  → data/catalogo.json           (commiteado — no editar a mano)
  → lib/catalogo.ts              (tipos + helpers que usa toda la UI)
```

El script corre solo antes de cada build (`prebuild` en `package.json`), así que cada deploy sale con
el catálogo del momento. También se puede correr a mano: `pnpm catalogo:sync` (reescribe el JSON) o
`pnpm catalogo:check` (valida sin escribir, pensado para CI). Si la descarga falla pero ya hay un JSON
commiteado, el build sigue con ese y solo avisa; si los datos SÍ se descargan pero no validan (código
duplicado, línea sin categoría, número no parseable), el build se corta — un dato roto nunca llega a
producción.

**Modelo:** cada fila de la planilla es un `Producto` (código, línea, nicho, categoría, VLT/UVR/IR,
garantía, espesor). `lib/catalogo.ts` los agrupa en `Linea` (todos los productos que comparten
"Línea") preservando el orden de la planilla. Dos cosas son editoriales, no vienen de la planilla, y
viven en `lib/catalogo.ts`:

- `DESC_KEY_BY_SLUG` — a qué clave de i18n (`products.cat_*_desc`) apunta la descripción de cada línea.
- `ASSET_SLUG_OVERRIDES` — 4 líneas de nombre compuesto (`keram-x`, `kreflect-silver`, `kwhite-matte`,
  `kdecor-stripe`) cuyo archivo de imagen quedó con un nombre más corto que el slug.

Si aparece una línea nueva en la planilla sin su `descKey`, `lib/catalogo.ts` tira un error explícito
al importarse — no se puede compilar con una línea muda.

**Imágenes:** `lineaLogoSrc(slug)` y `lineaDestacadaSrc(slug)` arman la ruta desde el slug (o su
override). Los logos van en `public/Productos/logo-linea/{slug}.svg` (wordmark en negro sólido —
la UI le aplica `brightness-0 invert` para mostrarlo en blanco sobre foto), las fotos destacadas en
`public/Productos/destacadas/{slug}.png`. Si el archivo no existe todavía, `next/image` cae a un 404
silencioso — no rompe el build, pero conviene revisar visualmente después de subir assets nuevos.

### Carrito de cotización — no es un e-commerce

No hay checkout ni precios. `lib/cart.ts` es un store de zustand con `persist` en `localStorage`
(`skipHydration: true` + un `rehydrate()` manual en `Header.tsx`, para que el primer render en
cliente coincida con el del servidor y no dispare un warning de hidratación). El flujo: el usuario
suma productos con cantidad (en rollos) desde la página de producto (`ProductDetail.tsx` →
`AddToCartControl.tsx`), ve el
resumen en el drawer del header (`CartDrawer.tsx`) o en `/carrito`, y al pedir la cotización
(`QuoteModal.tsx`) se manda un `POST /api/leads` con `source: 'cotizacion'` y el detalle de productos
en `cartItems`. Ese payload queda guardado en Payload (`Leads.cartItems`, con `codigo`) y se manda por
mail vía Resend — `/api/leads` tiene rate limit (8 cada 10 min por IP).

---

## i18n

```ts
// i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en', 'de'],
  defaultLocale: 'es'
})
```

### Estructura de mensajes

Los namespaces reales viven en `i18n/messages/{es,en,de}.json` (deben tener exactamente las mismas
claves en los tres archivos — no hay fallback automático). Los relevantes para catálogo y carrito:

```json
{
  "products": {
    "nicho_autos": "", "nicho_autos_desc": "",
    "nicho_arquitectura": "", "nicho_arquitectura_desc": "",
    "cat_kaiser_desc": "", "cat_klass_desc": "", "...": "una _desc por línea, ver lib/catalogo.ts"
  },
  "product_modal": {
    "categoria_standard": "", "categoria_premium": "",
    "technology_label": "", "warranty_label": "", "warranty_years": "{n} años",
    "spec_thickness": "", "thickness_hint_ply": "", "thickness_hint_mil": "",
    "code_label": ""
  },
  "cart": {
    "title": "", "add_to_cart": "", "added": "", "quantity_rollos": "",
    "empty_title": "", "request_quote": "",
    "quote_title": "", "quote_submit": "", "quote_success": ""
  }
}
```

No inventes una clave nueva sin agregarla a los tres archivos: usarla sin definirla revienta con
`MISSING_MESSAGE` al generar esa página — pasó durante este mismo refactor (`products.nicho_autos_desc`
quedó en el namespace equivocado) y solo se vio corriendo `pnpm build` completo, no con `tsc`.

---

## Variables de entorno

La lista completa y actualizada vive en `.env.example`, en la raíz del repo — no la dupliques acá.
Grupos, a alto nivel: sitio público (`NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_GA_ID`), Payload
(`PAYLOAD_SECRET`, `DATABASE_URI`), Cloudinary, Resend, y el puente al CRM externo
(`CRM_BASE_URL`, `CRM_WARRANTY_API_KEY`, `CRM_CLIENT_PORTAL_API_KEY`, `SESSION_SECRET`, `CRM_MOCK`) —
este último grupo se explica en `CLIENT_PORTAL_API.md` y `WARRANTY_API.md`. El catálogo (esta sección)
no usa ninguna env var propia: `scripts/sync-catalogo.mjs` apunta a una planilla pública fija, salvo
que se pise con `CATALOGO_SHEET_ID`.

---

## Convenciones de código

```
Archivos de componentes  → PascalCase.tsx
Hooks                    → useCamelCase.ts
Utilidades               → camelCase.ts
Tipos / interfaces       → PascalCase en types/
Constantes               → UPPER_SNAKE_CASE

Imports siempre absolutos con alias @/:
  import { ProductCard } from '@/components/product/ProductCard'
  import { cn } from '@/lib/utils'

Función cn() para clases condicionales:
  import { clsx } from 'clsx'
  import { twMerge } from 'tailwind-merge'
  export function cn(...inputs) { return twMerge(clsx(inputs)) }

Estructura de componente:
  1. Types / interfaces
  2. Componente default export
  3. Hooks
  4. Derived state / memos
  5. Handlers
  6. Return JSX

Server Components por defecto.
'use client' solo cuando sea estrictamente necesario
(interactividad, hooks de estado, eventos del browser).
```

---

## Performance

- Imágenes: siempre `next/image` con Cloudinary loader
- Fonts: `next/font` — nunca `<link>` en HTML
- Páginas de marca (nosotros, servicios): `export const dynamic = 'force-static'`
- Productos y blog: `export const revalidate = 3600`
- Evitar 'use client' en layouts y páginas padre

---

## SEO

Cada página exporta `generateMetadata()`:

```ts
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    title: `${pageTitle} | Kristall Film`,
    description: pageDescription,
    openGraph: {
      title: `${pageTitle} | Kristall Film`,
      description: pageDescription,
      images: [ogImage],
      locale: params.locale,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${params.locale}/${slug}`,
      languages: {
        'es': `/es/${slug}`,
        'en': `/en/${slug}`,
        'de': `/de/${slug}`,
      }
    }
  }
}
```