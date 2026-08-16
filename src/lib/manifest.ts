export interface PageEntry {
  path: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface CategoryEntry {
  key: string
  label: string
  description: string
  pages: PageEntry[]
}

export interface GroupEntry {
  key: string
  label: string
  description: string
  categories: CategoryEntry[]
}

export const MANIFEST: GroupEntry[] = [
  {
    key: 'scraping',
    label: 'Web Scraping',
    description:
      'A web scraping test site with known, predictable markup — practice pages for crawlers, scrapers, and browser automation, from a full ecommerce catalog to pagination, forms, and login walls.',
    categories: [
      {
        key: 'ecommerce',
        label: 'Ecommerce catalog',
        description:
          'A fake ecommerce store to scrape — category listings down to individual product detail pages, the classic web-scraping example.',
        pages: [
          { path: '/scraping/ecommerce', title: 'Store home', description: 'Browse every product category in the fake store.', difficulty: 'easy' },
          { path: '/scraping/ecommerce/category/laptops', title: 'Category listing', description: 'Products within one category, each linking to its own detail page.', difficulty: 'easy' },
          { path: '/scraping/ecommerce/product/1', title: 'Product detail page', description: 'Full product page with price, rating, stock, and related items — a realistic ecommerce scraping target.', difficulty: 'easy' },
        ],
      },
      {
        key: 'structured-data',
        label: 'Structured data & metadata',
        description:
          'Machine-readable product, collection, and business data in the formats real sites use — JSON-LD, Microdata, Open Graph, and JS dataLayers.',
        pages: [
          { path: '/scraping/structured-data', title: 'Format overview', description: 'The same demo product in every format below, for comparing extraction results.', difficulty: 'easy' },
          { path: '/scraping/structured-data/product-json-ld', title: 'Product — JSON-LD', description: 'Product data exposed only via a schema.org/Product JSON-LD script.', difficulty: 'easy' },
          { path: '/scraping/structured-data/product-microdata', title: 'Product — Microdata', description: 'Same product, marked up with schema.org Microdata (itemscope/itemprop) instead of JSON-LD.', difficulty: 'easy' },
          { path: '/scraping/structured-data/product-open-graph', title: 'Product — Open Graph', description: 'Same product, exposed only via Open Graph / product: meta tags in <head>.', difficulty: 'easy' },
          { path: '/scraping/structured-data/product-datalayer', title: 'Product — dataLayer', description: 'Same product pushed into window.dataLayer as a GA4/GTM ecommerce event — no markup, JS execution required.', difficulty: 'medium' },
          { path: '/scraping/structured-data/product-combined', title: 'Product — combined', description: 'JSON-LD, Microdata, Open Graph, and dataLayer all present at once — a realistic messy page.', difficulty: 'medium' },
          { path: '/scraping/structured-data/collection', title: 'Collection (ItemList)', description: 'A category page exposed as a schema.org CollectionPage/ItemList.', difficulty: 'easy' },
          { path: '/scraping/structured-data/reviews', title: 'Product reviews', description: 'A product with visible reviews plus Review/AggregateRating JSON-LD.', difficulty: 'easy' },
          { path: '/scraping/structured-data/faq', title: 'FAQ page', description: 'Common questions marked up as a schema.org FAQPage.', difficulty: 'easy' },
          { path: '/contact', title: 'Contact page', description: 'Email, phone, and address as plain text, mailto:/tel: links, Microdata, and Organization JSON-LD.', difficulty: 'easy' },
        ],
      },
      {
        key: 'pagination',
        label: 'Pagination',
        description: 'Different pagination patterns for practicing crawling multi-page listings.',
        pages: [
          { path: '/scraping/pagination/page/1', title: 'Numbered pagination', description: 'Classic ?page=N style listing, 10 items per page.', difficulty: 'easy' },
          { path: '/scraping/pagination/offset?start=0&limit=10', title: 'Offset/limit pagination', description: 'Query-param offset/limit pagination.', difficulty: 'easy' },
          { path: '/scraping/load-more', title: 'Load more button', description: 'Fetches additional items via a JSON API on button click.', difficulty: 'medium' },
          { path: '/scraping/infinite-scroll', title: 'Infinite scroll', description: 'Loads more items automatically as you scroll.', difficulty: 'medium' },
        ],
      },
      {
        key: 'rendering',
        label: 'Rendering modes',
        description: 'Content delivered differently: server-rendered vs. client-rendered.',
        pages: [
          { path: '/scraping/js-rendered', title: 'JS-rendered content', description: 'Empty shell on load; content is injected via a client-side fetch. Requires a JS-capable scraper.', difficulty: 'hard' },
          { path: '/scraping/frames', title: 'Frames & iFrames', description: 'Content nested inside an iframe pointing at a separate URL, two levels deep. Find the real page and fetch it directly.', difficulty: 'hard' },
        ],
      },
      {
        key: 'tables',
        label: 'Tables',
        description: 'Tabular data in a few different shapes.',
        pages: [
          { path: '/scraping/tables/simple', title: 'Simple table', description: 'A single flat product table.', difficulty: 'easy' },
          { path: '/scraping/tables/sortable', title: 'Sortable table', description: 'Client-navigable sortable columns via ?sort=&dir= query params.', difficulty: 'medium' },
          { path: '/scraping/tables/nested', title: 'Nested/merged cells', description: 'Table grouped by category using rowspan.', difficulty: 'hard' },
        ],
      },
      {
        key: 'forms',
        label: 'Forms',
        description: 'Forms with varying complexity and hidden fields.',
        pages: [
          { path: '/scraping/forms/basic', title: 'Basic GET form', description: 'Simple search form, submits via GET.', difficulty: 'easy' },
          { path: '/scraping/forms/post', title: 'POST form', description: 'Form submission via POST with a confirmation page.', difficulty: 'easy' },
          { path: '/scraping/forms/multi-step', title: 'Multi-step form', description: 'Three-step wizard using a session cookie to persist state.', difficulty: 'hard' },
          { path: '/scraping/forms/file-upload', title: 'File upload', description: 'Upload form with a file input.', difficulty: 'medium' },
          { path: '/scraping/forms/hidden-fields', title: 'Hidden & honeypot fields', description: 'Form with a CSRF token and a bot-trap honeypot field that must stay empty.', difficulty: 'hard' },
        ],
      },
      {
        key: 'auth',
        label: 'Authentication',
        description: 'Cookie/session-based login wall.',
        pages: [
          { path: '/scraping/auth/login', title: 'Login page', description: 'Sets a session cookie on successful login (user: demo / pass: demo).', difficulty: 'medium' },
          { path: '/scraping/auth/dashboard', title: 'Protected dashboard', description: 'Redirects to /login unless a valid session cookie is present.', difficulty: 'medium' },
          { path: '/scraping/auth/logout', title: 'Logout', description: 'Clears the session cookie.', difficulty: 'easy' },
        ],
      },
      {
        key: 'links',
        label: 'Link graphs',
        description: 'Crawling practice: pages for testing crawlers and link-following logic — redirect chains, loops, and intentional dead ends.',
        pages: [
          { path: '/scraping/links/redirect-chain/5', title: 'Redirect chain', description: 'Follows N sequential redirects before landing. Try /redirect-chain/{n}.', difficulty: 'medium' },
          { path: '/scraping/links/circular', title: 'Circular links', description: 'Three pages that link back to each other in a loop.', difficulty: 'medium' },
          { path: '/scraping/links/broken', title: 'Broken links', description: 'A page mixing valid links with intentional 404s.', difficulty: 'easy' },
        ],
      },
      {
        key: 'markup',
        label: 'Markup difficulty levels',
        description: 'The same product data rendered with progressively messier HTML.',
        pages: [
          { path: '/scraping/markup/clean', title: 'Clean semantic HTML', description: 'Well-structured HTML with meaningful classes.', difficulty: 'easy' },
          { path: '/scraping/markup/div-soup', title: 'Div soup', description: 'Same content, all divs/spans, no semantic tags or classes.', difficulty: 'medium' },
          { path: '/scraping/markup/obfuscated', title: 'Obfuscated classes', description: 'Same content, hashed/randomized-looking class names.', difficulty: 'hard' },
          { path: '/scraping/markup/data-attrs', title: 'Data-attribute hooks', description: 'Same content, data extracted via data-* attributes rather than classes.', difficulty: 'medium' },
        ],
      },
    ],
  },
  {
    key: 'http',
    label: 'HTTP & Networking',
    description: 'httpbin-style endpoints for testing HTTP clients, status codes, and headers directly.',
    categories: [
      {
        key: 'http-status',
        label: 'Status & redirects',
        description: 'Control the exact status code and redirect behavior of a response.',
        pages: [
          { path: '/http/status/404', title: 'Status code echo', description: 'Returns the requested HTTP status code. Try /http/status/{code}.', difficulty: 'easy' },
          { path: '/http/redirect/3', title: 'Redirect chain', description: 'Issues N sequential 302 redirects. Try /http/redirect/{n}.', difficulty: 'easy' },
          { path: '/http/redirect-to?url=https://example.com', title: 'Redirect to URL', description: 'Redirects to any http(s) URL you supply via ?url=, with an optional ?status_code=.', difficulty: 'easy' },
          { path: '/http/delay/2', title: 'Delayed response', description: 'Delays the response by N seconds (max 10). Try /http/delay/{seconds}.', difficulty: 'easy' },
        ],
      },
      {
        key: 'http-headers-cookies',
        label: 'Headers & cookies',
        description: 'Inspect what your client is sending, or set state for it to send back.',
        pages: [
          { path: '/http/headers', title: 'Header echo', description: 'Returns the request headers as JSON.', difficulty: 'easy' },
          { path: '/http/anything', title: 'Request echo', description: 'Accepts any method and echoes back the method, headers, query, and body. Try POSTing JSON to it.', difficulty: 'easy' },
          { path: '/http/response-headers?X-Test=hello', title: 'Set response headers', description: 'Every query param becomes a real response header, and is echoed in the JSON body.', difficulty: 'easy' },
          { path: '/http/user-agent', title: 'User-Agent check', description: 'Returns 403 unless your User-Agent looks like a real browser — for testing header-spoofing logic.', difficulty: 'medium' },
          { path: '/http/ip', title: 'Your IP', description: 'Returns the connecting client IP as seen by the edge.', difficulty: 'easy' },
          { path: '/http/cookies/set?name=foo&value=bar', title: 'Set cookie', description: 'Sets a cookie from query params, then redirects to /cookies/get.', difficulty: 'easy' },
          { path: '/http/cookies/get', title: 'Get cookies', description: 'Returns current cookies as JSON.', difficulty: 'easy' },
        ],
      },
      {
        key: 'http-auth',
        label: 'Authentication',
        description: 'Protected endpoints for testing HTTP-level auth schemes.',
        pages: [
          { path: '/http/auth/basic', title: 'Basic auth', description: 'Protected by HTTP Basic Auth (user: demo / pass: demo).', difficulty: 'easy' },
          { path: '/http/auth/bearer', title: 'Bearer token auth', description: 'Requires an Authorization: Bearer demo-token header.', difficulty: 'easy' },
        ],
      },
      {
        key: 'http-compression-limits',
        label: 'Compression & rate limits',
        description: 'Response encoding and throttling behavior.',
        pages: [
          { path: '/http/gzip', title: 'Gzip response', description: 'A padded JSON body — transparently gzip-compressed by the edge when the client sends Accept-Encoding.', difficulty: 'medium' },
          { path: '/http/rate-limit', title: 'Rate limiting', description: 'Returns 429 after 5 requests within 60 seconds from the same client.', difficulty: 'medium' },
        ],
      },
      {
        key: 'http-caching',
        label: 'Caching & conditional requests',
        description: 'Round-trip targets for testing conditional GET (If-Modified-Since / If-None-Match) handling.',
        pages: [
          { path: '/http/cache', title: 'Conditional GET', description: 'Returns Last-Modified/ETag headers; send either back to get a 304 with no body.', difficulty: 'medium' },
          { path: '/http/etag/testing-abc123', title: 'ETag round-trip', description: 'Send the same value back via If-None-Match to get a 304. Try /http/etag/{value}.', difficulty: 'medium' },
        ],
      },
      {
        key: 'http-streaming',
        label: 'Streaming & content negotiation',
        description: 'Chunked responses, byte-range requests, and Accept-driven content negotiation.',
        pages: [
          { path: '/http/stream/5', title: 'Streamed NDJSON', description: 'Streams N newline-delimited JSON lines via a real ReadableStream. Try /http/stream/{n} (max 100).', difficulty: 'medium' },
          { path: '/http/range/1000', title: 'Byte-range requests', description: 'Supports Range: bytes=start-end with real 206/416 responses, for resumable-download testing.', difficulty: 'medium' },
          { path: '/http/image', title: 'Image content negotiation', description: 'Returns a real SVG or PNG depending on the Accept header.', difficulty: 'medium' },
        ],
      },
    ],
  },
  {
    key: 'mock-data',
    label: 'Mock Data',
    description:
      'A small fake REST API for mocking data in your own apps — deterministic, JSONPlaceholder-style responses, nothing persisted.',
    categories: [
      {
        key: 'users-api',
        label: 'Users API',
        description: 'A fake CRUD API for user records — list, fetch, create, update, and delete (nothing is persisted).',
        pages: [
          { path: '/mock-data/users/docs', title: 'Users API reference', description: 'Full endpoint docs: list, get, create, update, delete, plus a generated avatar per user.', difficulty: 'easy' },
        ],
      },
      {
        key: 'posts-api',
        label: 'Posts & Comments API',
        description: 'A fake CRUD API for blog-style posts and their nested comments.',
        pages: [
          { path: '/mock-data/posts/docs', title: 'Posts & Comments API reference', description: 'Full endpoint docs, including nested /posts/:id/comments and ?userId=/?postId= filtering.', difficulty: 'easy' },
        ],
      },
      {
        key: 'albums-api',
        label: 'Albums & Photos API',
        description: 'A fake CRUD API for albums and their nested photos, each with a real self-hosted image.',
        pages: [
          { path: '/mock-data/albums/docs', title: 'Albums & Photos API reference', description: 'Full endpoint docs, including nested /albums/:id/photos and generated per-photo images.', difficulty: 'easy' },
        ],
      },
      {
        key: 'todos-api',
        label: 'Todos API',
        description: 'A fake CRUD API for to-do items, with a deterministic completed/incomplete split.',
        pages: [
          { path: '/mock-data/todos/docs', title: 'Todos API reference', description: 'Full endpoint docs, including ?userId= and ?completed= filtering.', difficulty: 'easy' },
        ],
      },
    ],
  },
  {
    key: 'generator',
    label: 'Generators',
    description:
      'Instant, no-signup generators for bulk test data — fresh output every time, unlike the deterministic Mock Data fixtures above.',
    categories: [
      {
        key: 'user-generator',
        label: 'User Generator',
        description: 'Bulk fake identities — name, email, phone, address, and avatar. Fresh every time.',
        pages: [
          { path: '/generator/users', title: 'Generate users', description: 'Interactive generator with instant JSON/CSV download — no signup or email required.', difficulty: 'easy' },
        ],
      },
      {
        key: 'card-generator',
        label: 'Card Generator',
        description: 'Synthetic, Luhn-valid test credit card numbers for testing payment-form validation.',
        pages: [
          { path: '/generator/cards', title: 'Generate test cards', description: 'Visa, Mastercard, Amex, and Discover-shaped numbers. Not real, not linked to any account, and cannot be charged.', difficulty: 'easy' },
        ],
      },
      {
        key: 'file-generator',
        label: 'File Generator',
        description: 'Dummy files of a given type and size, for testing upload validation.',
        pages: [
          { path: '/generator/files', title: 'Generate a dummy file', description: 'txt, csv, json, or random bytes, at any size up to 5MB.', difficulty: 'easy' },
        ],
      },
      {
        key: 'image-generator',
        label: 'Image Generator',
        description: 'A placeholder image at any dimensions you request.',
        pages: [
          { path: '/generator/images/400/300', title: 'Placeholder image', description: 'Deterministic per dimension, unlike the other generators here. Try /generator/images/{width}/{height}.', difficulty: 'easy' },
        ],
      },
    ],
  },
]
