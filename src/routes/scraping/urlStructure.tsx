import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const urlStructure = new Hono()

urlStructure.get('/scraping/url-structure', (c) => {
  return c.html(
    <Layout
      title="URL structure & normalization"
      description="Trailing slashes, case sensitivity, query parameter order, tracking params, and the <base> tag: the mechanics behind duplicate-content URLs."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>URL structure &amp; normalization</h1>
      <p class="intro">
        Two different URLs that serve the same content are a classic duplicate-content problem. These pages
        demonstrate the mechanics behind it: which URL variants this server actually treats as distinct
        resources, and how a canonical tag can point crawlers at the one that matters.
      </p>

      <ul class="index-list">
        <li>
          <a href="/scraping/url-structure/trailing-slash">Trailing slash</a> &mdash; the same content at two
          URLs, one canonical to the other
        </li>
        <li>
          <a href="/scraping/url-structure/CaseSensitive">Case sensitivity</a> &mdash; URL paths are
          case-sensitive here, unlike a Windows filesystem
        </li>
        <li>
          <a href="/scraping/url-structure/query-params?b=2&amp;a=1">Query parameter order &amp; tracking params</a>{' '}
          &mdash; a canonical tag that normalizes both
        </li>
        <li>
          <a href="/scraping/url-structure/encoded-chars?value=hello%20world">Encoded characters</a> &mdash;{' '}
          <code>%20</code> vs <code>+</code> vs a raw space
        </li>
        <li>
          <a href="/scraping/url-structure/base-tag">The &lt;base&gt; tag</a> &mdash; changes what a relative link
          on the page actually resolves to
        </li>
      </ul>
    </Layout>
  )
})

urlStructure.get('/scraping/url-structure/trailing-slash', (c) => {
  return c.html(
    <Layout
      title="Trailing slash"
      description="The same content served at two URLs, one with a trailing slash and one without, with a canonical tag pointing at the preferred form."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/url-structure/trailing-slash" />}
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>Trailing slash</h1>
      <p>
        You're at <code>/scraping/url-structure/trailing-slash</code> (no trailing slash). This is the
        preferred, canonical form, and this page's own <code>&lt;link rel="canonical"&gt;</code> points at
        itself.
      </p>
      <p>
        The same content is also served, deliberately, at{' '}
        <a href="/scraping/url-structure/trailing-slash/">/scraping/url-structure/trailing-slash/</a> (with a
        trailing slash). That page's canonical tag points back here, rather than at itself, so a crawler that
        respects canonicals should consolidate both under this URL.
      </p>
    </Layout>
  )
})

urlStructure.get('/scraping/url-structure/trailing-slash/', (c) => {
  return c.html(
    <Layout
      title="Trailing slash (duplicate)"
      description="The trailing-slash duplicate of /scraping/url-structure/trailing-slash. Its canonical tag points at the no-slash version."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/url-structure/trailing-slash" />}
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>Trailing slash (duplicate)</h1>
      <p>
        You're at <code>/scraping/url-structure/trailing-slash/</code> (with a trailing slash), a genuinely
        separate route on this server from{' '}
        <a href="/scraping/url-structure/trailing-slash">/scraping/url-structure/trailing-slash</a> (no
        trailing slash). Both return this same content, but this page's canonical tag names the no-slash
        version as the one to index.
      </p>
    </Layout>
  )
})

urlStructure.get('/scraping/url-structure/CaseSensitive', (c) => {
  return c.html(
    <Layout
      title="Case sensitivity"
      description="URL paths on this server are case-sensitive: /CaseSensitive and /casesensitive are different resources, and only one of them exists."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/url-structure/CaseSensitive" />}
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>Case sensitivity</h1>
      <p>
        This page is registered at exactly <code>/scraping/url-structure/CaseSensitive</code>, mixed case. HTTP
        paths are case-sensitive by spec, and this server enforces that: only the exact casing above resolves.
      </p>
      <p>
        A link elsewhere on the site pointing at this page with the wrong casing (say,{' '}
        <a href="/scraping/url-structure/casesensitive">/scraping/url-structure/casesensitive</a>, all
        lowercase) doesn't get silently normalized. It 404s, as a genuinely different, nonexistent resource.
        Try that link: it's a real 404, not a redirect.
      </p>
    </Layout>
  )
})

const TRACKING_PARAMS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'ref', 'sessionid', 'fbclid', 'gclid'])

