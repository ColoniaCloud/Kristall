const { Client } = require('pg')

const client = new Client({ connectionString: process.env.DATABASE_URI })

const PRODUCTS = [
  {
    name_es: 'KLAR 05 — Línea Premium',
    name_en: 'KLAR 05 — Premium Line',
    name_de: 'KLAR 05 — Premium-Linie',
    sku: 'KPRO05', slug: 'kpro05', category: 'klar',
    vlt: 5, uv: 99, irr: 73, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KLAR 15 — Línea Premium',
    name_en: 'KLAR 15 — Premium Line',
    name_de: 'KLAR 15 — Premium-Linie',
    sku: 'KPRO15', slug: 'kpro15', category: 'klar',
    vlt: 15, uv: 92, irr: 58, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KARBON 05 — Nano Carbon',
    name_en: 'KARBON 05 — Nano Carbon',
    name_de: 'KARBON 05 — Nano Carbon',
    sku: 'KNCA05', slug: 'knca05', category: 'karbon',
    vlt: 5, uv: 99, irr: 90, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KARBON 15 — Nano Carbon',
    name_en: 'KARBON 15 — Nano Carbon',
    name_de: 'KARBON 15 — Nano Carbon',
    sku: 'KNCA15', slug: 'knca15', category: 'karbon',
    vlt: 15, uv: 99, irr: 90, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KARBON 80 — Nano Carbon',
    name_en: 'KARBON 80 — Nano Carbon',
    name_de: 'KARBON 80 — Nano Carbon',
    sku: 'KNCA80', slug: 'knca80', category: 'karbon',
    vlt: 80, uv: 99, irr: 80, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KERAMX 05 — Nano Ceramic',
    name_en: 'KERAMX 05 — Nano Ceramic',
    name_de: 'KERAMX 05 — Nano Keramik',
    sku: 'KNCE05', slug: 'knce05', category: 'keramx',
    vlt: 5, uv: 99, irr: 95, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KERAMX 15 — Nano Ceramic',
    name_en: 'KERAMX 15 — Nano Ceramic',
    name_de: 'KERAMX 15 — Nano Keramik',
    sku: 'KNCE15', slug: 'knce15', category: 'keramx',
    vlt: 15, uv: 99, irr: 95, in_stock: true, featured: false, active: true,
  },
  {
    name_es: 'KRYPTON 15 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 15 — Safety Nano Ceramic',
    name_de: 'KRYPTON 15 — Sicherheit Nano Keramik',
    sku: 'KS4', slug: 'ks4', category: 'krypton',
    vlt: 15, uv: 99, irr: 95, in_stock: true, featured: true, active: true,
  },
  {
    name_es: 'PPF — Paint Protection Film',
    name_en: 'PPF — Paint Protection Film',
    name_de: 'PPF — Lackschutzfolie',
    sku: 'TPUKX', slug: 'tpukx', category: 'ppf',
    vlt: null, uv: null, irr: null, in_stock: true, featured: true, active: true,
  },
  {
    name_es: 'VITRAL — Láminas para Arquitectura',
    name_en: 'VITRAL — Architectural Window Film',
    name_de: 'VITRAL — Architekturfolien',
    sku: 'VITRAL01', slug: 'vitral01', category: 'vitral',
    vlt: null, uv: null, irr: null, in_stock: false, featured: false, active: true,
  },
]

async function main() {
  await client.connect()
  console.log('🌱 Insertando productos...\n')

  let created = 0
  let skipped = 0

  for (const p of PRODUCTS) {
    // Check if already exists by sku
    const existing = await client.query('SELECT id FROM products WHERE sku = $1', [p.sku])
    if (existing.rows.length > 0) {
      console.log(`⏭️  ${p.sku} — ya existe`)
      skipped++
      continue
    }

    const now = new Date().toISOString()
    await client.query(
      `INSERT INTO products (
        name_es, name_en, name_de, slug, sku, category,
        vlt, uv, irr, in_stock, featured, active,
        updated_at, created_at
      ) VALUES ($1,$2,$3,$4,$5,$6::enum_products_category,$7,$8,$9,$10,$11,$12,$13,$14)`,
      [
        p.name_es, p.name_en, p.name_de, p.slug, p.sku, p.category,
        p.vlt, p.uv, p.irr, p.in_stock, p.featured, p.active,
        now, now,
      ]
    )
    console.log(`✅ ${p.sku} — ${p.slug}`)
    created++
  }

  console.log(`\n✅ Finalizado: ${created} creados, ${skipped} omitidos.`)
  await client.end()
}

main().catch(e => { console.error('❌', e.message); process.exit(1) })
