# Kristall Film — Design System

## Filosofía: Design-Driven Growth

**La interfaz ES el argumento de venta.**

Kristall Film vende tecnología alemana de precisión. Cada decisión visual debe comunicar eso: orden, exactitud, calidad sin ostentación. El diseño no decora el producto — lo representa.

### Principios rectores

1. **Sobriedad técnica** — Layouts limpios, sin ruido visual. Cada elemento tiene una razón.
2. **Tipografía como jerarquía** — Los headings venden, el body informa, los labels organizan.
3. **El negro como acento principal** — `#0A0A0A` es el único color de acción. Los colores alemanes son decorativos.
4. **Bento como sistema** — Grids de 12 columnas con gap de 8px. Las cards no flotan: pertenecen al grid.
5. **Hover como confirmación** — Las interacciones son sutiles. Sombra leve, no transformaciones dramáticas.

---

## Paleta de colores

### Tokens CSS (definidos en `app/globals.css`)

```css
:root {
  /* Fondos y superficies */
  --bg:              #F2F2F0;   /* Fondo global — nunca blanco puro */
  --surface:         #FFFFFF;   /* Cards, paneles, modales */

  /* Tipografía */
  --text-primary:    #0A0A0A;   /* Texto principal */
  --text-secondary:  #5C5C5C;   /* Texto secundario, descripciones */
  --text-muted:      #9A9A9A;   /* Labels, metadata, placeholders */

  /* Acento y bordes */
  --accent:          #0A0A0A;   /* Botón primario, links activos */
  --border:          #E4E4E2;   /* Bordes default */
  --border-strong:   #C8C8C4;   /* Hover en bordes */

  /* Sombras */
  --shadow-card:     0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
  --shadow-hover:    0 4px 20px rgba(0,0,0,0.10);

  /* Colores alemanes — SOLO decorativos */
  --de-black:        #1A1A1A;   /* Franja negra bandera */
  --de-red:          #CC0000;   /* Franja roja bandera */
  --de-gold:         #E6A800;   /* Franja dorada bandera */

  /* Radii */
  --r:               8px;       /* Botones, inputs, chips */
  --rl:              12px;      /* Cards, panels */
}
```

### Uso de colores

#### Fondos y Surfaces
| Token | Hex | Uso |
|-------|-----|-----|
| `--bg` | `#F2F2F0` | Fondo de página, siempre |
| `--surface` | `#FFFFFF` | Cards, forms, dropdowns |

#### Tipografía
| Token | Hex | Uso |
|-------|-----|-----|
| `--text-primary` | `#0A0A0A` | Headings, body principal |
| `--text-secondary` | `#5C5C5C` | Descripciones, subtítulos |
| `--text-muted` | `#9A9A9A` | Labels caps, metadata, placeholders |

#### Interacción y Bordes
| Token | Hex | Uso |
|-------|-----|-----|
| `--accent` | `#0A0A0A` | Botón primario, link activo, focus |
| `--border` | `#E4E4E2` | Bordes de cards, inputs default |
| `--border-strong` | `#C8C8C4` | Hover en bordes |

#### Colores alemanes (Decorativos)
| Token | Hex | Uso |
|-------|-----|-----|
| `--de-black` | `#1A1A1A` | Franja bandera, fondo Footer/Header |
| `--de-red` | `#CC0000` | Franja bandera, indicadores de error |
| `--de-gold` | `#E6A800` | Franja bandera, highlights opcionales |

### Reglas estrictas de color

- **NUNCA** usar `--de-red` o `--de-gold` en botones CTA
- **NUNCA** fondo blanco puro (`#FFFFFF`) como fondo de página — siempre `--bg`
- **NUNCA** colores saturados fuera de los tres alemanes
- El negro `#0A0A0A` es el único color de acción principal

---

## Tipografía

### Familias

| Variable | Fuente | Carga | Uso |
|----------|--------|-------|-----|
| `--font-display` | Clash Display | Local `/public/fonts/ClashDisplay-Variable.woff2` | Headings, Hero, Display |
| `--font-body` | DM Sans | Google Fonts via `next/font/google` | Body, UI, labels |

### Escala tipográfica

