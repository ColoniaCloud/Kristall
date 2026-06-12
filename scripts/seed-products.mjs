#!/usr/bin/env node
/**
 * Seed script — Kristall Film products
 * Run: node scripts/seed-products.mjs
 *
 * Requires PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD env vars,
 * or edit the credentials below directly (do NOT commit passwords).
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? 'admin@kristallfilm.com'
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD

if (!PASSWORD) {
  console.error('❌ Set PAYLOAD_ADMIN_PASSWORD env var before running this script.')
  process.exit(1)
}

const PRODUCTS = [
  {
    name_es: 'KLAR 05 — Línea Estándar',
    name_en: 'KLAR 05 — Standard Line',
    name_de: 'KLAR 05 — Standardlinie',
    sku: 'KPRO05',
    category: 'klar',
    vlt: 5,
    uv: 99,
    irr: 73,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KLAR 15 — Línea Estándar',
    name_en: 'KLAR 15 — Standard Line',
    name_de: 'KLAR 15 — Standardlinie',
    sku: 'KPRO15',
    category: 'klar',
    vlt: 15,
    uv: 92,
    irr: 58,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KARBON 05 — Nano Carbon',
    name_en: 'KARBON 05 — Nano Carbon',
    name_de: 'KARBON 05 — Nano Carbon',
    sku: 'KNCA05',
    category: 'karbon',
    vlt: 5,
    uv: 99,
    irr: 90,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KARBON 15 — Nano Carbon',
    name_en: 'KARBON 15 — Nano Carbon',
    name_de: 'KARBON 15 — Nano Carbon',
    sku: 'KNCA15',
    category: 'karbon',
    vlt: 15,
    uv: 99,
    irr: 90,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KARBON 80 — Nano Carbon',
    name_en: 'KARBON 80 — Nano Carbon',
    name_de: 'KARBON 80 — Nano Carbon',
    sku: 'KNCA80',
    category: 'karbon',
    vlt: 80,
    uv: 99,
    irr: 80,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KERAMX 05 — Nano Ceramic',
    name_en: 'KERAMX 05 — Nano Ceramic',
    name_de: 'KERAMX 05 — Nano Keramik',
    sku: 'KNCE05',
    category: 'keramx',
    vlt: 5,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KERAMX 15 — Nano Ceramic',
    name_en: 'KERAMX 15 — Nano Ceramic',
    name_de: 'KERAMX 15 — Nano Keramik',
    sku: 'KNCE15',
    category: 'keramx',
    vlt: 15,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KRYPTON 15 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 15 — Safety Nano Ceramic',
    name_de: 'KRYPTON 15 — Sicherheit Nano Keramik',
    sku: 'KS4',
    category: 'krypton',
    vlt: 15,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: true,
  },
  {
    name_es: 'PPF — Paint Protection Film',
    name_en: 'PPF — Paint Protection Film',
    name_de: 'PPF — Lackschutzfolie',
    sku: 'TPUKX',
    category: 'ppf',
    vlt: null,
    uv: null,
    irr: null,
    inStock: true,
    active: true,
    featured: true,
  },
  {
    name_es: 'VITRAL — Láminas para Arquitectura',
    name_en: 'VITRAL — Architectural Window Film',
    name_de: 'VITRAL — Architekturfolien',
    sku: 'VITRAL01',
    category: 'vitral',
    vlt: null,
    uv: null,
    irr: null,
    inStock: false,
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

  for (const product of PRODUCTS) {
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
