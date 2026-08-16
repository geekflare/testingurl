import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CATEGORY_LIST, PRODUCTS, findProduct } from '../../lib/data'
import {
  JsonLd,
  dataLayerScript,
  faqJsonLd,
  itemListJsonLd,
  productAvailability,
  productBrand,
  productImageUrl,
  productJsonLd,
  productReviews,
  productSku,
  productUrl,
} from '../../lib/structuredData'

export const structuredData = new Hono()

// Every per-format demo page below uses the same product, so extraction
// results from each format are directly comparable against one another.
const DEMO_PRODUCT = findProduct(1)!
const DEMO_CATEGORY = CATEGORY_LIST.find((c) => c.key === DEMO_PRODUCT.category)!

function Crumb() {
  return (
    <p class="crumb">
      <a href="/scraping/structured-data">&laquo; Structured data</a>
    </p>
  )
}

function PlainProductFacts() {
  return (
    <>
      <h1>{DEMO_PRODUCT.name}</h1>
      <p class="product-price">${DEMO_PRODUCT.price.toFixed(2)}</p>
      <p>{DEMO_PRODUCT.description}</p>
      <p>
        SKU: <code>{productSku(DEMO_PRODUCT)}</code> &middot; Brand: {productBrand(DEMO_PRODUCT)} &middot;{' '}
        {DEMO_PRODUCT.stock > 0 ? 'In stock' : 'Out of stock'}
      </p>
    </>
  )
}

function MicrodataProductFacts() {
  return (
    <div itemscope itemtype="https://schema.org/Product">
      <h1 itemprop="name">{DEMO_PRODUCT.name}</h1>
      <img itemprop="image" src={productImageUrl()} alt="" width="120" />
      <p itemprop="description">{DEMO_PRODUCT.description}</p>
      <p>
        SKU: <span itemprop="sku">{productSku(DEMO_PRODUCT)}</span> &middot; Brand:{' '}
        <span itemprop="brand" itemscope itemtype="https://schema.org/Brand">
          <span itemprop="name">{productBrand(DEMO_PRODUCT)}</span>
        </span>
      </p>
      <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
        <p class="product-price">
          <span itemprop="priceCurrency" content="USD">
            $
          </span>
          <span itemprop="price" content={DEMO_PRODUCT.price.toFixed(2)}>
            {DEMO_PRODUCT.price.toFixed(2)}
          </span>
        </p>
        <link itemprop="availability" href={productAvailability(DEMO_PRODUCT)} />
        <link itemprop="url" href={productUrl(DEMO_PRODUCT)} />
        <p>{DEMO_PRODUCT.stock > 0 ? 'In stock' : 'Out of stock'}</p>
      </div>
      <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
        <span itemprop="ratingValue">{DEMO_PRODUCT.rating}</span>/<span itemprop="bestRating">5</span> (
        <span itemprop="reviewCount">{12 + ((DEMO_PRODUCT.id * 7) % 80)}</span> reviews)
      </div>
    </div>
  )
}

function OgHead() {
  return (
    <>
      <meta property="og:site_name" content="TestingURL.dev" />
      <meta property="og:type" content="product" />
      <meta property="og:title" content={DEMO_PRODUCT.name} />
      <meta property="og:description" content={DEMO_PRODUCT.description} />
      <meta property="og:image" content={productImageUrl()} />
      <meta property="og:url" content={productUrl(DEMO_PRODUCT)} />
      <meta property="product:price:amount" content={DEMO_PRODUCT.price.toFixed(2)} />
      <meta property="product:price:currency" content="USD" />
      <meta
        property="product:availability"
        content={DEMO_PRODUCT.stock > 0 ? 'in stock' : 'out of stock'}
      />
      <meta property="product:brand" content={productBrand(DEMO_PRODUCT)} />
    </>
  )
}

