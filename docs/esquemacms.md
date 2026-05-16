# Kristall Film — CMS Schema

## Rol del agente
Este documento define todas las colecciones de Payload CMS, sus campos, relaciones, roles y flujos de datos. Antes de crear o modificar cualquier colección, leé la sección completa correspondiente.

---

## Colecciones

### 1. Products

```ts
// payload/collections/Products.ts
import { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name_es',
    group: 'Catálogo',
    defaultColumns: ['name_es', 'category', 'featured', 'active'],
  },
  access: {
    read: () => true,                          // público
    create: isAdminOrContent,
    update: isAdminOrContent,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name_es',
      type: 'text',
      label: 'Nombre (ES)',
      required: true,
    },
    {
      name: 'name_en',
      type: 'text',
      label: 'Nombre (EN)',
      required: true,
    },
    {
      name: 'name_de',
      type: 'text',
      label: 'Nombre (DE)',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Polarizado vehicular',      value: 'vehicular-polarizado' },
        { label: 'Seguridad vehicular',        value: 'vehicular-seguridad' },
        { label: 'Polarizado arquitectura',    value: 'arquitectura-polarizado' },
        { label: 'Seguridad arquitectura',     value: 'arquitectura-seguridad' },
        { label: 'PPF Automotriz',             value: 'ppf' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'description_es',
      type: 'richText',
      label: 'Descripción (ES)',
    },
    {
      name: 'description_en',
      type: 'richText',
      label: 'Descripción (EN)',
    },
    {
      name: 'description_de',
      type: 'richText',
      label: 'Descripción (DE)',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Imágenes',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      label: 'Especificaciones técnicas',
      fields: [
        { name: 'key',   type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variantes',
      fields: [
        { name: 'name',  type: 'text', required: true },
        { name: 'sku',   type: 'text' },
        { name: 'price', type: 'number' },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacado en home',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activo (visible en el sitio)',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      admin: { position: 'sidebar' },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      label: 'SEO Description',
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

### 2. Articles (Blog)

```ts
export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title_es',
    group: 'Contenido',
    defaultColumns: ['title_es', 'category', 'status', 'publishedAt'],
  },
  fields: [
    { name: 'title_es', type: 'text', required: true },
    { name: 'title_en', type: 'text', required: true },
    { name: 'title_de', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Tecnología',   value: 'tecnologia' },
        { label: 'Arquitectura', value: 'arquitectura' },
        { label: 'Vehicular',    value: 'vehicular' },
        { label: 'PPF',          value: 'ppf' },
        { label: 'Empresa',      value: 'empresa' },
      ],
    },
    { name: 'excerpt_es', type: 'textarea' },
    { name: 'excerpt_en', type: 'textarea' },
    { name: 'excerpt_de', type: 'textarea' },
    { name: 'content_es', type: 'richText' },
    { name: 'content_en', type: 'richText' },
    { name: 'content_de', type: 'richText' },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    { name: 'author', type: 'text' },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Borrador',   value: 'draft' },
        { label: 'Publicado',  value: 'published' },
      ],
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

### 3. Leads

```ts
export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'Ventas',
    defaultColumns: ['name', 'company', 'source', 'status', 'createdAt'],
  },
  access: {
    read: isSalesOrAdmin,
    create: () => true,    // el form público puede crear leads
    update: isSalesOrAdmin,
    delete: isAdmin,
  },
  fields: [
    { name: 'name',    type: 'text', required: true },
    { name: 'company', type: 'text' },
    { name: 'email',   type: 'email', required: true },
    { name: 'phone',   type: 'text' },
    { name: 'message', type: 'textarea' },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Formulario de contacto', value: 'contacto' },
        { label: 'Cotización de carrito',  value: 'cotizacion' },
        { label: 'Página de servicios',    value: 'servicios' },
        { label: 'Concesionaria',          value: 'concesionaria' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'nuevo',
      options: [
        { label: 'Nuevo',       value: 'nuevo' },
        { label: 'En proceso',  value: 'en-proceso' },
        { label: 'Respondido',  value: 'respondido' },
        { label: 'Cerrado',     value: 'cerrado' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas internas (solo admin)',
      access: { read: isSalesOrAdmin },
    },
    {
      name: 'cartItems',
      type: 'array',
      label: 'Productos del carrito',
      fields: [
        { name: 'productName', type: 'text' },
        { name: 'variant',     type: 'text' },
        { name: 'quantity',    type: 'number' },
      ],
    },
    {
      name: 'syncedToCRM',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', readOnly: true },
    },
    {
      name: 'crmId',
      type: 'text',
      admin: { position: 'sidebar', readOnly: true },
    },
  ],
  hooks: {
    afterChange: [syncLeadToCRM],   // función en lib/crm.ts
  },
}
```

