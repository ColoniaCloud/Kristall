# Kristall Film — Architecture

## Rol del agente
Sos el desarrollador principal de Kristall Film. Este documento es tu fuente de verdad. Antes de escribir cualquier código, leé la sección relevante. No improvises decisiones de arquitectura — si algo no está acá, preguntá antes de asumir.

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
kristall-film/
├── payload.config.ts
├── app/
│   ├── [locale]/                  # Routing por idioma
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Home
│   │   ├── productos/
│   │   │   ├── page.tsx           # Catálogo
│   │   │   └── [slug]/page.tsx    # Detalle
│   │   ├── servicios/page.tsx
│   │   ├── nosotros/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── carrito/page.tsx
│   │   └── contacto/page.tsx
│   ├── (payload)/
│   │   └── admin/[[...segments]]/page.tsx
│   └── api/
│       ├── [...payload]/route.ts
│       ├── leads/route.ts
│       └── crm-sync/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── BrandStory.tsx
│   │   ├── ProductsGrid.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── StatsRow.tsx
│   │   ├── BlogPreview.tsx
│   │   └── ContactCTA.tsx
│   ├── product/
│   │   ├── ProductCard.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── ProductFilter.tsx
│   │   └── AddToCart.tsx
│   ├── cart/
│   │   ├── CartDrawer.tsx
│   │   ├── CartItem.tsx
│   │   └── QuoteForm.tsx
│   └── common/
│       ├── GermanFlag.tsx
│       ├── LocaleSwitcher.tsx
│       └── SchemaMarkup.tsx
├── payload/
│   └── collections/
│       ├── Products.ts
│       ├── Articles.ts
│       ├── Leads.ts
│       ├── Orders.ts
│       ├── Dealers.ts
│       └── Users.ts
├── i18n/
│   ├── routing.ts
│   └── messages/
│       ├── es.json
│       ├── en.json
│       └── de.json
├── lib/
│   ├── crm.ts
│   ├── cloudinary.ts
│   ├── resend.ts
│   └── utils.ts
├── types/
│   ├── product.ts
│   ├── cart.ts
│   └── payload-types.ts
└── docs/
    ├── architecture.md            # Este archivo
    └── cms-schema.md
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
/                    → redirect → /es
/es                  → Home (español, default)
/en                  → Home (inglés)
/de                  → Home (alemán)
/es/productos        → Catálogo
/es/productos/[slug] → Detalle de producto
/es/servicios        → Servicios
/es/nosotros         → Nosotros
/es/blog             → Blog
/es/blog/[slug]      → Artículo
/es/carrito          → Carrito + cotización
/es/contacto         → Contacto
/admin               → Payload CMS admin (sin locale)
```

### Middleware

```ts
// middleware.ts — en la raíz del proyecto
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)']
}
```

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

```json
{
  "nav": {
    "products": "",
    "services": "",
    "about": "",
    "blog": "",
    "contact": "",
    "quote": ""
  },
  "hero": {
    "eyebrow": "",
    "headline": "",
    "subheadline": "",
    "cta_primary": "",
    "cta_secondary": ""
  },
  "products": {
    "title": "",
    "filter_all": "",
    "filter_vehicular": "",
    "filter_architecture": "",
    "filter_ppf": "",
    "add_to_cart": "",
    "view_detail": ""
  },
  "cart": {
    "title": "",
    "empty": "",
    "request_quote": "",
    "form_name": "",
    "form_company": "",
    "form_email": "",
    "form_phone": "",
    "form_message": "",
    "submit": "",
    "success": ""
  },
  "contact": {
    "title": "",
    "subtitle": "",
    "submit": "",
    "success": ""
  }
}
```

---

## Variables de entorno

```env
# App
NEXT_PUBLIC_SITE_URL=

# Payload CMS
PAYLOAD_SECRET=
DATABASE_URI=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=
EMAIL_FROM=noreply@kristallfilm.com
EMAIL_LEADS_TO=ventas@kristallfilm.com

# CRM Dr Polarizados
CRM_API_URL=
CRM_API_KEY=
```

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