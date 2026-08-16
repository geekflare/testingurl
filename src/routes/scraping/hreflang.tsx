import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const hreflang = new Hono()

interface LangVariant {
  code: string
  label: string
  greeting: string
}

const VARIANTS: LangVariant[] = [
  { code: 'en', label: 'English', greeting: 'Hello, and welcome.' },
  { code: 'es', label: 'Spanish', greeting: 'Hola, y bienvenido.' },
  { code: 'fr', label: 'French', greeting: 'Bonjour, et bienvenue.' },
]

function hreflangLinks(current: string) {
  const base = 'https://testingurl.dev/scraping/hreflang'
  return (
    <>
      {VARIANTS.map((v) => (
        <link rel="alternate" hreflang={v.code} href={`${base}/${v.code}`} />
      ))}
      <link rel="alternate" hreflang="x-default" href={`${base}/en`} />
    </>
  )
}

hreflang.get('/scraping/hreflang', (c) => {
  return c.html(
    <Layout
      title="hreflang"
      description="Three language variants of the same page, each carrying reciprocal <link rel=alternate hreflang> tags to the other two, itself, and an x-default."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>hreflang</h1>
      <p class="intro">
        <code>hreflang</code> tells a crawler that several URLs are language or region variants of the same
        page, so it can serve the right one to the right reader instead of treating them as duplicate content.
        The rule that trips people up: every variant has to link to <em>all</em> the others, including itself,
        or the tags aren't considered valid.
      </p>

      <ul class="index-list">
        {VARIANTS.map((v) => (
          <li>
            <a href={`/scraping/hreflang/${v.code}`}>{v.label}</a> &mdash; <code>hreflang="{v.code}"</code>
          </li>
        ))}
      </ul>
      <p>
        Each variant also declares an <code>x-default</code>, the fallback for a reader whose language doesn't
        match any listed variant.
      </p>
    </Layout>
  )
})

for (const variant of VARIANTS) {
  hreflang.get(`/scraping/hreflang/${variant.code}`, (c) => {
    return c.html(
      <Layout
        title={`hreflang: ${variant.label}`}
        description={`The ${variant.label} variant of this page, linking to all other language variants via reciprocal hreflang tags.`}
        head={hreflangLinks(variant.code)}
      >
        <p class="crumb">
          <a href="/scraping/hreflang">&laquo; hreflang</a>
        </p>
        <h1>{variant.label}</h1>
        <p>{variant.greeting}</p>
        <p>
          This page's <code>&lt;head&gt;</code> declares <code>hreflang="{variant.code}"</code> for itself, plus
          reciprocal <code>&lt;link rel="alternate"&gt;</code> tags to every other variant and an{' '}
          <code>x-default</code>. View source to see all {VARIANTS.length + 1} tags.
        </p>
        <ul class="index-list">
          {VARIANTS.filter((v) => v.code !== variant.code).map((v) => (
            <li>
              <a href={`/scraping/hreflang/${v.code}`}>{v.label}</a>
            </li>
          ))}
        </ul>
      </Layout>
    )
  })
}
