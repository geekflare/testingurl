import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS, CATEGORY_LIST, findProduct } from '../../lib/data'
import { JsonLd, itemListJsonLd, productJsonLd } from '../../lib/structuredData'

export const ecommerce = new Hono()

function Stars({ rating }: { rating: number }) {
  return (
    <span class="stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </span>
  )
}

ecommerce.get('/scraping/ecommerce', (c) => {
  return c.html(
    <Layout
      title="Ecommerce catalog"
      description="A fake ecommerce store — practice scraping category listings and product detail pages, the classic web-scraping test target."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Ecommerce catalog</h1>
      <p class="intro">
        A small fake online store — browse by category down to individual product pages. This mirrors real
        ecommerce sites (category → product grid → product detail), a common target for scraping practice.
      </p>
      <div class="grid">
        {CATEGORY_LIST.map((cat) => {
          const count = PRODUCTS.filter((p) => p.category === cat.key).length
          return (
            <a class="card category-card" href={`/scraping/ecommerce/category/${cat.key}`} data-category={cat.key}>
              <h3>{cat.label}</h3>
              <p>{count} products</p>
            </a>
          )
        })}
      </div>
    </Layout>
  )
})

ecommerce.get('/scraping/ecommerce/category/:key', (c) => {
  const key = c.req.param('key')
  const category = CATEGORY_LIST.find((cat) => cat.key === key)
  if (!category) return c.notFound()
  const items = PRODUCTS.filter((p) => p.category === key)

  return c.html(
    <Layout
      title={category.label}
      description={`Browse ${category.label.toLowerCase()} in the fake ecommerce catalog — every product links to its own detail page.`}
    >
      <p class="crumb">
        <a href="/scraping/ecommerce">&laquo; Ecommerce catalog</a>
      </p>
      <h1>{category.label}</h1>
      <p class="intro">{items.length} products in this category.</p>
      <div class="grid">
        {items.map((p) => (
          <a class="card" href={`/scraping/ecommerce/product/${p.id}`} data-product-id={p.id}>
            <h3>{p.name}</h3>
            <p>
              ${p.price.toFixed(2)} &middot; <Stars rating={p.rating} />
            </p>
          </a>
        ))}
      </div>
      <JsonLd data={itemListJsonLd(category.label, `/scraping/ecommerce/category/${category.key}`, items)} />
    </Layout>
  )
})

ecommerce.get('/scraping/ecommerce/product/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const product = findProduct(id)
  if (!product) return c.notFound()
  const category = CATEGORY_LIST.find((cat) => cat.key === product.category)
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3)

  return c.html(
    <Layout title={product.name} description={`${product.name} — $${product.price.toFixed(2)}. ${product.description}`}>
      <p class="crumb">
        <a href="/scraping/ecommerce">Ecommerce catalog</a> /{' '}
        <a href={`/scraping/ecommerce/category/${product.category}`}>{category?.label}</a>
      </p>
      <h1 data-field="name">{product.name}</h1>
      <p class="product-price" data-field="price" data-value={product.price}>
        ${product.price.toFixed(2)}
      </p>
      <p data-field="rating" data-value={product.rating}>
        <Stars rating={product.rating} /> ({product.rating}/5)
      </p>
      <p data-field="stock" data-value={product.stock}>
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <p data-field="description">{product.description}</p>

      {related.length > 0 && (
        <>
          <h2>Related products</h2>
          <div class="grid">
            {related.map((p) => (
              <a class="card" href={`/scraping/ecommerce/product/${p.id}`} data-product-id={p.id}>
                <h3>{p.name}</h3>
                <p>${p.price.toFixed(2)}</p>
              </a>
            ))}
          </div>
        </>
      )}
      <JsonLd data={productJsonLd(product, { withReviews: true })} />
    </Layout>
  )
})
