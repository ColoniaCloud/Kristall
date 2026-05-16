import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html>
      <body style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '4rem' }}>
        <h1>404 — Página no encontrada</h1>
        <Link href="/">Volver al inicio</Link>
      </body>
    </html>
  )
}
