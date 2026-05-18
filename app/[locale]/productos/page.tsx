import { getPayload } from 'payload'
import config from '@payload-config'
import ProductsHero from '@/components/product/ProductsHero'
import ProductsClient, { type ProductItem } from '@/components/product/ProductsClient'

export const revalidate = 3600

export default async function ProductsPage() {
  const payload = await getPayload({ config })
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    limit: 100,
  })

  const serialized = (products as unknown as ProductItem[]).map((p) => ({
    id: p.id,
    name_es: p.name_es,
    category: p.category,
    description_es: p.description_es || '',
    vlt: p.vlt ?? null,
    uv: p.uv ?? null,
    irr: p.irr ?? null,
    sku: p.sku,
    inStock: p.inStock,
    slug: p.slug,
  }))

  return (
    <div className="min-h-screen bg-[#F2F2F0]">
      <ProductsHero />
      <ProductsClient products={serialized} />
    </div>
  )
}
