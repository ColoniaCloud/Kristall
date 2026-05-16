import type { CollectionConfig } from 'payload'
import { isSalesOrAdmin, isAdmin, isSalesOrAdminField } from '@/lib/access'

export const Leads: CollectionConfig = {
  slug: 'leads',
  admin: {
    useAsTitle: 'name',
    group: 'Ventas',
    defaultColumns: ['name', 'company', 'source', 'status', 'createdAt'],
  },
  access: {
    read: isSalesOrAdmin,
    create: () => true,
    update: isSalesOrAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Formulario de contacto', value: 'contacto' },
        { label: 'Cotización de carrito', value: 'cotizacion' },
        { label: 'Página de servicios', value: 'servicios' },
        { label: 'Concesionaria', value: 'concesionaria' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'nuevo',
      options: [
        { label: 'Nuevo', value: 'nuevo' },
        { label: 'En proceso', value: 'en-proceso' },
        { label: 'Respondido', value: 'respondido' },
        { label: 'Cerrado', value: 'cerrado' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notas internas (solo admin)',
      access: {
        read: isSalesOrAdminField,
      },
    },
    {
      name: 'cartItems',
      type: 'array',
      label: 'Productos del carrito',
      fields: [
        {
          name: 'productName',
          type: 'text',
        },
        {
          name: 'variant',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
        },
      ],
    },
    {
      name: 'syncedToCRM',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'crmId',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
    },
  ],
}
