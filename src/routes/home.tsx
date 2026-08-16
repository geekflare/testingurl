import { Hono } from 'hono'
import { Layout } from '../lib/layout'
import { MANIFEST } from '../lib/manifest'
import { CategorySection } from '../lib/categoryList'

export const home = new Hono()

home.get('/', (c) => {
  return c.html(
    <Layout
      title="Web Scraping Test Site"
      description="TestingURL.dev is a free web scraping test site and developer sandbox. Practice pages for crawlers and HTTP clients, from an ecommerce catalog to pagination, forms, and login walls."
    >
      <div class="hero">
        <h1>Developer & Web Scraping Sandbox</h1>
        <p class="lead">
          TestingURL.dev is a free web scraping test site and developer sandbox. Practice pages for crawlers and
          HTTP clients, from an ecommerce catalog to pagination, forms, and login walls.
        </p>
        <p class="intro">
          Go ahead and scrape this site. Every page below has a known structure, robots.txt allows every
          path, and there's no rate limiting except on the one page built to demonstrate it. Nothing here is
          randomized between requests unless the page description says so.
        </p>
      </div>
      {MANIFEST.map((group, i) => (
        <section class="page-group">
          <header class="group-header">
            <span class="group-eyebrow">Section {String(i + 1).padStart(2, '0')}</span>
            <h2 class="group-title">
              <a href={`/${group.key}`}>{group.label}</a>
            </h2>
            <p>{group.description}</p>
          </header>
          {group.categories.map((cat) => (
            <CategorySection category={cat} />
          ))}
        </section>
      ))}
    </Layout>
  )
})