| Rol | Fuente | Tamaño (clamp) | Weight | Clase Tailwind |
|-----|--------|----------------|--------|----------------|
| Hero / Display | Clash Display | `clamp(2.5rem, 5vw, 4.5rem)` | 600 | `font-display text-5xl font-semibold` |
| Section heading | Clash Display | `clamp(1.8rem, 3vw, 2.8rem)` | 500 | `font-display text-4xl font-medium` |
| Subheading | DM Sans | `1.125rem / 18px` | 500 | `text-lg font-medium` |
| Body | DM Sans | `1rem / 16px` | 400 | `text-base` |
| Body sm | DM Sans | `0.875rem / 14px` | 400 | `text-sm` |
| Label caps | DM Sans | `0.6875rem / 11px` | 500 | `text-[11px] font-medium uppercase tracking-[0.1em]` |
| Badge / chip | DM Sans | `0.75rem / 12px` | 500 | `text-xs font-medium` |

### Clases de uso frecuente

```tsx
// Hero
<h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight">

// Section heading
<h2 className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-medium leading-snug tracking-tight">

// Label caps (eyebrow)
<p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[--text-muted]">

// Body principal
<p className="text-base text-[--text-secondary] leading-relaxed">
```

---

## Espaciado

### Base unit: 8px

| Token Tailwind | Valor | Uso típico |
|---------------|-------|-----------|
| `gap-2` | 8px | Gap bento grid |
| `gap-4` | 16px | Espacio entre elementos en card |
| `gap-6` | 24px | Padding interno cards pequeñas |
| `gap-8` | 32px | Padding interno cards normales |
| `p-8` | 32px | Padding cards hero |
| `p-10` | 40px | Padding cards featured |
| `px-6 py-4` | 24px/16px | Padding secciones móvil |
| `px-8 py-20` | 32px/80px | Padding secciones desktop |
| `max-w-screen-xl mx-auto px-6` | — | Container global (1280px) |

### Padding por contexto

```tsx
// Sección full-width
className="py-20 px-6 lg:px-8"

// Container interno
className="max-w-screen-xl mx-auto"

// Card bento standard
className="p-6 lg:p-8"

// Card bento featured/hero
className="p-8 lg:p-10"

// Navbar
className="h-16 px-6 lg:px-8"
```

---

## Border Radius

| Contexto | Token CSS | Valor | Clase Tailwind |
|----------|-----------|-------|----------------|
| Botones, inputs, chips | `--r` | `8px` | `rounded-[var(--r)]` o `rounded-lg` |
| Cards, panels | `--rl` | `12px` | `rounded-[var(--rl)]` o `rounded-xl` |
| Badges grandes | — | `999px` | `rounded-full` |

**Regla:** máximo 12px en cards. Sin bordes ultra redondeados que comuniquen "juego" o "casual".

---

## Sombras

```css
/* Default — siempre presente en cards */
--shadow-card:   0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);

/* Hover — aplicar con transition-shadow duration-300 */
--shadow-hover:  0 4px 20px rgba(0,0,0,0.10);
```

Clases Tailwind:
```tsx
// Card default
className="shadow-[var(--shadow-card)]"

// Card hover (combinado)
className="shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-shadow duration-300"
```

**Regla:** No usar `shadow-xl`, `shadow-2xl` ni sombras con color. Solo las dos definidas en tokens.

---

## Patrón Bento Grid

### Sistema de 12 columnas, gap 8px

```tsx
// Grid base
className="grid grid-cols-12 gap-2"

// Ejemplos de combinaciones comunes:

// Dos columnas iguales
className="grid grid-cols-2 gap-2"        // col-span-6 cada una

// 1/3 + 2/3
className="col-span-4"   // sidebar / filtro
className="col-span-8"   // contenido principal

// Full width
className="col-span-12"

// Hero asimétrico (60/40)
className="grid grid-cols-5 gap-2"
// col-span-3 (hero text) + col-span-2 (hero visual)

// Stats row (4 iguales)
className="grid grid-cols-4 gap-2"

// Products grid (3 columnas)
className="grid grid-cols-3 gap-2"

// Blog (featured 2/3 + sidebar 1/3)
className="grid grid-cols-3 gap-2"
// col-span-2 featured + col-span-1 sidebar
```

### Anatomía de una card bento

```tsx
<div className={cn(
  "bg-white border border-[--border] rounded-[var(--rl)]",
  "shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]",
  "transition-shadow duration-300 p-6 lg:p-8"
)}>
  {/* contenido */}
</div>
```

