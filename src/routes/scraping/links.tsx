import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const links = new Hono()

links.get('/scraping/links/redirect-chain/:n{[0-9]+}', (c) => {
  const n = parseInt(c.req.param('n'), 10)
  if (n > 0) {
    return c.redirect(`/scraping/links/redirect-chain/${n - 1}`, 302)
  }
  return c.html(
    <Layout title="Redirect chain · landed">
      <h1 id="landed">You've landed</h1>
      <p>This is the end of the redirect chain.</p>
    </Layout>
  )
})

links.get('/scraping/links/circular', (c) => {
  return c.html(
    <Layout title="Circular links · A">
      <h1>Page A</h1>
      <p>
        <a href="/scraping/links/circular/b">Go to page B &raquo;</a>
      </p>
    </Layout>
  )
})

links.get('/scraping/links/circular/b', (c) => {
  return c.html(
    <Layout title="Circular links · B">
      <h1>Page B</h1>
      <p>
        <a href="/scraping/links/circular/c">Go to page C &raquo;</a>
      </p>
    </Layout>
  )
})

links.get('/scraping/links/circular/c', (c) => {
  return c.html(
    <Layout title="Circular links · C">
      <h1>Page C</h1>
      <p>
        <a href="/scraping/links/circular">&laquo; Back to page A (loop)</a>
      </p>
    </Layout>
  )
})

links.get('/scraping/links/broken', (c) => {
  return c.html(
    <Layout title="Broken links">
      <h1>Broken links</h1>
      <p>A mix of valid links and intentional 404s, good for testing link-checker/crawler error handling.</p>
      <ul>
        <li>
          <a href="/scraping/pagination/page/1">Valid: pagination page 1</a>
        </li>
        <li>
          <a href="/scraping/links/broken/dead-link-1">Broken: dead-link-1</a>
        </li>
        <li>
          <a href="/scraping/tables/simple">Valid: simple table</a>
        </li>
        <li>
          <a href="/scraping/links/broken/dead-link-2">Broken: dead-link-2</a>
        </li>
        <li>
          <a href="/scraping/markup/clean">Valid: clean markup</a>
        </li>
      </ul>
    </Layout>
  )
})
