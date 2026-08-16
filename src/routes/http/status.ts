import { Hono } from 'hono'
import type { StatusCode } from 'hono/utils/http-status'

export const httpStatus = new Hono()

httpStatus.get('/http/status/:code{[0-9]{3}}', (c) => {
  const code = parseInt(c.req.param('code'), 10)
  c.status(code as StatusCode)
  return c.json({ status: code })
})
