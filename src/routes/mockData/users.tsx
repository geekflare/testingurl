import type { Context } from 'hono'
import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { MOCK_USERS, findMockUser, type MockUser } from '../../lib/mockUsers'

export const mockUsersApi = new Hono()

const PAGE_SIZE_DEFAULT = 10
const PAGE_SIZE_MAX = 50

function requestOrigin(c: Context): string {
  return new URL(c.req.url).origin
}

function serialize(u: MockUser, origin: string) {
  return { ...u, avatarUrl: `${origin}/mock-data/users/${u.id}/avatar.svg` }
}

mockUsersApi.get('/mock-data/users', (c) => {
  const origin = requestOrigin(c)
  const country = c.req.query('country')
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(c.req.query('limit') ?? String(PAGE_SIZE_DEFAULT), 10) || PAGE_SIZE_DEFAULT)
  )
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1)

  let users = MOCK_USERS
  if (country) {
    users = users.filter((u) => u.country.toLowerCase() === country.toLowerCase())
  }
  const start = (page - 1) * limit
  const items = users.slice(start, start + limit).map((u) => serialize(u, origin))

  return c.json({ page, limit, total: users.length, items })
})

mockUsersApi.get('/mock-data/users/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const user = findMockUser(id)
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json(serialize(user, requestOrigin(c)))
})

mockUsersApi.post('/mock-data/users', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const nextId = MOCK_USERS.length + 1
  return c.json(
    { id: nextId, ...body, note: 'Not persisted. This mock API does not store data between requests.' },
    201
  )
})

mockUsersApi.on(['PUT', 'PATCH'], '/mock-data/users/:id{[0-9]+}', async (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const user = findMockUser(id)
  if (!user) return c.json({ error: 'User not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...serialize(user, requestOrigin(c)), ...body, note: 'Not persisted. Changes are not saved.' })
})

mockUsersApi.delete('/mock-data/users/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const user = findMockUser(id)
  if (!user) return c.json({ error: 'User not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted. Nothing was actually deleted.' })
})

const AVATAR_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d']

mockUsersApi.get('/mock-data/users/:id{[0-9]+}/avatar.svg', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const user = findMockUser(id)
  if (!user) return c.notFound()
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const color = AVATAR_COLORS[id % AVATAR_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="60" fill="${color}"/>
  <text x="60" y="73" font-family="monospace" font-size="42" fill="#fff" text-anchor="middle">${initials}</text>
</svg>`
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(svg)
})

mockUsersApi.get('/mock-data/users/docs', (c) => {
  const origin = requestOrigin(c)
  const sample = serialize(MOCK_USERS[0], origin)
  return c.html(
    <Layout
      title="Users API reference"
      description="A fake CRUD REST API for user records. List, fetch, create, update, and delete are all supported, but nothing is persisted between requests."
    >
      <p class="crumb">
        <a href="/mock-data">&laquo; Mock Data</a>
      </p>
      <h1>Users API</h1>
      <p class="intro">
        A small fake REST API for user records, in the spirit of JSONPlaceholder. Every <code>GET</code> response is
        deterministic and returns the same data every time. <code>POST</code>/<code>PUT</code>/<code>PATCH</code>/
        <code>DELETE</code> accept any body and echo a plausible response back, but nothing is actually stored.
      </p>

      <h2>Endpoints</h2>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/users</code>
            </td>
            <td>
              List users. Supports <code>?page=</code>, <code>?limit=</code> (max 50), and{' '}
              <code>?country=</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/users/:id</code>
            </td>
            <td>Fetch a single user by id (1–50).</td>
          </tr>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/mock-data/users</code>
            </td>
            <td>Fake create. Echoes the submitted JSON body back with a generated id. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>PUT</code> / <code>PATCH</code>
            </td>
            <td>
              <code>/mock-data/users/:id</code>
            </td>
            <td>Fake update, merging the submitted body onto the existing user. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/mock-data/users/:id</code>
            </td>
            <td>Fake delete: confirms deletion. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/users/:id/avatar.svg</code>
            </td>
            <td>A self-hosted, deterministic initials avatar for that user.</td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <pre>
        <code>{`GET ${origin}/mock-data/users/1`}</code>
      </pre>
      <CodeBlock content={JSON.stringify(sample, null, 2)} filename="mock-user-example.json" />

      <p>
        <a href="/mock-data/users">Try the live endpoint &raquo;</a>
      </p>
    </Layout>
  )
})
