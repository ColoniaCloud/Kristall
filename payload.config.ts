import path from 'path'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

import { Users } from './payload/collections/Users'
import { Products } from './payload/collections/Products'
import { Articles } from './payload/collections/Articles'
import { Leads } from './payload/collections/Leads'
import { Orders } from './payload/collections/Orders'
import { Dealers } from './payload/collections/Dealers'
import { Media } from './payload/collections/Media'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '— Kristall Film Admin',
    },
  },
  collections: [Users, Products, Articles, Leads, Orders, Dealers, Media],
  editor: lexicalEditor(),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
    push: true,
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'types/payload-types.ts'),
  },
})
