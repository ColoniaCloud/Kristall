import type { CollectionConfig } from 'payload'

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
      admin: {
        readOnly: true,
      },
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
        {
          name: 'variant',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
        },
        {
          name: 'unitPrice',
          type: 'number',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Cotizado', value: 'cotizado' },
        { label: 'Confirmado', value: 'confirmado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'totalEstimate',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
