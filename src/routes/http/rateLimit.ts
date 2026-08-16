import { Hono } from 'hono'
import type { Env } from '../../lib/env'

export const httpRateLimit = new Hono<{ Bindings: Env }>()

const LIMIT = 5
// Cloudflare KV requires expirationTtl >= 60 seconds.
const WINDOW_SECONDS = 60

httpRateLimit.get('/http/rate-limit', async (c) => {
  const kv = c.env.TESTINGURL_KV
  if (!kv) {
    return c.json(
      { error: 'TESTINGURL_KV is not bound. Run `wrangler kv namespace create TESTINGURL_KV` and set its id in wrangler.toml.' },
      501
    )
  }

  const clientId = c.req.header('CF-Connecting-IP') ?? 'unknown'
  const key = `rate-limit:${clientId}`
  const current = await kv.get(key)
  const count = current ? parseInt(current, 10) : 0

  if (count >= LIMIT) {
    c.header('Retry-After', String(WINDOW_SECONDS))
    return c.json({ error: 'Too many requests', limit: LIMIT, window_seconds: WINDOW_SECONDS }, 429)
  }

  await kv.put(key, String(count + 1), { expirationTtl: WINDOW_SECONDS })
  return c.json({ ok: true, requests_used: count + 1, limit: LIMIT, window_seconds: WINDOW_SECONDS })
})
