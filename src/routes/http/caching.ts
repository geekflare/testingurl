import { Hono } from 'hono'

export const httpCaching = new Hono()

const FIXED_LAST_MODIFIED = 'Wed, 01 Jan 2025 00:00:00 GMT'
const FIXED_ETAG = '"testingurl-cache-fixture"'

// Round-trip target for conditional GET: first request gets Last-Modified
// and ETag headers; sending either back via If-Modified-Since/If-None-Match
// gets a 304 with no body.
httpCaching.get('/http/cache', (c) => {
  const ifModifiedSince = c.req.header('If-Modified-Since')
  const ifNoneMatch = c.req.header('If-None-Match')
  if (ifModifiedSince || ifNoneMatch) {
    c.header('ETag', FIXED_ETAG)
    c.header('Last-Modified', FIXED_LAST_MODIFIED)
    c.status(304)
    return c.body(null)
  }
  c.header('ETag', FIXED_ETAG)
  c.header('Last-Modified', FIXED_LAST_MODIFIED)
  c.header('Cache-Control', 'public, max-age=60')
  return c.json({ cached: false, lastModified: FIXED_LAST_MODIFIED, etag: FIXED_ETAG })
})

// Matches httpbin's /etag/{etag}: send the same value back via
// If-None-Match to get a 304.
httpCaching.get('/http/etag/:etag', (c) => {
  const etag = c.req.param('etag')
  const quoted = `"${etag}"`
  const ifNoneMatch = c.req.header('If-None-Match')
  c.header('ETag', quoted)
  if (ifNoneMatch === quoted || ifNoneMatch === etag) {
    c.status(304)
    return c.body(null)
  }
  return c.json({ etag })
})
