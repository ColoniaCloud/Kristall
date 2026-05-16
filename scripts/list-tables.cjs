const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()
  const tables = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
  console.log('Tables:', tables.rows.map(r => r.tablename).join(', '))

  const enums = await client.query(`SELECT t.typname FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid GROUP BY t.typname ORDER BY t.typname`)
  console.log('Enums:', enums.rows.map(r => r.typname).join(', '))

  await client.end()
}
main().catch(e => { console.error(e.message); process.exit(1) })
