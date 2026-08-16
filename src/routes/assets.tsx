import { Hono } from 'hono'

export const assets = new Hono()

// Deterministic, self-hosted placeholder used as the `image` field wherever
// structured data needs one. Avoids depending on a third-party image host.
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

// The site favicon: a bold "</>" glyph on the brand accent color, legible
// even at 16px and on-theme with the <code> styling used throughout.
const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#2563eb"/>
  <path d="M24 20 12 32 24 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M40 20 52 32 40 44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="36" y1="16" x2="28" y2="48" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</svg>`

assets.get('/favicon.svg', (c) => {
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(FAVICON_SVG)
})
