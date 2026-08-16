import { Hono } from 'hono'

export const httpHeaders = new Hono()

httpHeaders.get('/http/headers', (c) => {
  const headers: Record<string, string> = {}
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value
  })
  return c.json({ headers })
})
