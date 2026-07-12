// Genera los íconos PWA del Panel de Cliente a partir de public/ProfilePic.jpg.
// Correr una vez manualmente: node scripts/generate-client-portal-icons.mjs
import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PUBLIC_DIR = path.join(__dirname, '..', 'public')
const SRC = path.join(PUBLIC_DIR, 'ProfilePic.jpg')

// Aproximación en sRGB del --background del tema oscuro .crm-theme (oklch(0.22 0.006 285)).
const BG = { r: 38, g: 38, b: 42 }

async function main() {
  await sharp(SRC)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-cliente-192.png'))

  await sharp(SRC)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-cliente-512.png'))

  await sharp(SRC)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon-cliente.png'))

  // Maskable: safe zone ~80% (410/512) centrada sobre un lienzo del color de
  // fondo del tema, para que el recorte circular/adaptive-icon de Android no
  // corte la cara.
  const inner = await sharp(SRC).resize(410, 410, { fit: 'cover' }).toBuffer()
  await sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
    .composite([{ input: inner, top: 51, left: 51 }])
    .png()
    .toFile(path.join(PUBLIC_DIR, 'icon-cliente-maskable-512.png'))

  console.log('Íconos del Panel de Cliente generados en public/.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
