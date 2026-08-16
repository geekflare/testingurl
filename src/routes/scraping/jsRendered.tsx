import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const jsRendered = new Hono()

jsRendered.get('/scraping/js-rendered', (c) => {
  return c.html(
    <Layout title="JS-rendered content">
      <h1>JS-rendered content</h1>
      <p>
        The HTML response for this page contains no product data at all; open "view source" to confirm. Content is
        fetched from <code>GET /scraping/js-rendered/api</code> and injected by client-side JavaScript after load.
        A scraper that doesn't execute JS (or wait for it) will see an empty <code>#app</code>.
      </p>
      <div id="app" data-loaded="false"></div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        fetch('/scraping/js-rendered/api')
          .then(function (res) { return res.json(); })
          .then(function (data) {
            var app = document.getElementById('app');
            app.dataset.loaded = 'true';
            app.className = 'grid';
            app.innerHTML = data.items.map(function (p) {
              return '<div class="card" data-product-id="' + p.id + '"><h3>' + p.name + '</h3><p>' + p.category + ' · $' + p.price.toFixed(2) + '</p></div>';
            }).join('');
          });
      `,
        }}
      />
    </Layout>
  )
})

jsRendered.get('/scraping/js-rendered/api', (c) => {
  return c.json({ items: PRODUCTS.slice(0, 10) })
})
