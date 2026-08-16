import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { Layout } from '../../lib/layout'
import { PRODUCTS } from '../../lib/data'

export const forms = new Hono()

// --- Basic GET search form ---------------------------------------------

forms.get('/scraping/forms/basic', (c) => {
  const q = c.req.query('q') ?? ''
  const results = q ? PRODUCTS.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())) : []
  return c.html(
    <Layout title="Basic GET form">
      <h1>Basic GET form</h1>
      <p>Search submits via GET, so results are driven entirely by the URL, e.g. <code>?q=pro</code>.</p>
      <form class="test-form" method="get" action="/scraping/forms/basic">
        <label for="q">Search products</label>
        <input type="text" id="q" name="q" value={q} placeholder="e.g. pro" />
        <button type="submit">Search</button>
      </form>
      {q && (
        <div id="results">
          <p>
            {results.length} result(s) for "{q}":
          </p>
          <ul>
            {results.map((p) => (
              <li data-product-id={p.id}>
                {p.name} — ${p.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Layout>
  )
})

// --- POST form -----------------------------------------------------------

forms.get('/scraping/forms/post', (c) => {
  return c.html(
    <Layout title="POST form">
      <h1>POST form</h1>
      <p>Submits via POST to this same URL; the server renders a confirmation with the submitted fields.</p>
      <form class="test-form" method="post" action="/scraping/forms/post">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required />
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/post', async (c) => {
  const body = await c.req.parseBody()
  return c.html(
    <Layout title="POST form · submitted">
      <h1>Submitted</h1>
      <p id="confirmation">Thanks, {String(body.name ?? '')}. A confirmation was "sent" to {String(body.email ?? '')}.</p>
      <p>
        <a href="/scraping/forms/post">&laquo; Submit again</a>
      </p>
    </Layout>
  )
})

// --- Multi-step form (cookie-persisted state) -----------------------------

const WIZARD_COOKIE = 'wizard_state'

function readWizardState(c: any): Record<string, string> {
  const raw = getCookie(c, WIZARD_COOKIE)
  if (!raw) return {}
  try {
    return JSON.parse(atob(raw))
  } catch {
    return {}
  }
}

function writeWizardState(c: any, state: Record<string, string>) {
  setCookie(c, WIZARD_COOKIE, btoa(JSON.stringify(state)), { path: '/', httpOnly: true, maxAge: 3600 })
}

function StepIndicator({ step }: { step: number }) {
  return (
    <div class="steps">
      <span class={step >= 1 ? 'done' : ''}>1. Details</span>
      <span class={step >= 2 ? 'done' : ''}>2. Preferences</span>
      <span class={step >= 3 ? 'done' : ''}>3. Review</span>
    </div>
  )
}

forms.get('/scraping/forms/multi-step', (c) => {
  writeWizardState(c, {})
  return c.html(
    <Layout title="Multi-step form · step 1">
      <h1>Multi-step form</h1>
      <StepIndicator step={1} />
      <form class="test-form" method="post" action="/scraping/forms/multi-step/step-2">
        <label for="fullName">Full name</label>
        <input type="text" id="fullName" name="fullName" required />
        <button type="submit">Next</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/multi-step/step-2', async (c) => {
  const body = await c.req.parseBody()
  const state = readWizardState(c)
  state.fullName = String(body.fullName ?? '')
  writeWizardState(c, state)
  return c.html(
    <Layout title="Multi-step form · step 2">
      <h1>Multi-step form</h1>
      <StepIndicator step={2} />
      <form class="test-form" method="post" action="/scraping/forms/multi-step/step-3">
        <label for="plan">Preferred plan</label>
        <select id="plan" name="plan">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
        </select>
        <button type="submit">Next</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/multi-step/step-3', async (c) => {
  const body = await c.req.parseBody()
  const state = readWizardState(c)
  state.plan = String(body.plan ?? '')
  writeWizardState(c, state)
  return c.html(
    <Layout title="Multi-step form · step 3">
      <h1>Multi-step form</h1>
      <StepIndicator step={3} />
      <p id="review-name">
        Name: <strong>{state.fullName}</strong>
      </p>
      <p id="review-plan">
        Plan: <strong>{state.plan}</strong>
      </p>
      <form class="test-form" method="post" action="/scraping/forms/multi-step/complete">
        <button type="submit">Confirm</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/multi-step/complete', (c) => {
  deleteCookie(c, WIZARD_COOKIE, { path: '/' })
  return c.html(
    <Layout title="Multi-step form · done">
      <h1>All done</h1>
      <p id="complete-message">The wizard state has been cleared.</p>
      <p>
        <a href="/scraping/forms/multi-step">&laquo; Start over</a>
      </p>
    </Layout>
  )
})

// --- File upload -----------------------------------------------------------

forms.get('/scraping/forms/file-upload', (c) => {
  return c.html(
    <Layout title="File upload">
      <h1>File upload</h1>
      <form class="test-form" method="post" action="/scraping/forms/file-upload" enctype="multipart/form-data">
        <label for="file">Choose a file</label>
        <input type="file" id="file" name="file" required />
        <button type="submit">Upload</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/file-upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body.file
  const isFile = file instanceof File
  return c.html(
    <Layout title="File upload · received">
      <h1>File received</h1>
      {isFile ? (
        <ul id="file-info">
          <li>
            Name: <code>{(file as File).name}</code>
          </li>
          <li>
            Size: <code>{(file as File).size}</code> bytes
          </li>
          <li>
            Type: <code>{(file as File).type || 'unknown'}</code>
          </li>
        </ul>
      ) : (
        <p>No file was received.</p>
      )}
      <p>
        <a href="/scraping/forms/file-upload">&laquo; Upload another</a>
      </p>
    </Layout>
  )
})

// --- Hidden fields / honeypot / CSRF token ---------------------------------

const CSRF_TOKEN = 'testingurl-demo-csrf-token'

forms.get('/scraping/forms/hidden-fields', (c) => {
  return c.html(
    <Layout title="Hidden & honeypot fields">
      <h1>Hidden &amp; honeypot fields</h1>
      <p>
        This form includes a hidden CSRF token (must be echoed back exactly) and a honeypot field named{' '}
        <code>website</code> that must be submitted empty. Real users never see or fill it in.
      </p>
      <form class="test-form" method="post" action="/scraping/forms/hidden-fields">
        <input type="hidden" name="csrf_token" value={CSRF_TOKEN} />
        <div class="honeypot">
          <label for="website">Website (leave blank)</label>
          <input type="text" id="website" name="website" tabindex={-1} autocomplete="off" />
        </div>
        <label for="message">Message</label>
        <input type="text" id="message" name="message" required />
        <button type="submit">Submit</button>
      </form>
    </Layout>
  )
})

forms.post('/scraping/forms/hidden-fields', async (c) => {
  const body = await c.req.parseBody()
  const csrfOk = body.csrf_token === CSRF_TOKEN
  const honeypotOk = !body.website
  const accepted = csrfOk && honeypotOk
  return c.html(
    <Layout title="Hidden fields · result">
      <h1>{accepted ? 'Accepted' : 'Rejected'}</h1>
      <ul>
        <li id="csrf-check">CSRF token valid: {String(csrfOk)}</li>
        <li id="honeypot-check">Honeypot empty: {String(honeypotOk)}</li>
      </ul>
      <p>
        <a href="/scraping/forms/hidden-fields">&laquo; Try again</a>
      </p>
    </Layout>
  )
})