urlStructure.get('/scraping/url-structure/query-params', (c) => {
  const url = new URL(c.req.url)
  const allParams = [...url.searchParams.entries()]
  const meaningfulParams = allParams.filter(([key]) => !TRACKING_PARAMS.has(key)).sort(([a], [b]) => a.localeCompare(b))
  const trackingParams = allParams.filter(([key]) => TRACKING_PARAMS.has(key))

  const canonicalUrl = new URL(url.pathname, url.origin)
  for (const [key, value] of meaningfulParams) canonicalUrl.searchParams.append(key, value)

  return c.html(
    <Layout
      title="Query parameter order & tracking params"
      description="A canonical tag that normalizes query parameter order and strips known tracking parameters, so ?a=1&b=2 and ?b=2&a=1&utm_source=x resolve to the same canonical URL."
      head={<link rel="canonical" href={canonicalUrl.toString()} />}
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>Query parameter order &amp; tracking params</h1>
      <p>
        Two URLs with the same query parameters in a different order, or with tracking parameters like{' '}
        <code>utm_source</code> tacked on, are the same resource, not duplicates. This page computes its own
        canonical URL from the current request: parameters are sorted, and known tracking parameters (
        {[...TRACKING_PARAMS].join(', ')}) are stripped entirely.
      </p>
      <table>
        <tbody>
          <tr>
            <td>Requested URL</td>
            <td>
              <code>{url.pathname + url.search}</code>
            </td>
          </tr>
          <tr>
            <td>Meaningful params (sorted)</td>
            <td>
              <code>{meaningfulParams.length ? meaningfulParams.map(([k, v]) => `${k}=${v}`).join('&') : '(none)'}</code>
            </td>
          </tr>
          <tr>
            <td>Tracking params stripped</td>
            <td>
              <code>{trackingParams.length ? trackingParams.map(([k, v]) => `${k}=${v}`).join('&') : '(none)'}</code>
            </td>
          </tr>
          <tr>
            <td>Computed canonical URL</td>
            <td>
              <code>{canonicalUrl.toString()}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Try it with different orderings and extra tracking params:{' '}
        <a href="/scraping/url-structure/query-params?b=2&amp;a=1">?b=2&amp;a=1</a>,{' '}
        <a href="/scraping/url-structure/query-params?a=1&amp;b=2&amp;utm_source=newsletter">
          ?a=1&amp;b=2&amp;utm_source=newsletter
        </a>
        . All three should compute the same canonical URL.
      </p>
    </Layout>
  )
})

urlStructure.get('/scraping/url-structure/encoded-chars', (c) => {
  const url = new URL(c.req.url)
  const rawQueryString = url.search
  const decodedValue = c.req.query('value') ?? '(not set)'

  return c.html(
    <Layout
      title="Encoded characters"
      description="How this server sees the raw, still-encoded query string versus the decoded value: %20, +, and a literal space all mean different things depending on where they came from."
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>Encoded characters</h1>
      <p>
        A browser encodes a space in a URL as <code>%20</code>. A GET form submission encodes it as{' '}
        <code>+</code> instead (the <code>application/x-www-form-urlencoded</code> convention). Both decode to
        the same value, but a scraper reading the raw query string needs to know which encoding it's looking
        at.
      </p>
      <table>
        <tbody>
          <tr>
            <td>Raw query string received</td>
            <td>
              <code>{rawQueryString || '(none)'}</code>
            </td>
          </tr>
          <tr>
            <td>Decoded value of "value"</td>
            <td>
              <code>{decodedValue}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Try each encoding: <a href="/scraping/url-structure/encoded-chars?value=hello%20world">%20</a>,{' '}
        <a href="/scraping/url-structure/encoded-chars?value=hello+world">+</a>, or submit the form below (which
        the browser encodes for you):
      </p>
      <form class="test-form" method="get" action="/scraping/url-structure/encoded-chars">
        <label for="value">Value</label>
        <input type="text" id="value" name="value" value="hello world" />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  )
})

urlStructure.get('/scraping/url-structure/base-tag', (c) => {
  return c.html(
    <Layout
      title="The <base> tag"
      description="A <base href> pointing one directory level above this page's own URL, so a relative link on the page resolves somewhere a scraper wouldn't expect from the URL alone."
      head={<base href="https://testingurl.dev/scraping/" />}
    >
      <p class="crumb">
        <a href="/scraping/url-structure">&laquo; URL structure &amp; normalization</a>
      </p>
      <h1>
        The <code>&lt;base&gt;</code> tag
      </h1>
      <p>
        This page lives at <code>/scraping/url-structure/base-tag</code>, but its <code>&lt;head&gt;</code>{' '}
        sets <code>&lt;base href="https://testingurl.dev/scraping/"&gt;</code>, one directory level above where
        the page actually is. Every relative link and image on the page resolves against that base, not the
        page's own URL. A scraper that resolves relative links against the page URL while ignoring{' '}
        <code>&lt;base&gt;</code> computes the wrong target.
      </p>
      <p>
        This link's raw <code>href</code> attribute is just <code>ecommerce</code>:
      </p>
      <p>
        <a href="ecommerce">ecommerce</a>
      </p>
      <p>
        Resolved against this page's own URL, that would be <code>/scraping/url-structure/ecommerce</code>{' '}
        (doesn't exist). Resolved correctly against <code>&lt;base&gt;</code>, it's{' '}
        <code>/scraping/ecommerce</code>, the real store front. Follow the link and see where it actually goes.
      </p>
    </Layout>
  )
})
