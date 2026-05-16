const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()

  // Drop all tables in dependency order
  const dropTables = [
    'products_variants',
    'products_specifications',
    'products_images',
    'products',
    'orders_items',
    'orders',
    'leads_cart_items',
    'leads',
    'dealers',
    'articles',
    'media',
    'payload_preferences_rels',
    'payload_preferences',
    'payload_locked_documents_rels',
    'payload_locked_documents',
    'payload_migrations',
    'payload_kv',
    'users_sessions',
    'users',
  ]

  for (const table of dropTables) {
    try {
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`)
      console.log(`Dropped table: ${table}`)
    } catch (e) {
      console.log(`Skip ${table}: ${e.message}`)
    }
  }

  // Drop all enums
  const enums = [
    'enum_products_category',
    'enum_articles_category',
    'enum_articles_status',
    'enum_dealers_subscription_status',
    'enum_leads_source',
    'enum_leads_status',
    'enum_orders_status',
    'enum_users_role',
  ]

  for (const en of enums) {
    try {
      await client.query(`DROP TYPE IF EXISTS "${en}" CASCADE`)
      console.log(`Dropped enum: ${en}`)
    } catch (e) {
      console.log(`Skip enum ${en}: ${e.message}`)
    }
  }

  console.log('\nFull reset done. Restart the dev server to let Payload recreate schema.')
  await client.end()
}
main().catch(e => { console.error(e.message); process.exit(1) })
