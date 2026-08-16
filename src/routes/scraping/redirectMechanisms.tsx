import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const redirectMechanisms = new Hono()

redirectMechanisms.get('/scraping/redirect-mechanisms', (c) => {
  return c.html(
    <Layout
      title="Redirect mechanisms"
      description="Redirects that don't use a real HTTP 3xx status code: a meta refresh tag, a JavaScript redirect, and a genuine infinite loop for testing loop-detection logic."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Redirect mechanisms</h1>
      <p class="intro">
        <a href="/http/redirect/3">/http/redirect</a> covers real HTTP 3xx status codes, the mechanism every
        HTTP client follows automatically. These pages cover the other ways a page can send a visitor
        elsewhere, each requiring different handling from a scraper.
      </p>

      <ul class="index-list">
        <li>
          <a href="/scraping/redirect-mechanisms/meta-refresh">Meta refresh</a> &mdash; a{' '}
          <code>&lt;meta http-equiv="refresh"&gt;</code> tag; the server always returns 200, only a
          refresh-aware client moves on
        </li>
        <li>
          <a href="/scraping/redirect-mechanisms/js-redirect">JavaScript redirect</a> &mdash;{' '}
          <code>window.location</code> set from a script; invisible to any scraper that doesn't execute JS
        </li>
        <li>
          <a href="/scraping/redirect-mechanisms/loop/a">Infinite redirect loop</a> &mdash; two real HTTP 302s
          that point at each other forever, on purpose
        </li>
      </ul>
    </Layout>
  )
})

redirectMechanisms.get('/scraping/redirect-mechanisms/meta-refresh', (c) => {
  return c.html(
    <Layout
      title="Meta refresh"
      description="A <meta http-equiv=refresh> tag that sends the browser to a new URL after 2 seconds. The server response itself is a plain 200, not a redirect."
      head={<meta http-equiv="refresh" content="2;url=/scraping/redirect-mechanisms/meta-refresh/landed" />}
    >
      <p class="crumb">
        <a href="/scraping/redirect-mechanisms">&laquo; Redirect mechanisms</a>
      </p>
      <h1>Meta refresh</h1>
      <p>
        This response is a plain HTTP 200, not a 3xx redirect. Its <code>&lt;head&gt;</code> carries{' '}
        <code>&lt;meta http-equiv="refresh" content="2;url=/scraping/redirect-mechanisms/meta-refresh/landed"&gt;</code>
        , which tells a browser to navigate to that URL after 2 seconds. A scraper that only follows real HTTP
        redirects will read this page's content and stop here. A browser will move on in a moment.
      </p>
    </Layout>
  )
})

redirectMechanisms.get('/scraping/redirect-mechanisms/meta-refresh/landed', (c) => {
  return c.html(
    <Layout title="Meta refresh · landed">
      <p class="crumb">
        <a href="/scraping/redirect-mechanisms">&laquo; Redirect mechanisms</a>
      </p>
      <h1 id="landed">You've landed</h1>
      <p>You arrived here via a meta refresh, not an HTTP redirect.</p>
    </Layout>
  )
})

const JS_REDIRECT_SCRIPT = `
  setTimeout(function () {
    window.location.href = '/scraping/redirect-mechanisms/js-redirect/landed';
  }, 1500);
`

redirectMechanisms.get('/scraping/redirect-mechanisms/js-redirect', (c) => {
  return c.html(
    <Layout
      title="JavaScript redirect"
      description="A redirect performed by client-side JavaScript setting window.location, invisible to any scraper that doesn't execute the page's scripts."
      head={<script dangerouslySetInnerHTML={{ __html: JS_REDIRECT_SCRIPT }} />}
    >
      <p class="crumb">
        <a href="/scraping/redirect-mechanisms">&laquo; Redirect mechanisms</a>
      </p>
      <h1>JavaScript redirect</h1>
      <p>
        This response is a plain HTTP 200 with no meta refresh either. A script on the page sets{' '}
        <code>window.location.href</code> after 1.5 seconds. A scraper that fetches raw HTML without executing
        JavaScript never sees this happen and has no way to know a redirect was intended at all.
      </p>
    </Layout>
  )
})

redirectMechanisms.get('/scraping/redirect-mechanisms/js-redirect/landed', (c) => {
  return c.html(
    <Layout title="JavaScript redirect · landed">
      <p class="crumb">
        <a href="/scraping/redirect-mechanisms">&laquo; Redirect mechanisms</a>
      </p>
      <h1 id="landed">You've landed</h1>
      <p>You arrived here via a JavaScript redirect, not an HTTP redirect or a meta refresh.</p>
    </Layout>
  )
})

redirectMechanisms.get('/scraping/redirect-mechanisms/loop/a', (c) => {
  return c.redirect('/scraping/redirect-mechanisms/loop/b', 302)
})

redirectMechanisms.get('/scraping/redirect-mechanisms/loop/b', (c) => {
  return c.redirect('/scraping/redirect-mechanisms/loop/a', 302)
})
