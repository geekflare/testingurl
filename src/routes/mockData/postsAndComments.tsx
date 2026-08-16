import type { Context } from 'hono'
import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { MOCK_POSTS, MOCK_COMMENTS, findPost, findComment } from '../../lib/mockContent'

export const postsAndComments = new Hono()

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

// --- Posts -------------------------------------------------------------

postsAndComments.get('/mock-data/posts', (c) => {
  const userId = c.req.query('userId')
  let posts = MOCK_POSTS
  if (userId) posts = posts.filter((p) => p.userId === parseInt(userId, 10))
  return c.json(paginate(posts, c))
})

postsAndComments.get('/mock-data/posts/:id{[0-9]+}', (c) => {
  const post = findPost(parseInt(c.req.param('id'), 10))
  if (!post) return c.json({ error: 'Post not found' }, 404)
  return c.json(post)
})

postsAndComments.get('/mock-data/posts/:id{[0-9]+}/comments', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findPost(id)) return c.json({ error: 'Post not found' }, 404)
  return c.json(MOCK_COMMENTS.filter((cm) => cm.postId === id))
})

postsAndComments.post('/mock-data/posts', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ id: MOCK_POSTS.length + 1, ...body, note: 'Not persisted.' }, 201)
})

postsAndComments.on(['PUT', 'PATCH'], '/mock-data/posts/:id{[0-9]+}', async (c) => {
  const post = findPost(parseInt(c.req.param('id'), 10))
  if (!post) return c.json({ error: 'Post not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...post, ...body, note: 'Not persisted. Changes are not saved.' })
})

postsAndComments.delete('/mock-data/posts/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findPost(id)) return c.json({ error: 'Post not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted. Nothing was actually deleted.' })
})

// --- Comments ------------------------------------------------------------

postsAndComments.get('/mock-data/comments', (c) => {
  const postId = c.req.query('postId')
  let comments = MOCK_COMMENTS
  if (postId) comments = comments.filter((cm) => cm.postId === parseInt(postId, 10))
  return c.json(paginate(comments, c))
})

postsAndComments.get('/mock-data/comments/:id{[0-9]+}', (c) => {
  const comment = findComment(parseInt(c.req.param('id'), 10))
  if (!comment) return c.json({ error: 'Comment not found' }, 404)
  return c.json(comment)
})

postsAndComments.post('/mock-data/comments', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ id: MOCK_COMMENTS.length + 1, ...body, note: 'Not persisted.' }, 201)
})

postsAndComments.on(['PUT', 'PATCH'], '/mock-data/comments/:id{[0-9]+}', async (c) => {
  const comment = findComment(parseInt(c.req.param('id'), 10))
  if (!comment) return c.json({ error: 'Comment not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...comment, ...body, note: 'Not persisted. Changes are not saved.' })
})

postsAndComments.delete('/mock-data/comments/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findComment(id)) return c.json({ error: 'Comment not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted. Nothing was actually deleted.' })
})

// --- Docs ------------------------------------------------------------------

postsAndComments.get('/mock-data/posts/docs', (c) => {
  return c.html(
    <Layout
      title="Posts & Comments API reference"
      description="A fake CRUD REST API for posts and their nested comments. Supports list, fetch, create, update, and delete; nothing is persisted between requests."
    >
      <p class="crumb">
        <a href="/mock-data">&laquo; Mock Data</a>
      </p>
      <h1>Posts &amp; Comments API</h1>
      <p class="intro">
        {MOCK_POSTS.length} posts, each owned by a user (<code>userId</code>), with {MOCK_COMMENTS.length} comments
        in total spread across them. Comments reference their post via <code>postId</code>, independent of the Users
        resource (like real blog comments, not necessarily from a registered user).
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
              <code>/mock-data/posts</code>
            </td>
            <td>
              List posts. Supports <code>?userId=</code>, <code>?page=</code>, <code>?limit=</code> (max 50).
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/posts/:id</code>
            </td>
            <td>Fetch a single post.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/posts/:id/comments</code>
            </td>
            <td>All comments on that post.</td>
          </tr>
          <tr>
            <td>
              <code>POST</code>
            </td>
            <td>
              <code>/mock-data/posts</code>
            </td>
            <td>Fake create. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>PUT</code> / <code>PATCH</code>
            </td>
            <td>
              <code>/mock-data/posts/:id</code>
            </td>
            <td>Fake update. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>DELETE</code>
            </td>
            <td>
              <code>/mock-data/posts/:id</code>
            </td>
            <td>Fake delete. Not persisted.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/comments</code>
            </td>
            <td>
              List comments. Supports <code>?postId=</code>, <code>?page=</code>, <code>?limit=</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/comments/:id</code>
            </td>
            <td>Fetch a single comment.</td>
          </tr>
          <tr>
            <td>
              <code>POST</code> / <code>PUT</code> / <code>PATCH</code> / <code>DELETE</code>
            </td>
            <td>
              <code>/mock-data/comments</code> / <code>/mock-data/comments/:id</code>
            </td>
            <td>Same fake-CRUD pattern as posts.</td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <CodeBlock content={JSON.stringify(findPost(1), null, 2)} filename="mock-post-example.json" />

      <p>
        <a href="/mock-data/posts">List posts &raquo;</a> &middot; <a href="/mock-data/posts/1/comments">Comments on post 1 &raquo;</a>
      </p>
    </Layout>
  )
})
