import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'

export const httpCookies = new Hono()

httpCookies.get('/http/cookies/set', (c) => {
  const name = c.req.query('name')
  const value = c.req.query('value')
  if (name && value) {
    setCookie(c, name, value, { path: '/' })
  }
  return c.redirect('/http/cookies/get')
})

httpCookies.get('/http/cookies/get', (c) => {
  const cookies: Record<string, string> = {}
  const header = c.req.header('Cookie') ?? ''
  header
    .split(';')
    .map((pair) => pair.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const [key, ...rest] = pair.split('=')
      cookies[key] = decodeURIComponent(rest.join('='))
    })
  return c.json({ cookies })
})