---

## Componentes Base

### Botón primario

```tsx
// Clase directa
className="bg-[--accent] text-white px-6 py-3 rounded-[var(--r)]
           text-sm font-medium tracking-wide
           hover:opacity-85 transition-opacity duration-200"

// Con shadcn Button
<Button variant="default" size="default">Explorar catálogo</Button>
```

### Botón outline

```tsx
className="border border-[--border-strong] text-[--text-primary] px-6 py-3
           rounded-[var(--r)] text-sm font-medium
           hover:bg-[--accent] hover:text-white hover:border-[--accent]
           transition-all duration-200"
```

### Card bento

```tsx
className="bg-white border border-[--border] rounded-[var(--rl)]
           shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)]
           transition-shadow duration-300"
```

### Badge / etiqueta de categoría

```tsx
// Variante neutra
className="inline-flex items-center gap-1.5 px-2.5 py-1
           rounded-full border border-[--border]
           text-xs font-medium text-[--text-secondary]"

// Variante de acento (vehicular)
className="inline-flex items-center gap-1.5 px-2.5 py-1
           rounded-full bg-[--de-gold]/10 border border-[--de-gold]/20
           text-xs font-medium text-[#9A6200]"
```

### Input / Field

```tsx
className="w-full px-3 py-2 rounded-[var(--r)]
           border border-[--border] bg-white
           text-sm text-[--text-primary]
           placeholder:text-[--text-muted]
           focus:outline-none focus:border-[--accent]
           transition-colors duration-200"
```

### Label caps (eyebrow)

```tsx
<p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[--text-muted]">
  Categorías de producto
</p>
```

### Navbar link activo vs inactivo

```tsx
// Activo
className="text-sm font-medium text-[--text-primary] border-b border-[--accent] pb-0.5"

// Inactivo
className="text-sm font-medium text-[--text-secondary]
           hover:text-[--text-primary] transition-colors duration-200"
```

### German Flag Strip (componente)

```tsx
// Tira horizontal decorativa (en Header, Footer)
<div className="h-1 w-full flex">
  <div className="flex-1 bg-[--de-black]" />
  <div className="flex-1 bg-[--de-red]" />
  <div className="flex-1 bg-[--de-gold]" />
</div>

// Componente GermanFlag (pequeño, inline)
<div className="flex h-4 w-7 overflow-hidden rounded-sm">
  <div className="flex-1 bg-[--de-black]" />
  <div className="flex-1 bg-[--de-red]" />
  <div className="flex-1 bg-[--de-gold]" />
</div>
```

---

## Colores alemanes — Reglas de uso

Los tres colores de la bandera alemana son **exclusivamente decorativos**:

| Color | Hex | Permitido | Prohibido |
|-------|-----|-----------|-----------|
| `--de-black` | `#1A1A1A` | Flag strip, fondos oscuros (Header logo box, Footer) | Reemplazar al `--accent` como CTA |
| `--de-red` | `#CC0000` | Flag strip, estados de error/danger, indicadores | Botones CTA, backgrounds de sección |
| `--de-gold` | `#E6A800` | Flag strip, badges de categoría (sutil), highlights de specs | Botones CTA, texto principal |

**La bandera aparece siempre como tira de 3 franjas horizontales.** Nunca se usan los colores alemanes como fondos de sección completos.

---

## Reglas que NUNCA se violan

1. **Sin gradientes de color** — Cero. Ni siquiera en heroes o banners.
2. **Sin sombras dramáticas** — Solo `--shadow-card` y `--shadow-hover`.
3. **Sin border-radius excesivo** — Máximo 12px en cards. Los cards no son "píldoras".
4. **Sin colores saturados** fuera de los tres alemanes y solo en uso decorativo.
5. **Fondo global siempre `#F2F2F0`** — Nunca blanco puro, nunca gris oscuro.
6. **`--de-red` y `--de-gold` nunca en CTAs** — Solo en la franja decorativa y badges.
7. **`font-display` solo en headings** — No en body text, labels ni UI pequeño.
8. **Gap del bento grid siempre 8px (`gap-2`)** — Excepciones requieren justificación.
9. **`use client` solo cuando sea estrictamente necesario** — Estado, eventos browser, hooks.
10. **Server Components por defecto** — Layout, pages estáticas, secciones de contenido.

---

