import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const markup = new Hono()

const SAMPLE = PRODUCTS.slice(0, 10)

markup.get('/scraping/markup/clean', (c) => {
  return c.html(
    <Layout title="Clean semantic HTML">
      <h1>Clean semantic HTML</h1>
      <p>Same 10 products as the other markup variants, rendered with meaningful tags and classes.</p>
      <ul class="product-list">
        {SAMPLE.map((p) => (
          <li class="product" data-product-id={p.id}>
            <article>
              <h3 class="product-name">{p.name}</h3>
              <p class="product-category">{p.category}</p>
              <p class="product-price">${p.price.toFixed(2)}</p>
            </article>
          </li>
        ))}
      </ul>
    </Layout>
  )
})

markup.get('/scraping/markup/div-soup', (c) => {
  return c.html(
    <Layout title="Div soup">
      <h1>Div soup</h1>
      <p>Same data, but every element is a bare <code>div</code>/<code>span</code> with no classes or semantic tags.</p>
      <div>
        {SAMPLE.map((p) => (
          <div data-product-id={p.id}>
            <div>
              <span>{p.name}</span>
            </div>
            <div>
              <span>{p.category}</span>
            </div>
            <div>
              <span>${p.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
})

function obfuscatedClass(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return 'x' + hash.toString(36)
}

markup.get('/scraping/markup/obfuscated', (c) => {
  return c.html(
    <Layout title="Obfuscated classes">
      <h1>Obfuscated classes</h1>
      <p>Same data, wrapped in divs whose class names look machine-generated (deterministic per product, not random).</p>
      <div class={obfuscatedClass('list')}>
        {SAMPLE.map((p) => (
          <div class={obfuscatedClass('item' + p.id)} data-product-id={p.id}>
            <div class={obfuscatedClass('name' + p.id)}>{p.name}</div>
            <div class={obfuscatedClass('cat' + p.id)}>{p.category}</div>
            <div class={obfuscatedClass('price' + p.id)}>${p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
})

markup.get('/scraping/markup/data-attrs', (c) => {
  return c.html(
    <Layout title="Data-attribute hooks">
      <h1>Data-attribute hooks</h1>
      <p>
        Same data; visual classes are generic/reused for styling, but each field is exposed via{' '}
        <code>data-field</code> attributes meant to be the scraping target.
      </p>
      <div class="grid">
        {SAMPLE.map((p) => (
          <div class="card" data-product-id={p.id}>
            <div data-field="name">{p.name}</div>
            <div data-field="category">{p.category}</div>
            <div data-field="price" data-value={p.price}>
              ${p.price.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
})
