import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrContent } from '@/lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name_es',
    group: 'Catálogo',
    defaultColumns: ['name_es', 'sku', 'category', 'inStock', 'featured', 'active'],
  },
  access: {
    read: () => true,
    create: isAdminOrContent,
    update: isAdminOrContent,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }: { data: Record<string, unknown> }) => {
        if (data.sku && typeof data.sku === 'string') {
          data.slug = data.sku.toLowerCase()
        }
        return data
      },
    ],
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
      name: 'sku',
      type: 'text',
      label: 'SKU / Código',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Generado automáticamente desde el SKU',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'KLAR', value: 'klar' },
        { label: 'KARBÖN', value: 'karbon' },
        { label: 'KERAMX', value: 'keramx' },
        { label: 'KRYPTON', value: 'krypton' },
        { label: 'PPF', value: 'ppf' },
        { label: 'VITRAL', value: 'vitral' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'vlt',
      type: 'number',
      label: 'VLT — Transmisión de luz visible (%)',
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
        description: 'Dejar vacío para PPF/VITRAL',
      },
    },
    {
      name: 'uv',
      type: 'number',
      label: 'UV Rejection (%)',
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'irr',
      type: 'number',
      label: 'IRR — Infrared Rejection (%)',
      min: 0,
      max: 100,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'inStock',
      type: 'checkbox',
      label: 'En stock (visible para compra)',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
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
        {
          name: 'key',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Variantes',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'price',
          type: 'number',
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Destacado en home',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Activo (visible en el sitio)',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo_title',
      type: 'text',
      label: 'SEO Title',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seo_description',
      type: 'textarea',
      label: 'SEO Description',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
