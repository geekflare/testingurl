export interface Product {
  id: number
  slug: string
  name: string
  category: string
  price: number
  rating: number
  stock: number
  description: string
}

export interface CategoryMeta {
  key: string
  label: string
  noun: string
}

export const CATEGORY_LIST: CategoryMeta[] = [
  { key: 'laptops', label: 'Laptops', noun: 'Laptop' },
  { key: 'phones', label: 'Phones', noun: 'Phone' },
  { key: 'headphones', label: 'Headphones', noun: 'Headphones' },
  { key: 'cameras', label: 'Cameras', noun: 'Camera' },
]

const BRANDS = ['Nova', 'Zenith', 'Orbit', 'Vertex', 'Halo', 'Drift', 'Pulse', 'Ember']
const TIERS = ['Lite', 'Air', 'Pro', 'Max', 'Studio']
const DESCRIPTIONS = [
  'Built for everyday reliability.',
  'Designed with a minimalist aesthetic.',
  'Engineered for performance under load.',
  'Balances battery life and speed.',
  'A favorite among reviewers this year.',
  'Ships with a 2-year limited warranty.',
]

const ITEMS_PER_CATEGORY = 15

// Deterministic, seed-free "fake" catalog: every request produces the exact
// same data, which is the whole point of a scraping practice target.
function buildCatalog(): Product[] {
  const items: Product[] = []
  let id = 1
  for (const cat of CATEGORY_LIST) {
    for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
      const brand = BRANDS[(id * 3 + i) % BRANDS.length]
      const tier = TIERS[(id + i) % TIERS.length]
      const model = 100 + ((id * 7 + i * 3) % 900)
      const name = `${brand} ${tier} ${cat.noun} ${model}`
      const price = Math.round((49 + ((id * 37 + i * 13) % 950)) * 100) / 100
      const rating = 1 + ((id + i * 2) % 5)
      const stock = (id * 17 + i * 11) % 40
      items.push({
        id,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        category: cat.key,
        price,
        rating,
        stock,
        description: DESCRIPTIONS[(id + i) % DESCRIPTIONS.length],
      })
      id++
    }
  }
  return items
}

export const PRODUCTS: Product[] = buildCatalog()

export function findProduct(id: number): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}
