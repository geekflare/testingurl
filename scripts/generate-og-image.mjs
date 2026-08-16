// Generates the site's static Open Graph / Twitter Card share image.
// Run with: node scripts/generate-og-image.mjs
//
// This is a one-off dev-time build step, not something that runs in the
// Worker. It rasterizes a hand-written SVG (same brand colors and glyph as
// the favicon) to a 1200x630 PNG, the standard OG image size. The PNG is
// then base64-embedded into src/routes/assets.tsx by hand, the same way
// the favicon and placeholder SVGs are embedded as strings, so the Worker
// never needs filesystem or image-processing access at runtime.

import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const OUT_PATH = join(dirname(fileURLToPath(import.meta.url)), '..', 'og-image.png')

const WIDTH = 1200
const HEIGHT = 630

const SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#1737a6"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="1080" cy="80" r="260" fill="#ffffff" opacity="0.05"/>
  <circle cx="1150" cy="560" r="160" fill="#ffffff" opacity="0.05"/>

  <g transform="translate(80, 84)">
    <rect width="96" height="96" rx="22" fill="#ffffff" opacity="0.14"/>
    <path d="M34 30 18 48 34 66" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M62 30 78 48 62 66" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="56" y1="24" x2="42" y2="72" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  </g>

  <text x="80" y="320" font-family="Arial, Helvetica, sans-serif" font-size="82" font-weight="700" fill="#ffffff">TestingURL<tspan fill="#93c5fd">.dev</tspan></text>

  <text x="80" y="400" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#ffffff" opacity="0.88">A free sandbox for web scraping and HTTP testing,</text>
  <text x="80" y="444" font-family="Arial, Helvetica, sans-serif" font-size="33" fill="#ffffff" opacity="0.88">plus test fixtures for AI agents and RAG pipelines.</text>

  <text x="80" y="552" font-family="Courier New, monospace" font-size="24" fill="#ffffff" opacity="0.55">testingurl.dev</text>
</svg>
`.trim()

const buffer = await sharp(Buffer.from(SVG)).png({ compressionLevel: 9 }).toBuffer()
writeFileSync(OUT_PATH, buffer)
console.log(`Wrote ${OUT_PATH} (${buffer.length} bytes)`)
