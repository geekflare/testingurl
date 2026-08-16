import type { FC } from 'hono/jsx'
import type { Product } from './data'

export const SITE_ORIGIN = 'https://testingurl.dev'

export const JsonLd: FC<{ data: unknown }> = ({ data }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }} />
)

export function productImageUrl(): string {
  return `${SITE_ORIGIN}/assets/placeholder-product.svg`
}

export function productBrand(p: Product): string {
  return p.name.split(' ')[0]
}

export function productSku(p: Product): string {
  return `TU-${p.id}`
}

export function productReviewCount(p: Product): number {
  return 12 + ((p.id * 7) % 80)
}

export function productAvailability(p: Product): 'https://schema.org/InStock' | 'https://schema.org/OutOfStock' {
  return p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
}

export function productUrl(p: Product): string {
  return `${SITE_ORIGIN}/scraping/ecommerce/product/${p.id}`
}

export interface DemoReview {
  author: string
  rating: number
  body: string
}

const REVIEW_TEMPLATES: Array<Omit<DemoReview, 'rating'>> = [
  { author: 'Priya S.', body: 'Does exactly what it says on the box. Setup took two minutes.' },
  { author: 'Marcus T.', body: 'Solid build quality for the price. Would buy again.' },
  { author: 'Aiko N.', body: 'Battery life is better than I expected going in.' },
  { author: 'Diego R.', body: 'Works fine, though the box was a little beat up on arrival.' },
]

export function productReviews(p: Product): DemoReview[] {
  return REVIEW_TEMPLATES.map((t, i) => ({
    ...t,
    rating: Math.max(1, Math.min(5, p.rating + (i % 2 === 0 ? 1 : -1))),
  }))
}

export function productJsonLd(p: Product, opts: { withReviews?: boolean } = {}) {
  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: productImageUrl(),
    description: p.description,
    sku: productSku(p),
    brand: { '@type': 'Brand', name: productBrand(p) },
    category: p.category,
    offers: {
      '@type': 'Offer',
      url: productUrl(p),
      priceCurrency: 'USD',
      price: p.price.toFixed(2),
      availability: productAvailability(p),
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: p.rating,
      bestRating: 5,
      reviewCount: productReviewCount(p),
    },
  }
  if (opts.withReviews) {
    json.review = productReviews(p).map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.body,
    }))
  }
  return json
}

export function dataLayerScript(p: Product): string {
  const payload = {
    event: 'view_item',
    ecommerce: {
      currency: 'USD',
      value: p.price,
      items: [
        {
          item_id: productSku(p),
          item_name: p.name,
          item_brand: productBrand(p),
          item_category: p.category,
          price: p.price,
          quantity: 1,
        },
      ],
    },
  }
  return `window.dataLayer = window.dataLayer || [];\nwindow.dataLayer.push(${JSON.stringify(payload, null, 2)});`
}

export function itemListJsonLd(categoryLabel: string, categoryUrl: string, products: Product[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: categoryLabel,
    url: `${SITE_ORIGIN}${categoryUrl}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: productUrl(p),
        name: p.name,
      })),
    },
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    })),
  }
}

export const ORGANIZATION = {
  name: 'TestingURL.dev',
  email: 'hello@testingurl.dev',
  salesEmail: 'sales@testingurl.dev',
  telephone: '+1-555-0102',
  streetAddress: '221B Baker Street',
  addressLocality: 'London',
  postalCode: 'NW1 6XE',
  addressCountry: 'GB',
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name,
    url: SITE_ORIGIN,
    logo: productImageUrl(),
    email: ORGANIZATION.email,
    telephone: ORGANIZATION.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORGANIZATION.streetAddress,
      addressLocality: ORGANIZATION.addressLocality,
      postalCode: ORGANIZATION.postalCode,
      addressCountry: ORGANIZATION.addressCountry,
    },
    sameAs: ['https://geekflare.com'],
  }
}
