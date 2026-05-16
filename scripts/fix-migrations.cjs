const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()
  const r = await client.query(
    "INSERT INTO payload_migrations(name,batch,updated_at,created_at) VALUES('dev',-1,NOW(),NOW()) ON CONFLICT DO NOTHING"
  )
  console.log('Inserted:', r.rowCount)
  const rows = await client.query('SELECT * FROM payload_migrations')
  console.log('Migrations:', JSON.stringify(rows.rows))
  await client.end()
}
main().catch(e => { console.error(e.message); process.exit(1) })
