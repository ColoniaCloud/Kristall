import type { CollectionConfig } from 'payload'

export const Dealers: CollectionConfig = {
  slug: 'dealers',
  admin: {
    useAsTitle: 'name',
    group: 'Ventas',
    defaultColumns: ['name', 'subscriptionStatus', 'softwarePlan'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'contactName',
          type: 'text',
        },
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'subscriptionStatus',
      type: 'select',
      options: [
        { label: 'Trial', value: 'trial' },
        { label: 'Activo', value: 'active' },
        { label: 'Inactivo', value: 'inactive' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'softwarePlan',
      type: 'text',
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
