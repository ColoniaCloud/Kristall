import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title_es',
    group: 'Contenido',
    defaultColumns: ['title_es', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title_es',
      type: 'text',
      required: true,
    },
    {
      name: 'title_en',
      type: 'text',
      required: true,
    },
    {
      name: 'title_de',
      type: 'text',
      required: true,
    },
    {
      // Sin `required`, a diferencia de es/en/de: la columna se agrega sobre una
      // tabla que ya existe (y payload.config usa push: true), así que tiene que
      // ser nullable para que el sync de schema no falle con filas viejas. El
      // fallback de lib/blog.ts sirve el título en es hasta que se traduzca.
      // Cuando el contenido en pt esté al día, se puede pasar a required.
      name: 'title_pt',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Tecnología', value: 'tecnologia' },
        { label: 'Arquitectura', value: 'arquitectura' },
        { label: 'Vehicular', value: 'vehicular' },
        { label: 'PPF', value: 'ppf' },
        { label: 'Empresa', value: 'empresa' },
      ],
    },
    {
      name: 'excerpt_es',
      type: 'textarea',
    },
    {
      name: 'excerpt_en',
      type: 'textarea',
    },
    {
      name: 'excerpt_de',
      type: 'textarea',
    },
    {
      name: 'excerpt_pt',
      type: 'textarea',
    },
    {
      name: 'content_es',
      type: 'richText',
    },
    {
      name: 'content_en',
      type: 'richText',
    },
    {
      name: 'content_de',
      type: 'richText',
    },
    {
      name: 'content_pt',
      type: 'richText',
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'author',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
