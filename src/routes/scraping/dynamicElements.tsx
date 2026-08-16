import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const dynamicElements = new Hono()

dynamicElements.get('/scraping/dynamic-elements', (c) => {
  const randomId = crypto.randomUUID().slice(0, 8)
  return c.html(
    <Layout
      title="Dynamic elements"
      description="An element whose id changes on every request, and buttons that only become usable after a delay, for testing selector robustness and explicit-wait logic."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Dynamic elements</h1>
      <p class="intro">
        Reload this page and the <code>id</code> below changes every time, so code that hard-codes it will break. The
        two buttons stay in their initial state until client-side JS updates them a few seconds later, so a plain
        HTTP fetch (no JS execution) will never see their final state.
      </p>

      <h2>Randomized id</h2>
      <p id={`random-text-${randomId}`} data-testid="random-text">
        This paragraph's <code>id</code> is <code>random-text-{randomId}</code> on this request; it'll be
        different on the next one. Select it by the stable <code>data-testid="random-text"</code> attribute
        instead.
      </p>

      <h2>Delayed enable</h2>
      <p>
        <button id="delayed-enable-btn" data-testid="delayed-enable-button" disabled>
          Enables in 5s…
        </button>
      </p>

      <h2>Delayed color change</h2>
      <p>
        <button id="delayed-color-btn" data-testid="delayed-color-button">
          Changes color in 5s
        </button>
      </p>

      <script
        dangerouslySetInnerHTML={{
          __html: `
        setTimeout(function () {
          var btn = document.getElementById('delayed-enable-btn');
          btn.disabled = false;
          btn.textContent = 'Enabled!';
        }, 5000);
        setTimeout(function () {
          var btn = document.getElementById('delayed-color-btn');
          btn.style.background = '#059669';
          btn.style.color = '#fff';
          btn.style.borderColor = '#059669';
          btn.textContent = 'Color changed!';
        }, 5000);
      `,
        }}
      />
    </Layout>
  )
})