---

### 4. Orders (Carritos / Cotizaciones)

```ts
export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    group: 'Ventas',
    defaultColumns: ['orderNumber', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'lead',
      type: 'relationship',
      relationTo: 'leads',
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
        },
        { name: 'variant',   type: 'text' },
        { name: 'quantity',  type: 'number', required: true },
        { name: 'unitPrice', type: 'number' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente',   value: 'pendiente' },
        { label: 'Cotizado',    value: 'cotizado' },
        { label: 'Confirmado',  value: 'confirmado' },
        { label: 'Cancelado',   value: 'cancelado' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'totalEstimate', type: 'number', admin: { position: 'sidebar' } },
    { name: 'notes',         type: 'textarea' },
  ],
  hooks: {
    beforeChange: [generateOrderNumber],
  },
}
```

---

### 5. Dealers (Concesionarias)

```ts
export const Dealers: CollectionConfig = {
  slug: 'dealers',
  admin: {
    useAsTitle: 'name',
    group: 'Ventas',
    defaultColumns: ['name', 'subscriptionStatus', 'softwarePlan'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'contactName',  type: 'text' },
        { name: 'email',        type: 'email' },
        { name: 'phone',        type: 'text' },
      ],
    },
    { name: 'address', type: 'textarea' },
    {
      name: 'subscriptionStatus',
      type: 'select',
      options: [
        { label: 'Trial',    value: 'trial' },
        { label: 'Activo',   value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'softwarePlan', type: 'text', admin: { position: 'sidebar' } },
    { name: 'notes',        type: 'textarea' },
  ],
}
```

---

### 6. Users (Admin)

```ts
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Sistema',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin',       value: 'admin' },
        { label: 'Ventas',      value: 'ventas' },
        { label: 'Contenido',   value: 'contenido' },
      ],
      defaultValue: 'contenido',
      admin: { position: 'sidebar' },
    },
  ],
}
```

### 7. Media

```ts
export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    imageSizes: [
      { name: 'card',    width: 600,  height: 400, position: 'centre' },
      { name: 'hero',    width: 1200, height: 800, position: 'centre' },
      { name: 'thumb',   width: 200,  height: 200, position: 'centre' },
    ],
    adminThumbnail: 'thumb',
    mimeTypes: ['image/*'],
  },
  fields: [
    { name: 'alt', type: 'text' },
  ],
}
```

---

## Roles y control de acceso

```ts
// lib/access.ts

const isAdmin = ({ req }) =>
  ['super-admin', 'admin'].includes(req.user?.role)

const isSalesOrAdmin = ({ req }) =>
  ['super-admin', 'admin', 'ventas'].includes(req.user?.role)

const isAdminOrContent = ({ req }) =>
  ['super-admin', 'admin', 'contenido'].includes(req.user?.role)
```

| Acción | super-admin | admin | ventas | contenido |
|--------|:-----------:|:-----:|:------:|:---------:|
| Gestionar usuarios | ✓ | ✗ | ✗ | ✗ |
| CRUD Productos | ✓ | ✓ | ✗ | ✓ |
| CRUD Blog | ✓ | ✓ | ✗ | ✓ |
| Ver Leads | ✓ | ✓ | ✓ | ✗ |
| Gestionar Leads | ✓ | ✓ | ✓ | ✗ |
| Ver Pedidos | ✓ | ✓ | ✓ | ✗ |
| Gestionar Concesionarias | ✓ | ✓ | ✓ | ✗ |
| Config CRM / API keys | ✓ | ✗ | ✗ | ✗ |

---

## Flujo carrito → cotización (Fase 1, sin pasarela)