## Estructura de páginas

### Home (`/[locale]`)

```
┌─────────────────────────────────────┐
│ HEADER (sticky, h-16)               │
│ [logo caja negra] [nav] [Cotizar]   │
│ [flag strip negro/rojo/dorado]      │
├─────────────────────────────────────┤
│ HERO (grid 12 cols, gap-2)          │
│ [col-7: headline + CTA]             │
│ [col-5: visual técnico / imagen]    │
├─────────────────────────────────────┤
│ STATS ROW (4 cols iguales, gap-2)   │
│ [96% IR] [99% UV] [TSER] [10 años]  │
├─────────────────────────────────────┤
│ BRAND STORY (2 cols asim.)          │
│ [col-5: texto + badge Alemania]     │
│ [col-7: imagen producto / técnica]  │
├─────────────────────────────────────┤
│ PRODUCTS GRID (label + 3 cards)     │
│ [VEHICULAR] [ARQUITECTURA] [PPF]    │
├─────────────────────────────────────┤
│ SERVICES SECTION (bento 2x2)        │
│ [Vehicular] [Arquitectónica]        │
│ [PPF]       [Distribuidores]        │
├─────────────────────────────────────┤
│ BLOG PREVIEW (1 featured + 2 sm)    │
├─────────────────────────────────────┤
│ CONTACT CTA (full-width, surface)   │
│ [headline] [form rápido o botón]    │
├─────────────────────────────────────┤
│ FOOTER (fondo #1A1A1A, 4 cols)    │
│ [logo+desc] [Links×3] [locale]      │
│ [flag strip] [copyright]            │
└─────────────────────────────────────┘
```

### Catálogo (`/[locale]/productos`)

```
┌─────────────────────────────────────┐
│ PAGE HEADER (label + h1 + count)    │
├─────────────────────────────────────┤
│ LAYOUT (grid: sidebar 3 + grid 9)   │
│ ┌ FILTERS (sticky) ─────────────┐   │
│ │ Categoría / Serie / VLT       │   │
│ └───────────────────────────────┘   │
│ ┌ PRODUCT GRID (3 cols, gap-2) ─┐   │
│ │ [card][card][card]            │   │
│ │ [card][card][card]            │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Detalle de producto (`/[locale]/productos/[slug]`)

```
┌─────────────────────────────────────┐
│ BREADCRUMB                          │
├─────────────────────────────────────┤
│ GRID (col-7 galería + col-5 info)   │
│ [imagen principal]  [nombre]        │
│ [thumbnails 4]      [specs table]   │
│                     [CTA Cotizar]   │
├─────────────────────────────────────┤
│ TABS: Descripción / Aplicaciones    │
└─────────────────────────────────────┘
```

---

## Componentes de Layout

### Header

- Altura: `h-16` (64px), sticky
- Fondo: `bg-white/90 backdrop-blur-sm border-b border-[--border]`
- Logo: "KRISTALL" en caja negra (`bg-[--de-black] text-white px-3 py-1`) + "FILM" en texto normal
- Flag strip: tira horizontal de 3px debajo del header (`h-[3px]` con las 3 franjas)
- Nav: links `text-sm font-medium`, activo con underline negro
- Selector locale: `ES · EN · DE`
- CTA: botón "Cotizar" primario pequeño

### Footer

- Fondo: `bg-[--de-black]` (`#1A1A1A`)
- Texto: `text-white`, muted `text-white/50`
- 4 columnas: logo+descripción | Links Productos | Links Recursos | Links Empresa
- Flag strip en la parte superior del footer
- Copyright row con selector de locale

---

## Referencia visual

El diseño fue prototipado en **Claude Design** (claude.ai/design) bajo el proyecto "Kristall Film Design System". Los archivos HTML de referencia están en `/project/Kristall Film Website.html` del bundle exportado.

Tokens originales del prototipo: `/project/colors_and_type.css`

El sistema de este archivo documenta los tokens adaptados al stack real (Tailwind v4 + shadcn base-nova), manteniendo fidelidad visual al prototipo.

### Fuente de verdad por orden de prioridad

1. `docs/design.md` — este archivo (sistema de diseño)
2. `docs/arquitectura.md` — stack, estructura, convenciones
3. `app/globals.css` — tokens CSS reales implementados
4. HTML prototipo (referencia visual, no código a copiar)
