import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { generateFileContent } from '../../lib/generators'

export const generatorFiles = new Hono()

const SIZE_KB_MAX = 5120 // 5 MB, to keep this within a Worker's memory/CPU budget
const SIZE_KB_DEFAULT = 10

const FILE_TYPES = {
  txt: { ext: 'txt', contentType: 'text/plain; charset=utf-8' },
  csv: { ext: 'csv', contentType: 'text/csv; charset=utf-8' },
  json: { ext: 'json', contentType: 'application/json' },
  bin: { ext: 'bin', contentType: 'application/octet-stream' },
} as const

function clampSizeKb(raw: string | undefined): number {
  const n = parseInt(raw ?? String(SIZE_KB_DEFAULT), 10)
  if (Number.isNaN(n)) return SIZE_KB_DEFAULT
  return Math.min(SIZE_KB_MAX, Math.max(1, n))
}

generatorFiles.get('/generator/files/api', (c) => {
  const typeParam = c.req.query('type') ?? 'txt'
  const type = (typeParam in FILE_TYPES ? typeParam : 'txt') as keyof typeof FILE_TYPES
  const sizeKb = clampSizeKb(c.req.query('sizeKb'))
  const { ext, contentType } = FILE_TYPES[type]

  const bytes = generateFileContent(type, sizeKb * 1024)
  // Copy into a plain ArrayBuffer: TS's DOM lib types Uint8Array with a
  // generic backing-buffer parameter that doesn't always match what Hono's
  // Data union expects, even though the bytes themselves are fine.
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)

  c.header('Content-Type', contentType)
  c.header('Content-Disposition', `attachment; filename="generated-file-${sizeKb}kb.${ext}"`)
  return c.body(buffer)
})

generatorFiles.get('/generator/files', (c) => {
  return c.html(
    <Layout
      title="File Generator"
      description="Generate a dummy file of a given type and approximate size, for testing upload size limits and file-type validation."
    >
      <p class="crumb">
        <a href="/generator">&laquo; Generators</a>
      </p>
      <h1>File Generator</h1>
      <p class="intro">
        Downloads a real file of the requested type at (approximately) the requested size. Useful for testing an
        upload form's size limits and file-type validation.
      </p>

      <form class="test-form" id="gen-form" method="get" action="/generator/files/api">
        <label for="type">File type</label>
        <select id="type" name="type">
          <option value="txt">Plain text (.txt)</option>
          <option value="csv">CSV (.csv)</option>
          <option value="json">JSON (.json)</option>
          <option value="bin">Random bytes (.bin)</option>
        </select>
        <label for="sizeKb">Size in KB (max {SIZE_KB_MAX.toLocaleString()})</label>
        <input type="number" id="sizeKb" name="sizeKb" min="1" max={SIZE_KB_MAX} value={SIZE_KB_DEFAULT} />
        <button type="submit">Download file</button>
      </form>
    </Layout>
  )
})
