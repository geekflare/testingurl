import { Hono } from 'hono'

export const httpAuth = new Hono()

const VALID_USER = 'demo'
const VALID_PASS = 'demo'
const VALID_BEARER_TOKEN = 'demo-token'

httpAuth.get('/http/auth/basic', (c) => {
  const header = c.req.header('Authorization')
  if (header?.startsWith('Basic ')) {
    const decoded = atob(header.slice('Basic '.length))
    const [user, pass] = decoded.split(':')
    if (user === VALID_USER && pass === VALID_PASS) {
      return c.json({ authenticated: true, user })
    }
  }
  c.header('WWW-Authenticate', 'Basic realm="testingurl.dev"')
  return c.json({ authenticated: false }, 401)
})

httpAuth.get('/http/auth/bearer', (c) => {
  const header = c.req.header('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined
  if (token === VALID_BEARER_TOKEN) {
    return c.json({ authenticated: true, token })
  }
  c.header('WWW-Authenticate', 'Bearer realm="testingurl.dev"')
  return c.json({ authenticated: false }, 401)
})
