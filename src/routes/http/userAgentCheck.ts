import { Hono } from 'hono'

export const httpUserAgentCheck = new Hono()

// Known non-browser client signatures — a deliberately simple, documented
// rule (not a real anti-bot heuristic) so the check stays predictable:
// spoof a real browser User-Agent to get a 200 instead of a 403.
const NON_BROWSER_TOKENS = [
  'curl', 'wget', 'python-requests', 'python-urllib', 'scrapy', 'go-http-client', 'okhttp',
  'axios', 'node-fetch', 'postmanruntime', 'httpclient', 'libwww-perl', 'java/', 'bot',
]

httpUserAgentCheck.get('/http/user-agent', (c) => {
  const ua = c.req.header('User-Agent') ?? ''
  const lower = ua.toLowerCase()
  const matchedToken = NON_BROWSER_TOKENS.find((t) => lower.includes(t))

  let reason: string | null = null
  if (!ua) {
    reason = 'No User-Agent header was sent.'
  } else if (matchedToken) {
    reason = `User-Agent matches a known non-browser client ("${matchedToken}").`
  } else if (!lower.includes('mozilla')) {
    reason = 'User-Agent does not look like a real browser (missing "Mozilla").'
  }

  if (reason) {
    c.status(403)
    return c.json({ blocked: true, reason, yourUserAgent: ua || null })
  }
  return c.json({ blocked: false, message: 'Your User-Agent passed the header-spoofing check.', yourUserAgent: ua })
})
