#!/usr/bin/env node
/**
 * Seed script — Nuevos productos Kristall Film (catálogo 2025)
 * Run: node scripts/seed-nuevos-productos.mjs
 *
 * Requires PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD env vars.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@kristallfilm.com'
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD

if (!PASSWORD) {
  console.error('❌ Set PAYLOAD_ADMIN_PASSWORD env var before running this script.')
  process.exit(1)
}

const NUEVOS_PRODUCTOS = [
  {
    name_es: 'KLAR 30 — Línea Estándar',
    name_en: 'KLAR 30 — Standard Line',
    name_de: 'KLAR 30 — Standardlinie',
    sku: 'KPRO30',
    category: 'klar',
    vlt: 30,
    uv: 81,
    irr: 46,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KLAR 50 — Línea Estándar',
    name_en: 'KLAR 50 — Standard Line',
    name_de: 'KLAR 50 — Standardlinie',
    sku: 'KPRO50',
    category: 'klar',
    vlt: 46,
    uv: 56,
    irr: 20,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KERAMX 35 — Nano Ceramic',
    name_en: 'KERAMX 35 — Nano Ceramic',
    name_de: 'KERAMX 35 — Nano Keramik',
    sku: 'KNCE35',
    category: 'keramx',
    vlt: 35,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KERAMX 50 — Nano Ceramic',
    name_en: 'KERAMX 50 — Nano Ceramic',
    name_de: 'KERAMX 50 — Nano Keramik',
    sku: 'KNCE50',
    category: 'keramx',
    vlt: 50,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KERAMX 75 — Nano Ceramic',
    name_en: 'KERAMX 75 — Nano Ceramic',
    name_de: 'KERAMX 75 — Nano Keramik',
    sku: 'KNCE75',
    category: 'keramx',
    vlt: 75,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
]

async function main() {
  console.log(`🔐 Autenticando en ${BASE_URL}...`)

  const loginRes = await fetch(`${BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  })

  if (!loginRes.ok) {
    const body = await loginRes.text()
    console.error('❌ Login fallido:', loginRes.status, body)
    process.exit(1)
  }

  const { token } = await loginRes.json()
  console.log('✅ Token obtenido')

  let created = 0
  let skipped = 0

  for (const product of NUEVOS_PRODUCTOS) {
    const res = await fetch(`${BASE_URL}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(product),
    })

    if (res.ok) {
      const data = await res.json()
      console.log(`✅ ${product.sku} — ${data.doc?.slug ?? '(sin slug)'}`)
      created++
    } else {
      const body = await res.json()
      if (body?.errors?.some?.((e) => e?.message?.includes?.('duplicate') || e?.message?.includes?.('unique'))) {
        console.log(`⏭️  ${product.sku} — ya existe, omitido`)
        skipped++
      } else {
        console.error(`❌ ${product.sku} — Error ${res.status}:`, JSON.stringify(body.errors ?? body))
      }
    }
  }

  console.log(`\nFinalizado: ${created} creados, ${skipped} omitidos.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
