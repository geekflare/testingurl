import { Hono } from 'hono'
import { Layout, BareLayout } from '../../lib/layout'
import { PRODUCTS, findProduct } from '../../lib/data'

export const frames = new Hono()

const FRAME_ITEMS = PRODUCTS.slice(0, 8)

frames.get('/scraping/frames', (c) => {
  return c.html(
    <Layout
      title="Frames & iFrames"
      description="Content nested inside an iframe pointing at a separate URL, two levels deep. Find the real page and fetch it directly."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Frames &amp; iFrames</h1>
      <p class="intro">
        The list below isn't in this document at all. It's a separate page loaded inside an{' '}
        <code>&lt;iframe&gt;</code>. View source on this page and you won't find a single item: you'll need to find
        the iframe's <code>src</code> attribute and fetch that URL directly. Each item then leads to another page
        that does the exact same thing one level deeper. Turtles all the way down.
      </p>
      <iframe src="/scraping/frames/list" title="Framed item list" class="frame-embed"></iframe>
    </Layout>
  )
})

frames.get('/scraping/frames/list', (c) => {
  return c.html(
    <BareLayout title="Framed item list">
      <p>
        This page lives at <code>/scraping/frames/list</code>, a different URL from the page that embeds it.
      </p>
      <ul class="index-list">
        {FRAME_ITEMS.map((p) => (
          <li>
            <a href={`/scraping/frames/item/${p.id}`} target="_top">
              {p.name}
            </a>
          </li>
        ))}
      </ul>
    </BareLayout>
  )
})

frames.get('/scraping/frames/item/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const product = findProduct(id)
  if (!product || !FRAME_ITEMS.includes(product)) return c.notFound()
  return c.html(
    <Layout title={product.name}>
      <p class="crumb">
        <a href="/scraping/frames">&laquo; Frames &amp; iFrames</a>
      </p>
      <h1>{product.name}</h1>
      <p class="intro">
        Same trick again: the actual product details are in another iframe at{' '}
        <code>/scraping/frames/item/{id}/detail</code>, not in this document.
      </p>
      <iframe src={`/scraping/frames/item/${id}/detail`} title={`${product.name} detail`} class="frame-embed"></iframe>
    </Layout>
  )
})

frames.get('/scraping/frames/item/:id{[0-9]+}/detail', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const product = findProduct(id)
  if (!product || !FRAME_ITEMS.includes(product)) return c.notFound()
  return c.html(
    <BareLayout title={product.name}>
      <p>
        This page lives at <code>/scraping/frames/item/{id}/detail</code>.
      </p>
      <h2 data-field="name">{product.name}</h2>
      <p class="product-price" data-field="price">
        ${product.price.toFixed(2)}
      </p>
      <p data-field="description">{product.description}</p>
    </BareLayout>
  )
})
