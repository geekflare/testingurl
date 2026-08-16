import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS, CATEGORY_LIST } from '../../lib/data'

export const tables = new Hono()

tables.get('/scraping/tables/simple', (c) => {
  return c.html(
    <Layout title="Simple table">
      <h1>Simple table</h1>
      <p>A single flat table listing every product.</p>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {PRODUCTS.map((p) => (
            <tr data-product-id={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.rating}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
})

const SORT_FIELDS = ['name', 'price', 'rating', 'stock'] as const
type SortField = (typeof SORT_FIELDS)[number]

tables.get('/scraping/tables/sortable', (c) => {
  const sortParam = c.req.query('sort')
  const sort: SortField = (SORT_FIELDS as readonly string[]).includes(sortParam ?? '')
    ? (sortParam as SortField)
    : 'name'
  const dir = c.req.query('dir') === 'desc' ? 'desc' : 'asc'

  const sorted = [...PRODUCTS].sort((a, b) => {
    const av = a[sort]
    const bv = b[sort]
    const cmp = typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)
    return dir === 'asc' ? cmp : -cmp
  })

  function headerLink(field: SortField, label: string) {
    const nextDir = sort === field && dir === 'asc' ? 'desc' : 'asc'
    return (
      <th>
        <a href={`/scraping/tables/sortable?sort=${field}&dir=${nextDir}`}>
          {label} {sort === field ? (dir === 'asc' ? '▲' : '▼') : ''}
        </a>
      </th>
    )
  }

  return c.html(
    <Layout title="Sortable table">
      <h1>Sortable table</h1>
      <p>
        Sorted server-side via <code>?sort=</code> and <code>?dir=</code> query params. Click a column header.
        Currently sorted by <code>{sort}</code> (<code>{dir}</code>).
      </p>
      <table>
        <thead>
          <tr>
            {headerLink('name', 'Name')}
            <th>Category</th>
            {headerLink('price', 'Price')}
            {headerLink('rating', 'Rating')}
            {headerLink('stock', 'Stock')}
          </tr>
        </thead>
        <tbody>
          {sorted.map((p) => (
            <tr data-product-id={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td>{p.rating}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
})

tables.get('/scraping/tables/nested', (c) => {
  return c.html(
    <Layout title="Nested/merged cells">
      <h1>Nested/merged cells</h1>
      <p>
        Products grouped by category using <code>rowspan</code> on the first cell of each group, a common
        real-world markup pattern that trips up naive row-by-row parsing.
      </p>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Name</th>
            <th>Price</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {CATEGORY_LIST.map((cat) => {
            const items = PRODUCTS.filter((p) => p.category === cat.key)
            return items.map((p, i) => (
              <tr data-product-id={p.id}>
                {i === 0 && <td rowspan={items.length}>{cat.label}</td>}
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.rating}</td>
              </tr>
            ))
          })}
        </tbody>
      </table>
    </Layout>
  )
})
