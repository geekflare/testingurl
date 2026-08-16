import { Hono } from 'hono'

export const httpCompression = new Hono()

// Deliberately does NOT force Content-Encoding itself: Cloudflare's edge
// transparently compresses compressible responses when the client sends
// Accept-Encoding, and manually re-compressing here fights that layer
// (in local `wrangler dev` it double-compresses the body). Inspect the
// response's Content-Encoding header against a deployed testingurl.dev
// to see real edge compression in action.
httpCompression.get('/http/gzip', (c) => {
  return c.json({
    note: 'This response is compressed transparently by the edge/CDN when your client sends Accept-Encoding: gzip. Check the Content-Encoding response header.',
    padding: 'x'.repeat(2000),
  })
})
