import type { MiddlewareHandler } from 'hono'

// Injects a self-referencing <link rel="canonical"> and <meta property="og:url">
// into every HTML page that doesn't already declare its own. A handful of
// pages under /scraping/url-structure and /scraping/crawler-directives are
// deliberate canonical-tag test fixtures and set their own (sometimes
// pointing elsewhere on purpose) via Layout's `head` prop; this leaves
// those untouched rather than adding a conflicting second tag. Doing this
// as a post-render middleware avoids threading the request URL through
// every one of the ~90 route handlers that call Layout.
export const canonicalMiddleware: MiddlewareHandler = async (c, next) => {
  await next()

  if (c.res.status !== 200) return
  const contentType = c.res.headers.get('Content-Type') ?? ''
  if (!contentType.includes('text/html')) return

  const body = await c.res.text()
  if (!body.includes('</head>')) return

  const url = new URL(c.req.url)
  const canonicalHref = `${url.origin}${url.pathname}${url.search}`

  let inject = `<meta property="og:url" content="${canonicalHref}">\n`
  if (!body.includes('rel="canonical"')) {
    inject += `<link rel="canonical" href="${canonicalHref}">\n`
  }

  const withTags = body.replace('</head>', `${inject}</head>`)
  const headers = new Headers(c.res.headers)
  headers.delete('content-length')
  c.res = new Response(withTags, { status: c.res.status, headers })
}
