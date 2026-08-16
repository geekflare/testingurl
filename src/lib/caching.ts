import type { MiddlewareHandler } from 'hono'

const CACHE_TTL_SECONDS = 3600

// Path prefixes whose response is stateful, request-specific, or
// deliberately non-deterministic. Caching any of these would silently break
// the fixture they exist to test (a rate limit that never counts, a delay
// that never delays, a session page that never sees your cookie), so they're
// excluded rather than relying on every route to remember to opt out.
const NO_STORE_PREFIXES = [
  '/generator/users/api',
  '/generator/cards/api',
  '/generator/files/api',
  '/scraping/dynamic-elements',
  '/scraping/auth', // login/dashboard/logout: cookie-session dependent, and logout mutates
  '/scraping/forms/multi-step', // resets/reads a session cookie on every GET
  '/http/delay', // the whole point is that every call actually waits
  '/http/rate-limit', // stateful counter
  '/http/headers', // echoes the caller's own request headers
  '/http/anything', // echoes the caller's own request
  '/http/response-headers', // echoes caller-supplied query params as headers
  '/http/user-agent', // response depends on the request's User-Agent
  '/http/ip', // response depends on the caller's IP
  '/http/cookies', // reads/sets cookies
  '/http/auth', // depends on the caller's Authorization header
  '/http/cache', // a conditional-GET fixture; caching it would defeat the test
  '/http/etag', // same as above
  '/http/stream', // exists to demonstrate real streaming, not a cached snapshot
  '/http/range', // Range requests need to hit the real handler each time
  '/http/image', // response depends on the caller's Accept header
]

function isNoStore(path: string): boolean {
  return NO_STORE_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))
}

// Most of this site is fully deterministic per URL, so it's a natural fit
// for Cloudflare's edge cache: check the Cache API before doing any work,
// and store a fresh render behind it on a miss. Routes above are excluded
// outright. A route's own Cache-Control (e.g. the favicon/placeholder
// assets, which set a longer max-age) is kept as-is rather than overridden,
// but it's still eligible for Cache API storage like everything else.
export const cachingMiddleware: MiddlewareHandler = async (c, next) => {
  if (c.req.method !== 'GET') {
    await next()
    return
  }

  if (isNoStore(c.req.path)) {
    await next()
    if (!c.res.headers.has('Cache-Control')) {
      c.res.headers.set('Cache-Control', 'no-store')
    }
    return
  }

  const cache = caches.default
  const cacheKey = new Request(c.req.url, c.req.raw)

  const cached = await cache.match(cacheKey)
  if (cached) {
    const hit = new Response(cached.body, cached)
    hit.headers.set('X-Cache', 'HIT')
    return hit
  }

  await next()

  if (c.res.status === 200) {
    const cacheable = new Response(c.res.body, c.res)
    if (!cacheable.headers.has('Cache-Control')) {
      cacheable.headers.set('Cache-Control', `public, max-age=${CACHE_TTL_SECONDS}`)
    }
    c.executionCtx.waitUntil(cache.put(cacheKey, cacheable.clone()))
    cacheable.headers.set('X-Cache', 'MISS')
    c.res = cacheable
  }
}
