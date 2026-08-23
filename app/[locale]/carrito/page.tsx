import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import CarritoClient from './CarritoClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cart' })
  return {
    title: t('title'),
    // Es una vista transaccional derivada de localStorage: igual para todos
    // los visitantes sin carrito y sin contenido propio que indexar.
    robots: { index: false, follow: true },
  }
}

export default function CarritoPage() {
  return <CarritoClient />
}
