# testingurl

**[testingurl.dev](https://testingurl.dev)** is a free sandbox of pages with
known, predictable structures for practicing web scraping, browser
automation, and HTTP client development.

Every page returns the same content on every request unless its own
description says otherwise, so it's safe to write automated tests and
scrapers against. `robots.txt` allows every path (crawlers and AI agents
included), [`llms.txt`](https://testingurl.dev/llms.txt) gives agents a
structured index of every page, and every JSON endpoint is documented in a
validated [OpenAPI 3.0 spec](https://testingurl.dev/openapi.json).

## Site structure

- **`/scraping`** — an ecommerce catalog (category → product pages), product
  data in JSON-LD/Microdata/Open Graph/`dataLayer`, pagination patterns (with
  `rel="next"/"prev"` signals), JS-rendered and iframe-nested content,
  tables, forms (including a multi-step wizard and hidden/honeypot fields),
  a cookie-session login wall, link graphs, elements with randomized ids and
  delayed state changes, paired accessible/inaccessible pages for testing
  a11y scanners, the same content rendered at several markup difficulty
  levels, URL normalization edge cases (trailing slash, case sensitivity,
  query param order, the `<base>` tag), canonical tag and meta
  robots/`X-Robots-Tag` scenarios, `hreflang` variants, and non-HTTP
  redirect mechanisms (meta refresh, JS redirect, an intentional infinite
  loop)
- **`/http`** — status codes, redirects, header/cookie inspection, request
  echoing, a User-Agent/header-spoofing check, basic/bearer auth, gzip,
  rate limiting, conditional GET, streamed responses, and byte-range
  requests
- **`/mock-data`** — deterministic fake REST APIs for Users, Posts &
  Comments, Albums & Photos, and Todos
- **`/generator`** — on-demand, non-deterministic generators for bulk fake
  users, test payment card numbers, dummy files, and placeholder images
- **`/contact`** — contact details exposed as plain text, Microdata, and
  JSON-LD, for testing contact-data extraction
- **`/ai`** — fixtures for people building AI agents and RAG pipelines. A
  prompt-injection test page has seven labeled hidden-text vectors plus a
  benign canary phrase. A retrieval corpus (HTML + Markdown + PDF +
  bulk JSON, plus a single dataset.json bundle) comes with a documented query
  → expected-result answer key. There are also dedicated PDF documents built
  to stress-test extraction: a real table, a two-column layout, and repeated
  running headers/footers

## Stack

- [Hono](https://hono.dev) (TypeScript)
- Server-rendered HTML via `hono/jsx`

## Local development

```bash
npm install
npm run dev
```

Starts a local dev server at `http://localhost:8787`.

To exercise `/http/rate-limit`, create a KV namespace and set its id in
`wrangler.toml`:

```bash
wrangler kv namespace create TESTINGURL_KV
```

Without a bound namespace, that one endpoint returns `501`. Every other
page works without it.

## Deploying

```bash
npm run deploy
```

Then attach your custom domain from the Cloudflare dashboard (Workers &
Pages → your worker → Settings → Domains & Routes), or:

```bash
wrangler deploy --routes yourdomain.com/*
```

## License

[MIT](LICENSE)
