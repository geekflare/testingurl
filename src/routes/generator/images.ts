import { Hono } from 'hono'

export const generatorImages = new Hono()

const DIMENSION_MAX = 4000
const COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d']

// Deterministic per width/height — the same URL always returns the same
// image, so it's a stable test asset rather than a fresh-every-time
// generator, even though it lives alongside the others for discoverability.
generatorImages.get('/generator/images/:width{[0-9]+}/:height{[0-9]+}', (c) => {
  const width = Math.min(DIMENSION_MAX, Math.max(1, parseInt(c.req.param('width'), 10)))
  const height = Math.min(DIMENSION_MAX, Math.max(1, parseInt(c.req.param('height'), 10)))
  const color = COLORS[(width * 31 + height * 17) % COLORS.length]
  const fontSize = Math.max(12, Math.min(width, height) / 8)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${color}"/>
  <text x="${width / 2}" y="${height / 2}" font-family="monospace" font-size="${fontSize}" fill="#fff" text-anchor="middle" dominant-baseline="middle">${width} &#215; ${height}</text>
</svg>`
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(svg)
})
