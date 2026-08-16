import { Hono } from 'hono'

export const httpStreaming = new Hono()

const STREAM_MAX = 100

// Streams N newline-delimited JSON lines via a ReadableStream. Useful for
// testing that a client processes a response incrementally rather than buffering it.
httpStreaming.get('/http/stream/:n{[0-9]+}', (c) => {
  const n = Math.min(STREAM_MAX, parseInt(c.req.param('n'), 10))
  const url = c.req.url
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      for (let i = 0; i < n; i++) {
        controller.enqueue(encoder.encode(JSON.stringify({ id: i, url }) + '\n'))
      }
      controller.close()
    },
  })
  c.header('Content-Type', 'application/x-ndjson')
  return c.body(stream)
})

const RANGE_MAX = 10000
const RANGE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

// Supports byte-range requests (Range: bytes=start-end) with real 206
// Partial Content / 416 responses, for testing resumable-download logic.
httpStreaming.get('/http/range/:n{[0-9]+}', (c) => {
  const n = Math.min(RANGE_MAX, Math.max(1, parseInt(c.req.param('n'), 10)))
  const full = Array.from({ length: n }, (_, i) => RANGE_CHARS[i % RANGE_CHARS.length]).join('')
  c.header('Accept-Ranges', 'bytes')
  c.header('Content-Type', 'text/plain; charset=utf-8')

  const rangeHeader = c.req.header('Range')
  const match = rangeHeader ? /bytes=(\d*)-(\d*)/.exec(rangeHeader) : null
  if (!match) return c.body(full)

  const start = match[1] ? parseInt(match[1], 10) : 0
  const end = Math.min(match[2] ? parseInt(match[2], 10) : n - 1, n - 1)
  if (start > end || start >= n) {
    c.header('Content-Range', `bytes */${n}`)
    c.status(416)
    return c.body(null)
  }
  c.header('Content-Range', `bytes ${start}-${end}/${n}`)
  c.status(206)
  return c.body(full.slice(start, end + 1))
})

// A real (not mislabeled) 1x1 transparent PNG, used when a client asks for
// image/png specifically.
const TRANSPARENT_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='

// Returns a different real image depending on Accept, for testing
// content-negotiation logic. Only svg+xml and png are genuinely supported;
// anything else falls back to svg.
httpStreaming.get('/http/image', (c) => {
  const accept = c.req.header('Accept') ?? ''
  if (accept.includes('image/png')) {
    const bytes = Uint8Array.from(atob(TRANSPARENT_PNG_BASE64), (ch) => ch.charCodeAt(0))
    c.header('Content-Type', 'image/png')
    return c.body(bytes)
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#2563eb"/>
  <text x="100" y="106" font-family="monospace" font-size="20" fill="#fff" text-anchor="middle">SVG</text>
</svg>`
  c.header('Content-Type', 'image/svg+xml')
  return c.body(svg)
})
