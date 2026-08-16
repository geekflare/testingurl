import type { Context } from 'hono'
import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { MOCK_ALBUMS, MOCK_PHOTOS, findAlbum, findPhoto } from '../../lib/mockContent'

export const albumsAndPhotos = new Hono()

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

function requestOrigin(c: Context): string {
  return new URL(c.req.url).origin
}

// --- Albums ----------------------------------------------------------------

albumsAndPhotos.get('/mock-data/albums', (c) => {
  const userId = c.req.query('userId')
  let albums = MOCK_ALBUMS
  if (userId) albums = albums.filter((a) => a.userId === parseInt(userId, 10))
  return c.json(paginate(albums, c))
})

albumsAndPhotos.get('/mock-data/albums/:id{[0-9]+}', (c) => {
  const album = findAlbum(parseInt(c.req.param('id'), 10))
  if (!album) return c.json({ error: 'Album not found' }, 404)
  return c.json(album)
})

albumsAndPhotos.get('/mock-data/albums/:id{[0-9]+}/photos', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findAlbum(id)) return c.json({ error: 'Album not found' }, 404)
  const origin = requestOrigin(c)
  const photos = MOCK_PHOTOS.filter((p) => p.albumId === id).map((p) => serializePhoto(p, origin))
  return c.json(photos)
})

albumsAndPhotos.post('/mock-data/albums', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ id: MOCK_ALBUMS.length + 1, ...body, note: 'Not persisted.' }, 201)
})

albumsAndPhotos.on(['PUT', 'PATCH'], '/mock-data/albums/:id{[0-9]+}', async (c) => {
  const album = findAlbum(parseInt(c.req.param('id'), 10))
  if (!album) return c.json({ error: 'Album not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...album, ...body, note: 'Not persisted — changes are not saved.' })
})

albumsAndPhotos.delete('/mock-data/albums/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findAlbum(id)) return c.json({ error: 'Album not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted — nothing was actually deleted.' })
})

// --- Photos ------------------------------------------------------------------

function serializePhoto(p: { id: number; albumId: number; title: string }, origin: string) {
  return {
    ...p,
    url: `${origin}/mock-data/photos/${p.id}/image.svg`,
    thumbnailUrl: `${origin}/mock-data/photos/${p.id}/image.svg?size=thumb`,
  }
}

albumsAndPhotos.get('/mock-data/photos', (c) => {
  const albumId = c.req.query('albumId')
  let photos = MOCK_PHOTOS
  if (albumId) photos = photos.filter((p) => p.albumId === parseInt(albumId, 10))
  const origin = requestOrigin(c)
  const page = paginate(photos, c)
  return c.json({ ...page, items: page.items.map((p) => serializePhoto(p, origin)) })
})

albumsAndPhotos.get('/mock-data/photos/:id{[0-9]+}', (c) => {
  const photo = findPhoto(parseInt(c.req.param('id'), 10))
  if (!photo) return c.json({ error: 'Photo not found' }, 404)
  return c.json(serializePhoto(photo, requestOrigin(c)))
})

const PHOTO_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d']

albumsAndPhotos.get('/mock-data/photos/:id{[0-9]+}/image.svg', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  const photo = findPhoto(id)
  if (!photo) return c.notFound()
  const thumb = c.req.query('size') === 'thumb'
  const size = thumb ? 80 : 400
  const color = PHOTO_COLORS[id % PHOTO_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${color}"/>
  <text x="${size / 2}" y="${size / 2 + 6}" font-family="monospace" font-size="${size / 10}" fill="#fff" text-anchor="middle">#${id}</text>
</svg>`
  c.header('Content-Type', 'image/svg+xml')
  c.header('Cache-Control', 'public, max-age=86400')
  return c.body(svg)
})

albumsAndPhotos.post('/mock-data/photos', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  return c.json({ id: MOCK_PHOTOS.length + 1, ...body, note: 'Not persisted.' }, 201)
})

albumsAndPhotos.on(['PUT', 'PATCH'], '/mock-data/photos/:id{[0-9]+}', async (c) => {
  const photo = findPhoto(parseInt(c.req.param('id'), 10))
  if (!photo) return c.json({ error: 'Photo not found' }, 404)
  const body = await c.req.json().catch(() => ({}))
  return c.json({ ...serializePhoto(photo, requestOrigin(c)), ...body, note: 'Not persisted — changes are not saved.' })
})

albumsAndPhotos.delete('/mock-data/photos/:id{[0-9]+}', (c) => {
  const id = parseInt(c.req.param('id'), 10)
  if (!findPhoto(id)) return c.json({ error: 'Photo not found' }, 404)
  return c.json({ deleted: true, id, note: 'Not persisted — nothing was actually deleted.' })
})

// --- Docs ------------------------------------------------------------------

albumsAndPhotos.get('/mock-data/albums/docs', (c) => {
  const origin = requestOrigin(c)
  return c.html(
    <Layout
      title="Albums & Photos API reference"
      description="A fake CRUD REST API for albums and their nested photos — list, fetch, create, update, and delete. Nothing is persisted between requests."
    >
      <p class="crumb">
        <a href="/mock-data">&laquo; Mock Data</a>
      </p>
      <h1>Albums &amp; Photos API</h1>
      <p class="intro">
        {MOCK_ALBUMS.length} albums, each owned by a user (<code>userId</code>), with {MOCK_PHOTOS.length} photos
        spread across them. Each photo has a real, self-hosted <code>url</code>/<code>thumbnailUrl</code> — a
        generated SVG, not a hotlinked external image.
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
              <code>/mock-data/albums</code>
            </td>
            <td>
              List albums. Supports <code>?userId=</code>, <code>?page=</code>, <code>?limit=</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/albums/:id</code>
            </td>
            <td>Fetch a single album.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/albums/:id/photos</code>
            </td>
            <td>All photos in that album.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/photos</code>
            </td>
            <td>
              List photos. Supports <code>?albumId=</code>, <code>?page=</code>, <code>?limit=</code>.
            </td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/photos/:id</code>
            </td>
            <td>Fetch a single photo.</td>
          </tr>
          <tr>
            <td>
              <code>GET</code>
            </td>
            <td>
              <code>/mock-data/photos/:id/image.svg</code>
            </td>
            <td>
              The actual image. Add <code>?size=thumb</code> for an 80px version.
            </td>
          </tr>
          <tr>
            <td>
              <code>POST</code> / <code>PUT</code> / <code>PATCH</code> / <code>DELETE</code>
            </td>
            <td>
              <code>/mock-data/albums[/:id]</code> / <code>/mock-data/photos[/:id]</code>
            </td>
            <td>Fake CRUD. Not persisted.</td>
          </tr>
        </tbody>
      </table>

      <h2>Example</h2>
      <img src={`${origin}/mock-data/photos/1/image.svg`} width="120" height="120" alt="" />
      <CodeBlock content={JSON.stringify(findAlbum(1), null, 2)} filename="mock-album-example.json" />

      <p>
        <a href="/mock-data/albums">List albums &raquo;</a> &middot; <a href="/mock-data/albums/1/photos">Photos in album 1 &raquo;</a>
      </p>
    </Layout>
  )
})
