import { Context, Hono } from 'hono'
import { Layout } from '../lib/layout'
import { MANIFEST } from '../lib/manifest'
import { CategorySection } from '../lib/categoryList'

export const groupPages = new Hono()

function renderGroup(groupKey: string) {
  return (c: Context) => {
    const group = MANIFEST.find((g) => g.key === groupKey)
    if (!group) return c.notFound()
    return c.html(
      <Layout title={group.label} description={group.description}>
        <p class="crumb">
          <a href="/">&laquo; All test pages</a>
        </p>
        <h1>{group.label}</h1>
        <p class="intro">{group.description}</p>
        {group.categories.map((cat) => (
          <CategorySection category={cat} />
        ))}
      </Layout>
    )
  }
}

// One explicit route per manifest group. Keeps this file the single place
// that has to change if a group's key ever changes, and avoids a wildcard
// route that could shadow literal paths like /robots.txt.
groupPages.get('/scraping', renderGroup('scraping'))
groupPages.get('/http', renderGroup('http'))
groupPages.get('/mock-data', renderGroup('mock-data'))
groupPages.get('/generator', renderGroup('generator'))
groupPages.get('/ai', renderGroup('ai'))
