import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const loadMore = new Hono()

const PAGE_SIZE = 10

loadMore.get('/scraping/load-more', (c) => {
  const initial = PRODUCTS.slice(0, PAGE_SIZE)
  return c.html(
    <Layout title="Load more">
      <h1>Load more button</h1>
      <p>
        Click "Load more" to fetch additional items via <code>GET /scraping/load-more/api?offset=N</code>, which
        returns JSON.
      </p>
      <div class="grid" id="items">
        {initial.map((p) => (
          <div class="card" data-product-id={p.id}>
            <h3>{p.name}</h3>
            <p>
              {p.category} &middot; ${p.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <button id="load-more-btn" data-offset={PAGE_SIZE}>
        Load more
      </button>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        var btn = document.getElementById('load-more-btn');
        btn.addEventListener('click', function () {
          var offset = parseInt(btn.dataset.offset, 10);
          fetch('/scraping/load-more/api?offset=' + offset)
            .then(function (res) { return res.json(); })
            .then(function (data) {
              var container = document.getElementById('items');
              data.items.forEach(function (p) {
                var div = document.createElement('div');
                div.className = 'card';
                div.dataset.productId = p.id;
                div.innerHTML = '<h3>' + p.name + '</h3><p>' + p.category + ' · $' + p.price.toFixed(2) + '</p>';
                container.appendChild(div);
              });
              btn.dataset.offset = offset + data.items.length;
              if (!data.hasMore) btn.remove();
            });
        });
      `,
        }}
      />
    </Layout>
  )
})

loadMore.get('/scraping/load-more/api', (c) => {
  const offset = Math.max(0, parseInt(c.req.query('offset') ?? '0', 10) || 0)
  const items = PRODUCTS.slice(offset, offset + PAGE_SIZE)
  return c.json({ items, hasMore: offset + PAGE_SIZE < PRODUCTS.length })
})
