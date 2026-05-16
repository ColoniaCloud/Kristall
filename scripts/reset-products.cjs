const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()
  console.log('🗑️  Reseteando tablas de products para que Payload las recree...')

  await client.query('DROP TABLE IF EXISTS products_variants CASCADE')
  await client.query('DROP TABLE IF EXISTS products_specifications CASCADE')
  await client.query('DROP TABLE IF EXISTS products_images CASCADE')
  await client.query('DROP TABLE IF EXISTS products CASCADE')
  await client.query('DROP TYPE IF EXISTS enum_products_category CASCADE')
  await client.query('DROP TYPE IF EXISTS _enum_products_category CASCADE')

  // Actualizar payload_migrations para que Payload sepa que debe re-correr la migración dev
  await client.query("DELETE FROM payload_migrations WHERE name = 'dev'")

  console.log('✅ Tablas y enums dropeados.')
  console.log('Reiniciá el servidor para que Payload recree el schema.')
  await client.end()
}
main().catch(e => { console.error('❌', e.message); process.exit(1) })
