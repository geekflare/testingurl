import { Hono } from 'hono'
import { Layout } from '../../lib/layout'

export const accessibility = new Hono()

// Every issue here is one an automated scanner (axe-core, pa11y, Lighthouse)
// actually flags. Kept intentionally narrow so this page is a reliable
// known-answer fixture rather than a loose pile of "best practice" nitpicks.
const ISSUES = [
  { rule: 'image-alt', label: 'Missing alt text', detail: 'The product image has no alt attribute at all.' },
  { rule: 'label', label: 'Unlabeled form input', detail: 'The email field has a placeholder but no associated <label>.' },
  { rule: 'color-contrast', label: 'Insufficient color contrast', detail: 'The paragraph text is light gray on white, well under the 4.5:1 minimum.' },
  { rule: 'heading-order', label: 'Skipped heading level', detail: 'Goes from <h2> straight to <h4>, skipping <h3>.' },
]

function AccessibleDemo() {
  return (
    <div class="a11y-demo">
      <h2>Featured product</h2>
      <img src="/assets/placeholder-product.svg" alt="A laptop illustrated on a plain background" width="200" height="150" />
      <h3>Sign up for updates</h3>
      <p>Get notified when new test pages ship.</p>
      <form class="test-form">
        <label for="a11y-email-good">Email address</label>
        <input type="email" id="a11y-email-good" name="email" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  )
}

function InaccessibleDemo() {
  return (
    <div class="a11y-demo">
      <h2>Featured product</h2>
      <img src="/assets/placeholder-product.svg" width="200" height="150" />
      <h4>Sign up for updates</h4>
      <p style="color:#cccccc;">Get notified when new test pages ship.</p>
      <form class="test-form">
        <input type="email" placeholder="Email address" />
        <button type="submit">Subscribe</button>
      </form>
    </div>
  )
}

accessibility.get('/scraping/accessibility/accessible', (c) => {
  return c.html(
    <Layout
      title="Accessibility — accessible version"
      description="The same content as the inaccessible version, with every documented issue fixed, for comparing automated a11y scanner output."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Accessible version</h1>
      <p class="intro">
        The same content as the{' '}
        <a href="/scraping/accessibility/inaccessible">inaccessible version</a>, with all four issues fixed:
        descriptive alt text, a proper <code>&lt;label&gt;</code>, readable contrast, and sequential heading
        levels.
      </p>
      <AccessibleDemo />
    </Layout>
  )
})

accessibility.get('/scraping/accessibility/inaccessible', (c) => {
  return c.html(
    <Layout
      title="Accessibility — inaccessible version"
      description="A page with four documented, automated-scanner-detectable accessibility issues, for testing tools like axe-core, pa11y, or Lighthouse against a known answer."
    >
      <p class="crumb">
        <a href="/scraping">&laquo; Web Scraping</a>
      </p>
      <h1>Inaccessible version</h1>
      <p class="intro">
        The boxed content below has exactly four accessibility issues, each one a real automated-scanner rule
        rather than a style nitpick. Run axe-core, pa11y, or Lighthouse against this page and it should report
        exactly these four:
      </p>
      <table>
        <thead>
          <tr>
            <th>Rule</th>
            <th>Issue</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {ISSUES.map((issue) => (
            <tr>
              <td>
                <code>{issue.rule}</code>
              </td>
              <td>{issue.label}</td>
              <td>{issue.detail}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <InaccessibleDemo />
      <p>
        <a href="/scraping/accessibility/accessible">See the accessible version &raquo;</a>
      </p>
    </Layout>
  )
})
