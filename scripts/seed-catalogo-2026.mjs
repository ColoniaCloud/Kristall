#!/usr/bin/env node
/**
 * Seed script — Catálogo Kristall Film 2026
 * Agrega: KLASS (nueva línea), KAISER (nueva línea), KARBON 35, KRYPTON 05/35/50/75
 *
 * Run: node scripts/seed-catalogo-2026.mjs
 * Requiere: PAYLOAD_ADMIN_PASSWORD env var
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? 'manuel@wpuruguay.com'
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD

if (!PASSWORD) {
  console.error('❌ Falta PAYLOAD_ADMIN_PASSWORD')
  process.exit(1)
}

const PRODUCTOS = [
  // ─── KLASS (nueva categoría — estándar, 1 ply, 3 años) ───
  {
    name_es: 'KLASS 05 — Línea Estándar',
    name_en: 'KLASS 05 — Standard Line',
    name_de: 'KLASS 05 — Standardlinie',
    sku: 'KSTD05',
    category: 'klass',
    vlt: 5,
    uv: 99,
    irr: 20,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KLASS 20 — Línea Estándar',
    name_en: 'KLASS 20 — Standard Line',
    name_de: 'KLASS 20 — Standardlinie',
    sku: 'KSTD20',
    category: 'klass',
    vlt: 20,
    uv: 92,
    irr: 20,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KLASS 35 — Línea Estándar',
    name_en: 'KLASS 35 — Standard Line',
    name_de: 'KLASS 35 — Standardlinie',
    sku: 'KSTD35',
    category: 'klass',
    vlt: 35,
    uv: 81,
    irr: 20,
    inStock: true,
    active: true,
    featured: false,
  },

  // ─── KARBON (faltaba el 35) ───
  {
    name_es: 'KARBÖN 35 — Nano Carbon',
    name_en: 'KARBON 35 — Nano Carbon',
    name_de: 'KARBON 35 — Nano Carbon',
    sku: 'KNCA35',
    category: 'karbon',
    vlt: 35,
    uv: 99,
    irr: 90,
    inStock: true,
    active: true,
    featured: false,
  },

  // ─── KRYPTON (faltaban 05, 35, 50, 75) ───
  {
    name_es: 'KRYPTON 05 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 05 — Safety Nano Ceramic',
    name_de: 'KRYPTON 05 — Sicherheit Nano Keramik',
    sku: 'KS405',
    category: 'krypton',
    vlt: 5,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KRYPTON 35 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 35 — Safety Nano Ceramic',
    name_de: 'KRYPTON 35 — Sicherheit Nano Keramik',
    sku: 'KS435',
    category: 'krypton',
    vlt: 35,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KRYPTON 50 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 50 — Safety Nano Ceramic',
    name_de: 'KRYPTON 50 — Sicherheit Nano Keramik',
    sku: 'KS450',
    category: 'krypton',
    vlt: 50,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KRYPTON 75 — Seguridad Nano Ceramic',
    name_en: 'KRYPTON 75 — Safety Nano Ceramic',
    name_de: 'KRYPTON 75 — Sicherheit Nano Keramik',
    sku: 'KS475',
    category: 'krypton',
    vlt: 71,
    uv: 99,
    irr: 95,
    inStock: true,
    active: true,
    featured: false,
  },

  // ─── KAISER (nueva categoría — Sputtering Ceramic, 10 años) ───
  {
    name_es: 'KAISER 10 — Sputtering Ceramic',
    name_en: 'KAISER 10 — Sputtering Ceramic',
    name_de: 'KAISER 10 — Sputtering Keramik',
    sku: 'KSNC10',
    category: 'kaiser',
    vlt: 10,
    uv: 99,
    irr: 99,
    inStock: true,
    active: true,
    featured: true,
  },
  {
    name_es: 'KAISER 20 — Sputtering Ceramic',
    name_en: 'KAISER 20 — Sputtering Ceramic',
    name_de: 'KAISER 20 — Sputtering Keramik',
    sku: 'KSNC20',
    category: 'kaiser',
    vlt: 20,
    uv: 99,
    irr: 99,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KAISER 40 — Sputtering Ceramic',
    name_en: 'KAISER 40 — Sputtering Ceramic',
    name_de: 'KAISER 40 — Sputtering Keramik',
    sku: 'KSNC40',
    category: 'kaiser',
    vlt: 38,
    uv: 99,
    irr: 98,
    inStock: true,
    active: true,
    featured: false,
  },
  {
    name_es: 'KAISER 70 — Sputtering Ceramic',
    name_en: 'KAISER 70 — Sputtering Ceramic',
    name_de: 'KAISER 70 — Sputtering Keramik',
    sku: 'KSNC70',
    category: 'kaiser',
    vlt: 70,
    uv: 99,
    irr: 98,
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
  console.log('✅ Token obtenido\n')

  let created = 0
  let skipped = 0

  for (const product of PRODUCTOS) {
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
      console.log(`✅ [${product.category.toUpperCase()}] ${product.sku}`)
      created++
    } else {
      const body = await res.json()
      const isDuplicate = body?.errors?.some?.((e) =>
        e?.message?.includes?.('duplicate') || e?.message?.includes?.('unique'),
      )
      if (isDuplicate) {
        console.log(`⏭️  ${product.sku} — ya existe`)
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
