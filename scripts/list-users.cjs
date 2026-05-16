require('dotenv').config({ path: '.env.local' })
const { Client } = require('pg')

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()
  try {
    const u = await client.query('SELECT id, email, created_at FROM users ORDER BY id ASC')
    console.log('users count:', u.rowCount)
    u.rows.forEach((r) => console.log(`  #${r.id}  ${r.email}  (created ${r.created_at})`))
  } catch (e) {
    console.log('users table error:', e.message)
  }
  try {
    const p = await client.query('SELECT COUNT(*)::int AS c FROM products')
    console.log('products count:', p.rows[0].c)
  } catch (e) {
    console.log('products table error:', e.message)
  }
  await client.end()
}
main().catch((e) => { console.error(e.message); process.exit(1) })
