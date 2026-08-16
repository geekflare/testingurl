# testingurl

Testing URL by Geekflare — [testingurl.dev](https://testingurl.dev)

A public sandbox of pages with known, predictable structures for practicing
web scraping, automation, and HTTP tooling — in the spirit of
[toscrape.com](https://toscrape.com) and
[webscraper.io/test-sites](https://webscraper.io/test-sites), extended to
cover general developer testing needs (HTTP status/redirect/cookie
endpoints, auth flows, etc.), not just scraping.

Every page is listed on the homepage, grouped by category, with a
difficulty tag and a one-line description of what it exercises.

## Stack

- [Hono](https://hono.dev) (TypeScript) running on Cloudflare Workers
- Server-rendered HTML via `hono/jsx` — no build-heavy framework, since most
  pages need per-request logic (cookies, custom status codes, redirects)
  rather than static content
- Cloudflare KV for the rate-limit test endpoint
- Every visible JSON example gets copy/download buttons via one shared, delegated script (`CodeBlock` component in `src/lib/codeBlock.tsx`) — no per-page JS needed

## Local development

```bash
npm install
npm run dev
```

This starts `wrangler dev` on `http://localhost:8787`.

To exercise `/http/rate-limit`, create a KV namespace and put its id in
`wrangler.toml`:

```bash
wrangler kv namespace create TESTINGURL_KV
```

Without a bound namespace, that one endpoint returns `501` — every other
page works without it.

## Deploying

```bash
npm run deploy
```

Then attach the `testingurl.dev` custom domain from the Cloudflare dashboard
(Workers & Pages → testingurl → Settings → Domains & Routes), or via:

```bash
wrangler deploy --routes testingurl.dev/*
```

`.dev` is on the HSTS preload list, so HTTPS is enforced automatically —
there's no plain-HTTP variant of this site.

## Site structure

Top-level sections live at `/scraping`, `/http`, `/mock-data`, and
`/generator`, each with their own index page listing every category
underneath them.

- **Ecommerce catalog** — category browsing down to individual product detail pages (breadcrumbs, related products)
- **Structured data & metadata** — one demo product exposed via JSON-LD only, Microdata only, Open Graph only, a GA4/GTM `dataLayer` push only, and all four combined; plus a Collection/`ItemList` page, a reviews page with `Review`/`AggregateRating`, and an `FAQPage`
- **Contact page** (`/contact`) — email/phone/address as plain text, `mailto:`/`tel:` links, Microdata, and `Organization` JSON-LD together
- **Pagination** — numbered (`?page=N`), offset/limit, load-more button, infinite scroll
- **Rendering modes** — JS-rendered (empty shell + client fetch) vs. server-rendered; frames & iframes (content nested two levels deep in separate `<iframe src>` documents)
- **Tables** — simple, sortable, rowspan-nested
- **Forms** — GET/POST, multi-step wizard (cookie-persisted), file upload, hidden/honeypot fields
- **Authentication** — cookie-session login wall
- **Link graphs** — redirect chains, circular links, intentional 404s
- **Markup difficulty levels** — the same data rendered as clean HTML, div-soup, obfuscated classes, and data-attribute hooks
- **HTTP & networking** — status codes, redirects (including `/redirect-to?url=`), delay, header/cookie echo, request echo (`/anything`), caller-set response headers, connecting IP, a User-Agent/header-spoofing check (403 unless you look like a real browser), basic/bearer auth, gzip, rate limiting, conditional GET (`/cache`, `/etag/:etag`), streamed NDJSON, byte-range (206/416) requests, and Accept-driven image content negotiation
- **Mock Data** — fake CRUD REST APIs in the spirit of JSONPlaceholder, nothing persisted, always deterministic: **Users** (`/mock-data/users`, with a generated per-user avatar), **Posts & Comments** (nested `/posts/:id/comments`), **Albums & Photos** (nested `/albums/:id/photos`, each photo a real generated image), and **Todos** (`?userId=`/`?completed=` filtering)
- **Generators** — instant, no-signup, always *fresh* (non-deterministic) output, the opposite philosophy from Mock Data's fixtures: **User Generator** (bulk fake identities, instant CSV/JSON, no email gate), **Card Generator** (synthetic Luhn-valid test card numbers per network, clearly labeled not-real), **File Generator** (dummy `.txt`/`.csv`/`.json`/`.bin` files by size, up to 5MB), and **Image Generator** (`/generator/images/:width/:height`, deterministic per dimension)

Later phases (not yet built): accessibility/SEO test pages, more Mock Data
domains (companies), WebSocket echo, and i18n. `badssl.com`-style
TLS/certificate-misconfiguration testing isn't buildable on this
single-domain Workers setup — see badssl.com directly for that.
