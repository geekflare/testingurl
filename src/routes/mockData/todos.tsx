import type { Context } from 'hono'
import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { MOCK_TODOS, findTodo } from '../../lib/mockContent'

export const todos = new Hono()

const PAGE_SIZE_DEFAULT = 10
const PAGE_SIZE_MAX = 50

function paginate<T>(items: T[], c: Context) {
  const limit = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, parseInt(c.req.query('limit') ?? String(PAGE_SIZE_DEFAULT), 10) || PAGE_SIZE_DEFAULT)
  )
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1', 10) || 1)
  const start = (page - 1) * limit
  return { page, limit, total: items.length, items: items.slice(start, start + limit) }
}

todos.get('/mock-data/todos', (c) => {
  const userId = c.req.query('userId')
  const completed = c.req.query('completed')
  let items = MOCK_TODOS
  if (userId) items = items.filter((t) => t.userId === parseInt(userId, 10))
  if (completed === 'true' || completed === 'false') {
    items = items.filter((t) => t.completed === (completed === 'true'))
  }
  return c.json(paginate(items, c))
})

todos.get('/mock-data/todos/:id{[0-9]+}', (c) => {
  const todo = findTodo(parseInt(c.req.param('id'), 10))
  if (!todo) return c.json({ error: 'Todo not found' }, 404)
  return c.json(todo)
})

todos.post('/mock-data/todos', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ id: MOCK_TODOS.length + 1, completed: false, ...body, note: 'Not persisted.' }, 201)
})

todos.on(['PUT', 'PATCH'], '/mock-data/todos/:id{[0-9]+}', async (c) => {
  const todo = findTodo(parseInt(c.req.param('id'), 10))
  if (!todo) return c.json({ error: 'Todo not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...todo, ...body, note: 'Not persisted — changes are not saved.' })
})

todos.delete('/mock-data/todos/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findTodo(id)) return c.json({ error: 'Todo not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted — nothing was actually deleted.' })
})

todos.get('/mock-data/todos/docs', (c) => {
  return c.html(
    <Layout
      title="Todos API reference"
      description="A fake CRUD REST API for to-do items — list, fetch, create, update, and delete. Nothing is persisted between requests."
    >
      <p class="crumb">
        <a href="/mock-data">&laquo; Mock Data</a>
      </p>
      <h1>Todos API</h1>
      <p class="intro">
        {MOCK_TODOS.length} to-do items, each owned by a user (<code>userId</code>) and with a deterministic{' '}
        <code>completed</code> flag — every third item (by id) is marked done.
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
              <code>/mock-data/todos</code>
            </td>
            <td>
              List todos. Supports <code>?userId=</code>, <code>?completed=true|false</code>, <code>?page=</code>,{' '}
              <code>?limit=</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/todos/:id</code>
            </td>
            <td>Fetch a single todo.</td>
          </tr>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/mock-data/todos</code>
            </td>
            <td>Fake create. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>PUT</code> / <code>PATCH</code>
            </td>
            <td>
              <code>/mock-data/todos/:id</code>
            </td>
            <td>Fake update. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/mock-data/todos/:id</code>
            </td>
            <td>Fake delete. Not persisted.</td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <CodeBlock content={JSON.stringify(findTodo(3), null, 2)} filename="mock-todo-example.json" />

      <p>
        <a href="/mock-data/todos?completed=false">Incomplete todos &raquo;</a>
      </p>
    </Layout>
  )
})
