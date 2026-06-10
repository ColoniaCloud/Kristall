#!/usr/bin/env node
/**
 * Resetea la contraseña de TODOS los usuarios al valor indicado.
 * Usa el mismo algoritmo que Payload: PBKDF2 + SHA-256, 25000 iter, 512 bytes, salt random 32 bytes.
 * Run: node scripts/reset-passwords.cjs
 */
require('dotenv').config({ path: '.env.local' })
const crypto = require('crypto')
const { Client } = require('pg')

const NEW_PASSWORD = 'Polarizados@26'

function randomBytes() {
  return new Promise((resolve, reject) =>
    crypto.randomBytes(32, (err, buf) => (err ? reject(err) : resolve(buf))),
  )
}

function pbkdf2(password, salt) {
  return new Promise((resolve, reject) =>
    crypto.pbkdf2(password, salt, 25000, 512, 'sha256', (err, hash) =>
      err ? reject(err) : resolve(hash),
    ),
  )
}

async function generateSaltHash(password) {
  const saltBuf = await randomBytes()
  const salt = saltBuf.toString('hex')
  const hashRaw = await pbkdf2(password, salt)
  const hash = hashRaw.toString('hex')
  return { salt, hash }
}

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URI })
  await client.connect()

  const { rows: users } = await client.query('SELECT id, email FROM users ORDER BY id ASC')
  console.log(`Usuarios encontrados: ${users.length}`)

  for (const user of users) {
    const { salt, hash } = await generateSaltHash(NEW_PASSWORD)
    await client.query(
      'UPDATE users SET salt = $1, hash = $2, login_attempts = 0, lock_until = NULL WHERE id = $3',
      [salt, hash, user.id],
    )
    console.log(`✅  #${user.id}  ${user.email}`)
  }

  await client.end()
  console.log('\nContraseña actualizada para todos los usuarios.')
}

main().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
