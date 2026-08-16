import { Hono } from 'hono'

export const httpDelay = new Hono()

const MAX_DELAY_SECONDS = 10

httpDelay.get('/http/delay/:seconds{[0-9]+}', async (c) => {
  const seconds = Math.min(MAX_DELAY_SECONDS, parseInt(c.req.param('seconds'), 10))
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000))
  return c.json({ delayed_seconds: seconds })
})
