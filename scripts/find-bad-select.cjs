// Quick test to find which field has options=undefined in select
const collections = [
  { name: 'Users', file: '../payload/collections/Users.ts' },
  { name: 'Products', file: '../payload/collections/Products.ts' },
  { name: 'Articles', file: '../payload/collections/Articles.ts' },
  { name: 'Leads', file: '../payload/collections/Leads.ts' },
  { name: 'Orders', file: '../payload/collections/Orders.ts' },
  { name: 'Dealers', file: '../payload/collections/Dealers.ts' },
  { name: 'Media', file: '../payload/collections/Media.ts' },
]

function findSelectsWithoutOptions(fields, path = '') {
  if (!fields || !Array.isArray(fields)) return
  for (const field of fields) {
    const fieldPath = `${path}.${field.name || field.type}`
    if (field.type === 'select' && !field.options) {
      console.error(`FOUND: select without options at ${fieldPath}`)
    }
    if (field.fields) findSelectsWithoutOptions(field.fields, fieldPath)
    if (field.tabs) {
      for (const tab of field.tabs) findSelectsWithoutOptions(tab.fields, `${fieldPath}.tab`)
    }
  }
}

const fs = require('fs')
const path = require('path')

const base = path.join(__dirname, '..')

// Read each collection file and extract field definitions manually
const files = [
  'payload/collections/Users.ts',
  'payload/collections/Products.ts',
  'payload/collections/Articles.ts',
  'payload/collections/Leads.ts',
  'payload/collections/Orders.ts',
  'payload/collections/Dealers.ts',
  'payload/collections/Media.ts',
]

for (const f of files) {
  const content = fs.readFileSync(path.join(base, f), 'utf8')
  const selectMatches = [...content.matchAll(/type:\s*['"]select['"]/g)]
  const optionsMatches = [...content.matchAll(/options:/g)]
  console.log(`${f}: ${selectMatches.length} selects, ${optionsMatches.length} options`)
}
