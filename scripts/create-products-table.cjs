const { Client } = require('pg')
const client = new Client({ connectionString: process.env.DATABASE_URI })

async function main() {
  await client.connect()

  // Create enum
  await client.query(`
    CREATE TYPE "enum_products_category" AS ENUM ('klar','karbon','keramx','krypton','ppf','vitral')
  `)
  console.log('Created enum_products_category')

  // Create products table
  await client.query(`
    CREATE TABLE IF NOT EXISTS "products" (
      "id" serial PRIMARY KEY,
      "name_es" varchar NOT NULL,
      "name_en" varchar NOT NULL,
      "name_de" varchar NOT NULL,
      "sku" varchar UNIQUE NOT NULL,
      "slug" varchar UNIQUE,
      "category" "enum_products_category" NOT NULL,
      "vlt" numeric,
      "uv" numeric,
      "irr" numeric,
      "in_stock" boolean DEFAULT true,
      "description_es" jsonb,
      "description_en" jsonb,
      "description_de" jsonb,
      "featured" boolean DEFAULT false,
      "active" boolean DEFAULT true,
      "seo_title" varchar,
      "seo_description" varchar,
      "updated_at" timestamp with time zone NOT NULL DEFAULT now(),
      "created_at" timestamp with time zone NOT NULL DEFAULT now()
    )
  `)
  console.log('Created products table')

  // Create products_images
  await client.query(`
    CREATE TABLE IF NOT EXISTS "products_images" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "image_id" integer,
      "alt" varchar
    )
  `)
  console.log('Created products_images')

  // Create products_specifications
  await client.query(`
    CREATE TABLE IF NOT EXISTS "products_specifications" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "key" varchar NOT NULL,
      "value" varchar NOT NULL
    )
  `)
  console.log('Created products_specifications')

  // Create products_variants
  await client.query(`
    CREATE TABLE IF NOT EXISTS "products_variants" (
      "id" serial PRIMARY KEY,
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
      "name" varchar NOT NULL,
      "sku" varchar,
      "price" numeric
    )
  `)
  console.log('Created products_variants')

  // Create _products_v for versioning (Payload may need this)
  // Skip for now, not all collections use versions

  console.log('\nAll tables created successfully!')

  await client.end()
}
main().catch(e => { console.error(e.message); process.exit(1) })
