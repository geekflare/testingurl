import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const crawlerDirectives = new Hono()

crawlerDirectives.get('/scraping/crawler-directives', (c) => {
  return c.html(
    <Layout
      title="Canonical tags & meta robots directives"
      description="Canonical tag scenarios (self-referencing, duplicate, conflicting, cross-domain) and page-level robots directives (noindex, nofollow, noarchive) via both a meta tag and the X-Robots-Tag HTTP header."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Canonical tags &amp; meta robots directives</h1>
      <p class="intro">
        <code>robots.txt</code> controls whether a crawler fetches a page at all. These two mechanisms work at
        the page level instead, after a page has already been fetched: a canonical tag says which URL a piece
        of content should be attributed to, and a robots directive says what to do with this specific page once
        it's been read.
      </p>

      <h2>Canonical tags</h2>
      <ul class="index-list">
        <li>
          <a href="/scraping/crawler-directives/canonical-self">Self-referencing</a> &mdash; the recommended
          default: a page's canonical points at itself
        </li>
        <li>
          <a href="/scraping/crawler-directives/canonical-duplicate-a">Duplicate content, page A</a> and{' '}
          <a href="/scraping/crawler-directives/canonical-duplicate-b">page B</a> &mdash; two different URLs,
          both canonical to A
        </li>
        <li>
          <a href="/scraping/crawler-directives/canonical-conflict">Tag vs. header conflict</a> &mdash; the{' '}
          <code>&lt;link&gt;</code> tag names one URL, the HTTP <code>Link</code> header names another
        </li>
        <li>
          <a href="/scraping/crawler-directives/canonical-cross-domain">Cross-domain</a> &mdash; canonical
          points at a URL on a different domain entirely
        </li>
      </ul>

      <h2>Meta robots &amp; X-Robots-Tag</h2>
      <ul class="index-list">
        <li>
          <a href="/scraping/crawler-directives/meta-noindex">noindex, follow</a> &mdash; keep this page out of
          the index, but still crawl its links
        </li>
        <li>
          <a href="/scraping/crawler-directives/meta-nofollow">index, nofollow</a> &mdash; index this page, but
          don't follow its outbound links
        </li>
        <li>
          <a href="/scraping/crawler-directives/x-robots-header">X-Robots-Tag header</a> &mdash; the same{' '}
          <code>noindex</code> directive, delivered as an HTTP response header instead of a meta tag (the only
          option for non-HTML resources like PDFs and images)
        </li>
        <li>
          <a href="/scraping/crawler-directives/meta-noarchive-nosnippet">noarchive, nosnippet</a> &mdash; index
          this page, but don't cache a copy of it or show a snippet in search results
        </li>
      </ul>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/canonical-self', (c) => {
  return c.html(
    <Layout
      title="Canonical: self-referencing"
      description="A self-referencing canonical tag, the recommended default for a URL that has no duplicates."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/crawler-directives/canonical-self" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Canonical: self-referencing</h1>
      <p>
        This page's <code>&lt;link rel="canonical"&gt;</code> points at its own URL, using an absolute address.
        This is the recommended default for any page that doesn't have duplicates: it costs nothing and removes
        any ambiguity, even though a page with no duplicate is technically fine without one at all.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/canonical-duplicate-a', (c) => {
  return c.html(
    <Layout
      title="Canonical: duplicate content, page A"
      description="The preferred URL in a duplicate-content pair. Its own canonical points at itself; the duplicate at page B points here."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/crawler-directives/canonical-duplicate-a" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Canonical: duplicate content, page A</h1>
      <p>
        This is the preferred URL. Its canonical tag points at itself. A separate page,{' '}
        <a href="/scraping/crawler-directives/canonical-duplicate-b">page B</a>, is a genuinely different URL
        with the same content, and its canonical points back here instead of at itself, consolidating both
        under this one address.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/canonical-duplicate-b', (c) => {
  return c.html(
    <Layout
      title="Canonical: duplicate content, page B"
      description="A duplicate of page A at a different URL. Its canonical tag points at page A, not at itself."
      head={<link rel="canonical" href="https://testingurl.dev/scraping/crawler-directives/canonical-duplicate-a" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Canonical: duplicate content, page B</h1>
      <p>
        This is a real, independently-fetchable URL with the same content as{' '}
        <a href="/scraping/crawler-directives/canonical-duplicate-a">page A</a>. Its own canonical tag doesn't
        point at itself. It points at page A, marking that URL as the one to index and this one as a duplicate.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/canonical-conflict', (c) => {
  const tagHref = 'https://testingurl.dev/scraping/crawler-directives/canonical-conflict'
  const headerHref = 'https://testingurl.dev/scraping/crawler-directives/canonical-self'
  c.header('Link', `<${headerHref}>; rel="canonical"`)
  return c.html(
    <Layout
      title="Canonical: tag vs. header conflict"
      description="The <link rel=canonical> tag names one URL and the HTTP Link header names a different one, an edge case crawlers resolve inconsistently."
      head={<link rel="canonical" href={tagHref} />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Canonical: tag vs. header conflict</h1>
      <p>A canonical URL can be declared two ways: an HTML tag, or an HTTP response header. This page sets both, and they disagree.</p>
      <table>
        <tbody>
          <tr>
            <td>
              <code>&lt;link rel="canonical"&gt;</code> tag says
            </td>
            <td>
              <code>{tagHref}</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Link</code> HTTP header says
            </td>
            <td>
              <code>{headerHref}</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        There's no universal rule for which one wins. Worth checking how whatever tool you're building handles
        it, and documenting the choice, rather than assuming one source is authoritative.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/canonical-cross-domain', (c) => {
  return c.html(
    <Layout
      title="Canonical: cross-domain"
      description="A canonical tag pointing at a URL on an entirely different domain, the pattern used for syndicated or cross-posted content."
      head={<link rel="canonical" href="https://example.com/original-article" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Canonical: cross-domain</h1>
      <p>
        This page's canonical tag points at <code>https://example.com/original-article</code>, a different
        domain entirely. This is the pattern for syndicated or cross-posted content: this copy exists here for
        readers, but the canonical tag tells a crawler the content's real home is elsewhere, so credit and
        indexing go there instead of here.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/meta-noindex', (c) => {
  return c.html(
    <Layout
      title="Meta robots: noindex, follow"
      description="A <meta name=robots content='noindex, follow'> tag: keep this page out of the search index, but still crawl and follow its outbound links."
      head={<meta name="robots" content="noindex, follow" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Meta robots: noindex, follow</h1>
      <p>
        This page sets <code>&lt;meta name="robots" content="noindex, follow"&gt;</code>. A compliant crawler
        shouldn't add this specific page to a search index, but should still follow its links and crawl what
        they point to, such as{' '}
        <a href="/scraping/crawler-directives/canonical-self">this page</a>.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/meta-nofollow', (c) => {
  return c.html(
    <Layout
      title="Meta robots: index, nofollow"
      description="A <meta name=robots content='index, nofollow'> tag: index this page, but don't follow any of its outbound links."
      head={<meta name="robots" content="index, nofollow" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Meta robots: index, nofollow</h1>
      <p>
        This page sets <code>&lt;meta name="robots" content="index, nofollow"&gt;</code>. A compliant crawler
        should index this page's own content, but treat every link below as a dead end rather than a lead to
        follow.
      </p>
      <ul>
        <li>
          <a href="/scraping/crawler-directives/canonical-self">Canonical self-reference</a>
        </li>
        <li>
          <a href="/scraping/crawler-directives/meta-noindex">noindex, follow</a>
        </li>
      </ul>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/x-robots-header', (c) => {
  c.header('X-Robots-Tag', 'noindex, nofollow')
  return c.html(
    <Layout
      title="X-Robots-Tag header"
      description="The same noindex, nofollow directive as a meta tag, delivered instead as an X-Robots-Tag HTTP response header, the only option for non-HTML resources."
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>X-Robots-Tag header</h1>
      <p>
        This response carries an <code>X-Robots-Tag: noindex, nofollow</code> HTTP header instead of a meta
        tag. It has the same meaning as the meta-tag equivalents above, but it works on any response, not just
        HTML: a PDF, an image, or a JSON file can't carry a <code>&lt;meta&gt;</code> tag, but they can carry
        this header. Check this page's response headers to see it.
      </p>
    </Layout>
  )
})

crawlerDirectives.get('/scraping/crawler-directives/meta-noarchive-nosnippet', (c) => {
  return c.html(
    <Layout
      title="Meta robots: noarchive, nosnippet"
      description="A <meta name=robots content='noarchive, nosnippet'> tag: index this page normally, but don't cache a visible copy of it or show a snippet in search results."
      head={<meta name="robots" content="noarchive, nosnippet" />}
    >
      <p class="crumb">
        <a href="/scraping/crawler-directives">&laquo; Canonical tags &amp; meta robots directives</a>
      </p>
      <h1>Meta robots: noarchive, nosnippet</h1>
      <p>
        This page sets <code>&lt;meta name="robots" content="noarchive, nosnippet"&gt;</code>. Unlike{' '}
        <code>noindex</code>, this page is still eligible to appear in search results at all: these two
        directives just say don't keep a cached copy visible to users, and don't show a text preview alongside
        the result.
      </p>
    </Layout>
  )
})