structuredData.get('/scraping/structured-data', (c) => {
  return c.html(
    <Layout
      title="Structured data & metadata"
      description="Product, collection, review, and FAQ pages built in the formats real sites use (JSON-LD, Microdata, Open Graph, and JS dataLayers), for testing structured-data extraction."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Structured data &amp; metadata</h1>
      <p class="intro">
        The same demo product (<a href={productUrl(DEMO_PRODUCT)}>{DEMO_PRODUCT.name}</a>) exposed through one
        machine-readable format at a time, plus a page with all of them at once. Useful for testing that an
        extractor reads every format correctly and that values agree across formats.
      </p>
      <ul class="index-list">
        <li>
          <span class="badge">easy</span> <a href="/scraping/structured-data/product-json-ld">Product — JSON-LD</a> —
          a single <code>&lt;script type="application/ld+json"&gt;</code> block, nothing else.
        </li>
        <li>
          <span class="badge">easy</span>{' '}
          <a href="/scraping/structured-data/product-microdata">Product — Microdata</a> — schema.org markup via{' '}
          <code>itemscope</code>/<code>itemprop</code> attributes on the visible HTML.
        </li>
        <li>
          <span class="badge">easy</span>{' '}
          <a href="/scraping/structured-data/product-open-graph">Product — Open Graph</a> — only{' '}
          <code>og:*</code> / <code>product:*</code> meta tags in <code>&lt;head&gt;</code>.
        </li>
        <li>
          <span class="badge">medium</span>{' '}
          <a href="/scraping/structured-data/product-datalayer">Product — dataLayer</a> — no markup at all. The data
          lives only in a GA4/GTM-style <code>window.dataLayer</code> push, so extraction requires running JS.
        </li>
        <li>
          <span class="badge">medium</span>{' '}
          <a href="/scraping/structured-data/product-combined">Product — combined</a> — JSON-LD, Microdata, Open
          Graph, and dataLayer all present on one page, like a real site accumulated over time.
        </li>
        <li>
          <span class="badge">easy</span> <a href="/scraping/structured-data/collection">Collection (ItemList)</a> —
          a category page exposed as a schema.org <code>CollectionPage</code>/<code>ItemList</code>.
        </li>
        <li>
          <span class="badge">easy</span> <a href="/scraping/structured-data/reviews">Product reviews</a> — visible
          reviews plus matching <code>Review</code>/<code>AggregateRating</code> JSON-LD.
        </li>
        <li>
          <span class="badge">easy</span> <a href="/scraping/structured-data/faq">FAQ page</a> — visible Q&amp;A
          marked up as a schema.org <code>FAQPage</code>.
        </li>
      </ul>
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/product-json-ld', (c) => {
  return c.html(
    <Layout
      title="Product — JSON-LD"
      description="A product page exposing data only via a schema.org/Product JSON-LD script: no Microdata, no Open Graph, no dataLayer."
    >
      <Crumb />
      <span class="badge">JSON-LD only</span>
      <PlainProductFacts />
      <JsonLd data={productJsonLd(DEMO_PRODUCT)} />
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/product-microdata', (c) => {
  return c.html(
    <Layout
      title="Product — Microdata"
      description="The same product exposed only via schema.org Microdata (itemscope/itemprop attributes), with no JSON-LD, Open Graph, or dataLayer."
    >
      <Crumb />
      <span class="badge">Microdata only</span>
      <MicrodataProductFacts />
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/product-open-graph', (c) => {
  return c.html(
    <Layout
      title="Product — Open Graph"
      description="The same product exposed only via Open Graph and product: meta tags in <head>. No JSON-LD, no Microdata, no dataLayer."
      head={<OgHead />}
    >
      <Crumb />
      <span class="badge">Open Graph only</span>
      <PlainProductFacts />
      <p class="intro">
        Check the response <code>&lt;head&gt;</code> for <code>og:*</code> and <code>product:*</code> meta tags.
        There's no other machine-readable data on this page.
      </p>
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/product-datalayer', (c) => {
  return c.html(
    <Layout
      title="Product — dataLayer"
      description="The same product pushed into window.dataLayer as a GA4/GTM ecommerce event. There's no schema.org markup at all, so extraction requires executing JS."
    >
      <Crumb />
      <span class="badge">dataLayer only</span>
      <PlainProductFacts />
      <p class="intro">
        No JSON-LD, Microdata, or Open Graph on this page: the structured data exists only as a{' '}
        <code>window.dataLayer.push(...)</code> call. Run <code>window.dataLayer</code> in a JS-capable client to
        read it.
      </p>
      <script dangerouslySetInnerHTML={{ __html: dataLayerScript(DEMO_PRODUCT) }} />
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/product-combined', (c) => {
  return c.html(
    <Layout
      title="Product — combined"
      description="The same product with JSON-LD, Microdata, Open Graph, and a dataLayer push all present at once, the way a real page accumulates markup over time."
      head={<OgHead />}
    >
      <Crumb />
      <span class="badge">All formats at once</span>
      <MicrodataProductFacts />
      <JsonLd data={productJsonLd(DEMO_PRODUCT, { withReviews: true })} />
      <script dangerouslySetInnerHTML={{ __html: dataLayerScript(DEMO_PRODUCT) }} />
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/collection', (c) => {
  const products = PRODUCTS.filter((p) => p.category === DEMO_CATEGORY.key)
  const categoryUrl = `/scraping/ecommerce/category/${DEMO_CATEGORY.key}`
  return c.html(
    <Layout
      title="Collection (ItemList)"
      description="A category listing page exposed as a schema.org CollectionPage with an ItemList of its products."
    >
      <Crumb />
      <h1>{DEMO_CATEGORY.label}</h1>
      <p class="intro">
        Exposed as a schema.org <code>CollectionPage</code> whose <code>mainEntity</code> is an{' '}
        <code>ItemList</code>. See the JSON-LD in the page source.
      </p>
      <ol>
        {products.map((p) => (
          <li>
            <a href={productUrl(p)}>{p.name}</a> — ${p.price.toFixed(2)}
          </li>
        ))}
      </ol>
      <JsonLd data={itemListJsonLd(DEMO_CATEGORY.label, categoryUrl, products)} />
    </Layout>
  )
})

structuredData.get('/scraping/structured-data/reviews', (c) => {
  const reviews = productReviews(DEMO_PRODUCT)
  return c.html(
    <Layout
      title="Product reviews"
      description="A product page with visible customer reviews plus matching Review and AggregateRating JSON-LD."
    >
      <Crumb />
      <h1>{DEMO_PRODUCT.name}</h1>
      <p class="product-price">${DEMO_PRODUCT.price.toFixed(2)}</p>
      <h2>Reviews</h2>
      {reviews.map((r) => (
        <div class="card" data-review-author={r.author} data-review-rating={r.rating}>
          <strong>{r.author}</strong> — {r.rating}/5
          <p>{r.body}</p>
        </div>
      ))}
      <JsonLd data={productJsonLd(DEMO_PRODUCT, { withReviews: true })} />
    </Layout>
  )
})

const FAQ_ITEMS = [
  {
    question: 'Is it OK to scrape this site?',
    answer: 'Yes, that is the entire point. robots.txt allows every path, and nothing here is rate-limited except the one endpoint built to demonstrate rate limiting.',
  },
  {
    question: 'Does the data change between requests?',
    answer: 'No. Every page on this site returns deterministic content, so you can assert on exact values in tests.',
  },
  {
    question: 'Can I use this site in an automated test suite?',
    answer: 'Yes. It is designed to be a stable target for scrapers, crawlers, and browser-automation test suites.',
  },
  {
    question: 'Where do I report a bug or request a new test page?',
    answer: 'Reach out via the contact page; email or phone both work.',
  },
]

structuredData.get('/scraping/structured-data/faq', (c) => {
  return c.html(
    <Layout
      title="FAQ page"
      description="A page of common questions and answers marked up as a schema.org FAQPage."
    >
      <Crumb />
      <h1>Frequently asked questions</h1>
      {FAQ_ITEMS.map((qa) => (
        <div class="card">
          <h3>{qa.question}</h3>
          <p>{qa.answer}</p>
        </div>
      ))}
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
    </Layout>
  )
})
