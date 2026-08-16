import { Hono } from 'hono'
import type { Env } from './lib/env'
import { Layout } from './lib/layout'
import { MANIFEST } from './lib/manifest'
import { PRODUCTS, CATEGORY_LIST } from './lib/data'
import { home } from './routes/home'
import { groupPages } from './routes/groupPage'
import { ecommerce } from './routes/scraping/ecommerce'
import { structuredData } from './routes/scraping/structuredData'
import { contact } from './routes/contact'
import { assets } from './routes/assets'
import { mockUsersApi } from './routes/mockData/users'
import { postsAndComments } from './routes/mockData/postsAndComments'
import { albumsAndPhotos } from './routes/mockData/albumsAndPhotos'
import { todos } from './routes/mockData/todos'
import { pagination } from './routes/scraping/pagination'
import { loadMore } from './routes/scraping/loadMore'
import { infiniteScroll } from './routes/scraping/infiniteScroll'
import { jsRendered } from './routes/scraping/jsRendered'
import { frames } from './routes/scraping/frames'
import { tables } from './routes/scraping/tables'
import { forms } from './routes/scraping/forms'
import { auth } from './routes/scraping/auth'
import { links } from './routes/scraping/links'
import { markup } from './routes/scraping/markup'
import { httpStatus } from './routes/http/status'
import { httpRedirect } from './routes/http/redirect'
import { httpDelay } from './routes/http/delay'
import { httpHeaders } from './routes/http/headers'
import { httpCookies } from './routes/http/cookies'
import { httpAuth } from './routes/http/auth'
import { httpCompression } from './routes/http/compression'
import { httpRateLimit } from './routes/http/rateLimit'
import { httpEcho } from './routes/http/echo'
import { httpCaching } from './routes/http/caching'
import { httpStreaming } from './routes/http/streaming'
import { httpUserAgentCheck } from './routes/http/userAgentCheck'
import { generatorUsers } from './routes/generator/users'
import { generatorCards } from './routes/generator/cards'
import { generatorFiles } from './routes/generator/files'
import { generatorImages } from './routes/generator/images'

const app = new Hono<{ Bindings: Env }>()

app.route('/', home)
app.route('/', groupPages)
app.route('/', ecommerce)
app.route('/', structuredData)
app.route('/', contact)
app.route('/', assets)
app.route('/', mockUsersApi)
app.route('/', postsAndComments)
app.route('/', albumsAndPhotos)
app.route('/', todos)
app.route('/', pagination)
app.route('/', loadMore)
app.route('/', infiniteScroll)
app.route('/', jsRendered)
app.route('/', frames)
app.route('/', tables)
app.route('/', forms)
app.route('/', auth)
app.route('/', links)
app.route('/', markup)
app.route('/', httpStatus)
app.route('/', httpRedirect)
app.route('/', httpDelay)
app.route('/', httpHeaders)
app.route('/', httpCookies)
app.route('/', httpAuth)
app.route('/', httpCompression)
app.route('/', httpRateLimit)
app.route('/', httpEcho)
app.route('/', httpCaching)
app.route('/', httpStreaming)
app.route('/', httpUserAgentCheck)
app.route('/', generatorUsers)
app.route('/', generatorCards)
app.route('/', generatorFiles)
app.route('/', generatorImages)

app.get('/robots.txt', (c) => {
  c.header('Content-Type', 'text/plain')
  return c.body(['User-agent: *', 'Allow: /', '', 'Sitemap: https://testingurl.dev/sitemap.xml', ''].join('\n'))
})

app.get('/sitemap.xml', (c) => {
  const staticPaths = ['/', ...MANIFEST.map((group) => `/${group.key}`)]
  const manifestPaths = MANIFEST.flatMap((group) =>
    group.categories.flatMap((cat) => cat.pages.map((p) => p.path.split('?')[0]))
  )
  // The manifest only lists one representative category/product URL each;
  // the ecommerce catalog's full page set is generated from the real data.
  const categoryPaths = CATEGORY_LIST.map((cat) => `/scraping/ecommerce/category/${cat.key}`)
  const productPaths = PRODUCTS.map((p) => `/scraping/ecommerce/product/${p.id}`)
  const urls = [...new Set([...staticPaths, ...manifestPaths, ...categoryPaths, ...productPaths])]
  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((path) => `  <url><loc>https://testingurl.dev${path}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n')
  c.header('Content-Type', 'application/xml')
  return c.body(body)
})

app.notFound((c) => {
  c.status(404)
  return c.html(
    <Layout title="404 Not Found">
      <h1>404 — Not found</h1>
      <p>
        Nothing lives at <code>{c.req.path}</code>. Some links on this site 404 on purpose — see{' '}
        <a href="/scraping/links/broken">/scraping/links/broken</a>.
      </p>
      <p>
        <a href="/">&laquo; Back home</a>
      </p>
    </Layout>
  )
})

export default app
