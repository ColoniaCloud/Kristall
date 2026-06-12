#!/usr/bin/env node
/**
 * Migración: corrige nombres de productos KLAR de "Línea Premium" → "Línea Estándar"
 * Run: node scripts/fix-klar-nombres.mjs
 * Requiere: PAYLOAD_ADMIN_PASSWORD env var
 */

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
const EMAIL = process.env.PAYLOAD_ADMIN_EMAIL ?? 'manuel@wpuruguay.com'
const PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD

if (!PASSWORD) {
  console.error('❌ Falta PAYLOAD_ADMIN_PASSWORD')
  process.exit(1)
}

const FIXES = [
  { sku: 'KPRO05', name_es: 'KLAR 05 — Línea Estándar', name_en: 'KLAR 05 — Standard Line', name_de: 'KLAR 05 — Standardlinie' },
  { sku: 'KPRO15', name_es: 'KLAR 15 — Línea Estándar', name_en: 'KLAR 15 — Standard Line', name_de: 'KLAR 15 — Standardlinie' },
  { sku: 'KPRO30', name_es: 'KLAR 30 — Línea Estándar', name_en: 'KLAR 30 — Standard Line', name_de: 'KLAR 30 — Standardlinie' },
  { sku: 'KPRO50', name_es: 'KLAR 50 — Línea Estándar', name_en: 'KLAR 50 — Standard Line', name_de: 'KLAR 50 — Standardlinie' },
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

  let updated = 0
  let notFound = 0

  for (const { sku, name_es, name_en, name_de } of FIXES) {
    const searchRes = await fetch(
      `${BASE_URL}/api/products?where[sku][equals]=${sku}&limit=1`,
      { headers: { Authorization: `JWT ${token}` } }
    )

    if (!searchRes.ok) {
      console.error(`❌ ${sku} — Error buscando: ${searchRes.status}`)
      continue
    }

    const { docs } = await searchRes.json()

    if (!docs || docs.length === 0) {
      console.log(`⚠️  ${sku} — no encontrado, omitido`)
      notFound++
      continue
    }

    const id = docs[0].id
    const currentName = docs[0].name_es

    const patchRes = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify({ name_es, name_en, name_de }),
    })

    if (patchRes.ok) {
      console.log(`✅ ${sku} — "${currentName}" → "${name_es}"`)
      updated++
    } else {
      const body = await patchRes.json()
      console.error(`❌ ${sku} — Error ${patchRes.status}:`, JSON.stringify(body.errors ?? body))
    }
  }

  console.log(`\nFinalizado: ${updated} actualizados, ${notFound} no encontrados.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
