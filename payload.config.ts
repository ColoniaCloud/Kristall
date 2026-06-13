import path from 'path'
import sharp from 'sharp'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateDescription, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Users } from './payload/collections/Users'
import { Products } from './payload/collections/Products'
import { Articles } from './payload/collections/Articles'
import { Leads } from './payload/collections/Leads'
import { Orders } from './payload/collections/Orders'
import { Dealers } from './payload/collections/Dealers'
import { Media } from './payload/collections/Media'

// El plugin SEO es compartido por `articles` y `products`, que usan campos i18n
// con sufijo (title_es / name_es / excerpt_es). El `doc` no está localizado, así
// que generamos a partir del ES como idioma base y diferenciamos por colección.
const generateTitle: GenerateTitle = ({ doc }) =>
  `Kristall Film — ${doc?.title_es ?? doc?.name_es ?? ''}`

const generateDescription: GenerateDescription = ({ doc }) =>
  doc?.excerpt_es ?? doc?.seo_description ?? ''

const generateURL: GenerateURL = ({ doc, collectionSlug }) =>
  collectionSlug === 'articles'
    ? `https://kristallfilm.com/es/blog/${doc?.slug ?? ''}`
    : `https://kristallfilm.com/es/productos`

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Kristall Film Admin',
    },
  },
  collections: [Users, Products, Articles, Leads, Orders, Dealers, Media],
  plugins: [
    seoPlugin({
      collections: ['articles', 'products'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle,
      generateDescription,
      generateURL,
    }),
  ],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  sharp,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'types/payload-types.ts'),
  },
})
