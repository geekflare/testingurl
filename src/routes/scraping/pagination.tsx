import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const pagination = new Hono()

const PAGE_SIZE = 10

function ProductGrid({ items }: { items: typeof PRODUCTS }) {
  return (
    <div class="grid">
      {items.map((p) => (
        <div class="card" data-product-id={p.id}>
          <h3>{p.name}</h3>
          <p>
            {p.category} &middot; ${p.price.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}

pagination.get('/scraping/pagination/page/:page{[0-9]+}', (c) => {
  const page = Math.max(1, parseInt(c.req.param('page'), 10))
  const totalPages = Math.ceil(PRODUCTS.length / PAGE_SIZE)
  if (page > totalPages) return c.notFound()
  const start = (page - 1) * PAGE_SIZE
  const items = PRODUCTS.slice(start, start + PAGE_SIZE)

  return c.html(
    <Layout title={`Pagination · page ${page}`}>
      <h1>Numbered pagination</h1>
      <p>
        Page <code>{page}</code> of <code>{totalPages}</code>. Each page lists {PAGE_SIZE} products in a stable
        order.
      </p>
      <ProductGrid items={items} />
      <nav class="pagination">
        {page > 1 && <a href={`/scraping/pagination/page/${page - 1}`}>&laquo; Prev</a>}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
          n === page ? (
            <span class="active">{n}</span>
          ) : (
            <a href={`/scraping/pagination/page/${n}`}>{n}</a>
          )
        )}
        {page < totalPages && <a href={`/scraping/pagination/page/${page + 1}`}>Next &raquo;</a>}
      </nav>
    </Layout>
  )
})

pagination.get('/scraping/pagination/offset', (c) => {
  const start = Math.max(0, parseInt(c.req.query('start') ?? '0', 10) || 0)
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') ?? '10', 10) || 10))
  const items = PRODUCTS.slice(start, start + limit)
  const nextStart = start + limit

  return c.html(
    <Layout title="Pagination · offset/limit">
      <h1>Offset/limit pagination</h1>
      <p>
        Showing items <code>{start}</code>&ndash;<code>{start + items.length}</code> of{' '}
        <code>{PRODUCTS.length}</code>. Controlled via <code>?start=</code> and <code>?limit=</code>.
      </p>
      <ProductGrid items={items} />
      <nav class="pagination">
        {start > 0 && (
          <a href={`/scraping/pagination/offset?start=${Math.max(0, start - limit)}&limit=${limit}`}>&laquo; Prev</a>
        )}
        {nextStart < PRODUCTS.length && (
          <a href={`/scraping/pagination/offset?start=${nextStart}&limit=${limit}`}>Next &raquo;</a>
        )}
      </nav>
    </Layout>
  )
})
