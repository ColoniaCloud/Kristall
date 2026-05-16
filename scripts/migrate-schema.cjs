const { Client } = require('pg')

const client = new Client({
  connectionString: process.env.DATABASE_URI,
})

async function main() {
  await client.connect()
  console.log('🔄 Aplicando migración de schema...')

  // 1. Añadir columna sku (text, unique)
  await client.query(`
    ALTER TABLE products 
    ADD COLUMN IF NOT EXISTS sku varchar;
  `)
  console.log('✅ sku añadido')

  // 2. Añadir columnas técnicas (numeric nullable)
  await client.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS vlt numeric,
    ADD COLUMN IF NOT EXISTS uv numeric,
    ADD COLUMN IF NOT EXISTS irr numeric;
  `)
  console.log('✅ vlt, uv, irr añadidos')

  // 3. Añadir inStock con default true
  await client.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS in_stock boolean DEFAULT true;
  `)
  console.log('✅ in_stock añadido')

  // 4. Actualizar el enum de category
  // En PostgreSQL, la forma de añadir valores a un enum es con ALTER TYPE
  // Primero verificamos qué valores tiene el enum actual
  const enumRes = await client.query(`
    SELECT enumlabel FROM pg_enum e
    JOIN pg_type t ON e.enumtypid = t.oid
    WHERE t.typname LIKE '%category%'
    ORDER BY enumsortorder;
  `)
  console.log('Valores actuales del enum category:', enumRes.rows.map(r => r.enumlabel))

  // Obtener el nombre exacto del tipo enum para category de products
  const typeRes = await client.query(`
    SELECT t.typname FROM pg_type t
    JOIN pg_attribute a ON a.atttypid = t.oid
    JOIN pg_class c ON c.oid = a.attrelid
    WHERE c.relname = 'products' AND a.attname = 'category'
    LIMIT 1;
  `)
  console.log('Tipos encontrados:', typeRes.rows.map(r => r.typname))

  // Los nuevos valores requeridos
  const newValues = ['klar', 'karbon', 'keramx', 'krypton', 'ppf', 'vitral']
  const existing = enumRes.rows.map(r => r.enumlabel)
  
  for (const val of newValues) {
    if (!existing.includes(val)) {
      // Necesitamos el nombre exacto del tipo
      if (typeRes.rows.length > 0) {
        const typeName = typeRes.rows[0].typname
        await client.query(`ALTER TYPE "${typeName}" ADD VALUE IF NOT EXISTS '${val}'`)
        console.log(`✅ Añadido valor enum: ${val}`)
      }
    } else {
      console.log(`⏭️  Valor enum ya existe: ${val}`)
    }
  }

  // 5. Añadir unique constraint en sku
  try {
    await client.query(`
      ALTER TABLE products ADD CONSTRAINT products_sku_unique UNIQUE (sku);
    `)
    console.log('✅ Unique constraint en sku')
  } catch (e) {
    console.log('⏭️  Unique constraint en sku ya existe')
  }

  console.log('\n✅ Migración completada.')
  await client.end()
}

main().catch(e => { console.error('❌ Error:', e.message); process.exit(1) })
