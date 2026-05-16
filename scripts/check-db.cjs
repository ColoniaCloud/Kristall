const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()

  const dealersCols = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='dealers' ORDER BY ordinal_position"
  )
  console.log('dealers columns:', dealersCols.rows.map(r => r.column_name).join(', '))

  // Check if payload_preferences_rels has all needed columns
  const prefRels = await client.query(
    "SELECT column_name FROM information_schema.columns WHERE table_name='payload_preferences_rels' ORDER BY ordinal_position"
  )
  console.log('payload_preferences_rels:', prefRels.rows.map(r => r.column_name).join(', '))

  await client.end()
}
main().catch(e => { console.error(e.message); process.exit(1) })





