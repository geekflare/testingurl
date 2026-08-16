import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { Layout } from '../../lib/layout'

export const auth = new Hono()

const SESSION_COOKIE = 'testingurl_session'
const SESSION_VALUE = 'demo-session-token'
const VALID_USER = 'demo'
const VALID_PASS = 'demo'

auth.get('/scraping/auth/login', (c) => {
  const failed = c.req.query('failed') === '1'
  return c.html(
    <Layout title="Login">
      <h1>Login</h1>
      <p>
        Credentials: <code>demo</code> / <code>demo</code>. On success this sets a{' '}
        <code>{SESSION_COOKIE}</code> cookie and redirects to the protected dashboard.
      </p>
      {failed && (
        <p id="login-error" style="color:#dc2626;">
          Invalid username or password.
        </p>
      )}
      <form class="test-form" method="post" action="/scraping/auth/login">
        <label for="username">Username</label>
        <input type="text" id="username" name="username" required />
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required />
        <button type="submit">Log in</button>
      </form>
    </Layout>
  )
})

auth.post('/scraping/auth/login', async (c) => {
  const body = await c.req.parseBody()
  if (body.username === VALID_USER && body.password === VALID_PASS) {
    setCookie(c, SESSION_COOKIE, SESSION_VALUE, { path: '/', httpOnly: true, maxAge: 3600 })
    return c.redirect('/scraping/auth/dashboard')
  }
  return c.redirect('/scraping/auth/login?failed=1')
})

auth.get('/scraping/auth/dashboard', (c) => {
  const session = getCookie(c, SESSION_COOKIE)
  if (session !== SESSION_VALUE) {
    return c.redirect('/scraping/auth/login')
  }
  return c.html(
    <Layout title="Dashboard">
      <h1 id="dashboard-heading">Welcome back</h1>
      <p>This page is only reachable with a valid session cookie.</p>
      <p>
        <a href="/scraping/auth/logout">Log out</a>
      </p>
    </Layout>
  )
})

auth.get('/scraping/auth/logout', (c) => {
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.redirect('/scraping/auth/login')
})
