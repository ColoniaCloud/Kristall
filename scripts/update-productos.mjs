#!/usr/bin/env node
/**
 * Update script — Productos existentes Kristall Film (catálogo 2025)
 * Run: node scripts/update-productos.mjs
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

const UPDATES = [
  {
    sku: 'TPUKX',
    patch: {
      specifications: [
        { key: 'Espesor', value: '7.5mil' },
        { key: 'Color', value: 'Transparente' },
        { key: 'Autoreparable', value: 'Por calor' },
        { key: 'Rollo', value: '1.52m × 15m' },
        { key: 'Garantía', value: '15 años' },
      ],
    },
  },
  {
    sku: 'KS4',
    patch: {
      specifications: [
        { key: 'Micrones', value: '100' },
      ],
    },
  },
  {
    sku: 'KPRO05',
    patch: {
      description_es: 'Lámina de la línea Premium con 5% de transmisión de luz visible. Hasta 99% de bloqueo UV y 3 años de garantía.',
      description_en: 'Premium line film with 5% visible light transmission. Up to 99% UV block and 3-year warranty.',
      description_de: 'Premium-Linie Folie mit 5% Lichttransmission. Bis zu 99% UV-Schutz und 3 Jahre Garantie.',
    },
  },
  {
    sku: 'KPRO15',
    patch: {
      description_es: 'Lámina Premium con 15% VLT. Balance entre privacidad y visibilidad con 92% de bloqueo UV y 3 años de garantía.',
      description_en: 'Premium film with 15% VLT. Balance between privacy and visibility with 92% UV block and 3-year warranty.',
      description_de: 'Premium Folie mit 15% VLT. Balance zwischen Privatsphäre und Sicht. 92% UV-Schutz, 3 Jahre Garantie.',
    },
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

  let updated = 0
  let notFound = 0

  for (const { sku, patch } of UPDATES) {
    const searchRes = await fetch(
      `${BASE_URL}/api/products?where[sku][equals]=${sku}&limit=1`,
      {
        headers: { Authorization: `JWT ${token}` },
      }
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

    const patchRes = await fetch(`${BASE_URL}/api/products/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `JWT ${token}`,
      },
      body: JSON.stringify(patch),
    })

    if (patchRes.ok) {
      console.log(`✅ ${sku} — actualizado (id: ${id})`)
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
