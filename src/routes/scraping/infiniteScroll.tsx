import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const infiniteScroll = new Hono()

const PAGE_SIZE = 10

infiniteScroll.get('/scraping/infinite-scroll', (c) => {
  const initial = PRODUCTS.slice(0, PAGE_SIZE)
  return c.html(
    <Layout title="Infinite scroll">
      <h1>Infinite scroll</h1>
      <p>
        Scroll to the bottom to trigger more fetches from <code>GET /scraping/infinite-scroll/api?offset=N</code>{' '}
        (JSON). A <code>#sentinel</code> element is observed with <code>IntersectionObserver</code>.
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
      <div id="sentinel" data-offset={PAGE_SIZE} style="height:1px;"></div>
      <p id="end-message" style="display:none; color:var(--muted);">
        No more items.
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        var sentinel = document.getElementById('sentinel');
        var container = document.getElementById('items');
        var loading = false;
        var observer = new IntersectionObserver(function (entries) {
          if (!entries[0].isIntersecting || loading) return;
          loading = true;
          var offset = parseInt(sentinel.dataset.offset, 10);
          fetch('/scraping/infinite-scroll/api?offset=' + offset)
            .then(function (res) { return res.json(); })
            .then(function (data) {
              data.items.forEach(function (p) {
                var div = document.createElement('div');
                div.className = 'card';
                div.dataset.productId = p.id;
                div.innerHTML = '<h3>' + p.name + '</h3><p>' + p.category + ' · $' + p.price.toFixed(2) + '</p>';
                container.appendChild(div);
              });
              sentinel.dataset.offset = offset + data.items.length;
              loading = false;
              if (!data.hasMore) {
                observer.disconnect();
                document.getElementById('end-message').style.display = 'block';
              }
            });
        });
        observer.observe(sentinel);
      `,
        }}
      />
    </Layout>
  )
})

infiniteScroll.get('/scraping/infinite-scroll/api', (c) => {
  const offset = Math.max(0, parseInt(c.req.query('offset') ?? '0', 10) || 0)
  const items = PRODUCTS.slice(offset, offset + PAGE_SIZE)
  return c.json({ items, hasMore: offset + PAGE_SIZE < PRODUCTS.length })
})
