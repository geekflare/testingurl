import { Hono } from 'hono'
import { Layout } from '../lib/layout'
import { JsonLd, ORGANIZATION, organizationJsonLd } from '../lib/structuredData'

export const contact = new Hono()

contact.get('/contact', (c) => {
  return c.html(
    <Layout
      title="Contact"
      description="Contact details — email, phone, and address — as plain text, mailto:/tel: links, Microdata, and Organization JSON-LD, for testing contact-data extraction."
    >
      <p class="crumb">
        <a href="/scraping/structured-data">&laquo; Structured data</a>
      </p>
      <h1>Contact</h1>
      <p class="intro">
        The details below are marked up two ways at once — schema.org Microdata on the visible elements, and an{' '}
        <code>Organization</code> JSON-LD block in the page source — a realistic target for contact-data
        extraction (email/phone/address scrapers).
      </p>

      <div itemscope itemtype="https://schema.org/Organization">
        <h2 itemprop="name">{ORGANIZATION.name}</h2>
        <ul class="index-list">
          <li>
            General:{' '}
            <a href={`mailto:${ORGANIZATION.email}`} itemprop="email">
              {ORGANIZATION.email}
            </a>
          </li>
          <li>
            Sales: <a href={`mailto:${ORGANIZATION.salesEmail}`}>{ORGANIZATION.salesEmail}</a>
          </li>
          <li>
            Phone:{' '}
            <a href={`tel:${ORGANIZATION.telephone}`} itemprop="telephone">
              {ORGANIZATION.telephone}
            </a>
          </li>
          <li itemprop="address" itemscope itemtype="https://schema.org/PostalAddress">
            Address: <span itemprop="streetAddress">{ORGANIZATION.streetAddress}</span>,{' '}
            <span itemprop="addressLocality">{ORGANIZATION.addressLocality}</span>{' '}
            <span itemprop="postalCode">{ORGANIZATION.postalCode}</span>,{' '}
            <span itemprop="addressCountry">{ORGANIZATION.addressCountry}</span>
          </li>
        </ul>
      </div>

      <h2>Send a message</h2>
      <form class="test-form" method="post" action="/contact">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required />
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
        <label for="message">Message</label>
        <textarea id="message" name="message" rows={4} required></textarea>
        <button type="submit">Send</button>
      </form>

      <JsonLd data={organizationJsonLd()} />
    </Layout>
  )
})

contact.post('/contact', async (c) => {
  const body = await c.req.parseBody()
  return c.html(
    <Layout title="Contact · sent">
      <h1>Message sent</h1>
      <p id="confirmation">
        Thanks, {String(body.name ?? '')}. A reply would go to {String(body.email ?? '')}.
      </p>
      <p>
        <a href="/contact">&laquo; Back to contact</a>
      </p>
    </Layout>
  )
})
