import { Hono } from 'hono'

export const httpRedirect = new Hono()

httpRedirect.get('/http/redirect/:n{[0-9]+}', (c) => {
  const n = parseInt(c.req.param('n'), 10)
  if (n > 0) {
    return c.redirect(`/http/redirect/${n - 1}`, 302)
  }
  return c.json({ landed: true })
})

const ALLOWED_REDIRECT_PROTOCOLS = ['http:', 'https:']

// Redirects to any absolute http(s) URL the caller supplies — for testing
// that an HTTP client follows/limits redirects to arbitrary hosts, same as
// httpbin.org/redirect-to. Restricted to http(s) to rule out javascript:/data:.
httpRedirect.get('/http/redirect-to', (c) => {
  const url = c.req.query('url')
  const statusCode = parseInt(c.req.query('status_code') ?? '302', 10)
  if (!url) return c.json({ error: 'Missing required query param: url' }, 400)

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return c.json({ error: 'url must be an absolute URL' }, 400)
  }
  if (!ALLOWED_REDIRECT_PROTOCOLS.includes(parsed.protocol)) {
    return c.json({ error: 'url must use http or https' }, 400)
  }

  const status = [301, 302, 303, 307, 308].includes(statusCode) ? statusCode : 302
  return c.redirect(parsed.toString(), status as 301 | 302 | 303 | 307 | 308)
})
