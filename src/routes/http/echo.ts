import type { Context } from 'hono'
import { Hono } from 'hono'

export const httpEcho = new Hono()

async function anythingHandler(c: Context) {
  const headers: Record<string, string> = {}
  c.req.raw.headers.forEach((v, k) => {
    headers[k] = v
  })
  const query: Record<string, string> = {}
  new URL(c.req.url).searchParams.forEach((v, k) => {
    query[k] = v
  })

  let body: unknown = null
  if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
    const contentType = c.req.header('Content-Type') ?? ''
    if (contentType.includes('application/json')) {
      body = await c.req.json().catch(() => null)
    } else {
      body = (await c.req.text().catch(() => '')) || null
    }
  }

  return c.json({
    method: c.req.method,
    url: c.req.url,
    headers,
    query,
    body,
  })
}

// Accepts any method, any sub-path — echoes back what was sent. Useful for
// testing that an HTTP client builds requests correctly, independent of
// what a real endpoint does with them.
httpEcho.all('/http/anything', anythingHandler)
httpEcho.all('/http/anything/*', anythingHandler)

// Every query param becomes a real response header (and is echoed in the
// JSON body) — for testing that a client reads arbitrary response headers.
httpEcho.get('/http/response-headers', (c) => {
  const params: Record<string, string> = {}
  new URL(c.req.url).searchParams.forEach((v, k) => {
    params[k] = v
    c.header(k, v)
  })
  return c.json(params)
})

httpEcho.get('/http/ip', (c) => {
  return c.json({ origin: c.req.header('CF-Connecting-IP') ?? 'unknown' })
})