```
Usuario agrega productos al carrito (estado local / localStorage)
        ↓
Abre CartDrawer → revisa items
        ↓
Click "Solicitar cotización"
        ↓
QuoteForm: nombre, empresa, email, teléfono, mensaje
        ↓
POST /api/leads
  → Crea Lead en Payload con source: 'cotizacion' y cartItems[]
  → Crea Order relacionado al Lead
  → Envía email a ventas@kristallfilm.com (Resend)
  → Envía email de confirmación al cliente (Resend)
  → Intenta sync con CRM Dr Polarizados (no bloquea si falla)
        ↓
Respuesta: "Recibimos tu consulta. Te contactamos en 24 hs."
```

---

## Integración CRM — Dr Polarizados

```ts
// lib/crm.ts

export async function syncLeadToCRM(lead: Lead) {
  try {
    const res = await fetch(`${process.env.CRM_API_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
      },
      body: JSON.stringify({
        name:    lead.name,
        company: lead.company,
        email:   lead.email,
        phone:   lead.phone,
        message: lead.message,
        source:  'kristall-film',
        items:   lead.cartItems,
      }),
    })

    if (!res.ok) throw new Error('CRM sync failed')

    const { id } = await res.json()
    return { crmId: id, syncedToCRM: true }
  } catch (err) {
    console.error('[CRM Sync Error]', err)
    return { syncedToCRM: false }   // no bloquea el flujo principal
  }
}
```

### Endpoints requeridos del CRM (Dr Polarizados)

```
POST   /leads              → Crear lead desde Kristall
PUT    /leads/:id          → Actualizar estado
GET    /leads/:id          → Verificar estado

# Webhooks opcionales (Fase 2)
POST   /webhooks/crm/lead-update  → CRM notifica a Kristall
```

---

## payload.config.ts base

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Products } from './collections/Products'
import { Articles } from './collections/Articles'
import { Leads } from './collections/Leads'
import { Orders } from './collections/Orders'
import { Dealers } from './collections/Dealers'
import { Users } from './collections/Users'
import { Media } from './collections/Media'

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Kristall Film Admin',
    },
  },
  collections: [
    Products,
    Articles,
    Leads,
    Orders,
    Dealers,
    Users,
    Media,
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: 'types/payload-types.ts',
  },
})
```

---

## Emails transaccionales (Resend)

### Lead nuevo — email a ventas

```ts
// lib/resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLeadNotification(lead: Lead) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to:   process.env.EMAIL_LEADS_TO!,
    subject: `Nuevo lead: ${lead.name} — ${lead.company || 'Sin empresa'}`,
    html: `
      <h2>Nuevo lead recibido</h2>
      <p><strong>Nombre:</strong> ${lead.name}</p>
      <p><strong>Empresa:</strong> ${lead.company || '—'}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Teléfono:</strong> ${lead.phone || '—'}</p>
      <p><strong>Fuente:</strong> ${lead.source}</p>
      <p><strong>Mensaje:</strong> ${lead.message}</p>
    `,
  })
}

export async function sendLeadConfirmation(lead: Lead) {
  await resend.emails.send({
    from:    process.env.EMAIL_FROM!,
    to:      lead.email,
    subject: 'Recibimos tu consulta — Kristall Film',
    html: `
      <h2>Hola ${lead.name},</h2>
      <p>Recibimos tu consulta y te contactaremos en las próximas 24 horas.</p>
      <p>Equipo Kristall Film</p>
    `,
  })
}
```

---

## Fases de desarrollo

### Fase 1 — MVP (prioridad)
- [ ] Setup Next.js + Payload + Neon
- [ ] Design system (globals.css + componentes base)
- [ ] i18n setup
- [ ] Layout global (Header, Footer)
- [ ] Home completa
- [ ] Catálogo con filtros
- [ ] Detalle de producto
- [ ] Carrito + QuoteForm
- [ ] Contacto → Lead
- [ ] Servicios
- [ ] Nosotros
- [ ] Blog (listado + detalle)
- [ ] Admin Payload funcional
- [ ] Emails con Resend
- [ ] SEO + sitemap
- [ ] Deploy Vercel + Neon

### Fase 2
- [ ] Integración CRM Dr Polarizados
- [ ] Pasarela de pago (MercadoPago)
- [ ] Módulo software concesionarias
- [ ] Dashboard analítica