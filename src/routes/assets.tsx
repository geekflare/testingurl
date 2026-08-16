import { Hono } from 'hono'

export const assets = new Hono()

// Deterministic, self-hosted placeholder used as the `image` field wherever
// structured data needs one — avoids depending on a third-party image host.
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450">
  <rect width="600" height="450" fill="#e4e6ea"/>
  <rect x="0.5" y="0.5" width="599" height="449" fill="none" stroke="#c7cbd1"/>
  <g fill="#8a8f98" font-family="monospace" font-size="28" text-anchor="middle">
    <text x="300" y="235">TestingURL.dev</text>
  </g>
</svg>`

assets.get('/assets/placeholder-product.svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(PLACEHOLDER_SVG)
})
