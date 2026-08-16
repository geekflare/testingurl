import type { Context } from 'hono'
import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { generateUser } from '../../lib/generators'
import { toCsv } from '../../lib/csv'

export const generatorUsers = new Hono()

const COUNT_MAX = 100
const COUNT_DEFAULT = 5

function requestOrigin(c: Context): string {
  return new URL(c.req.url).origin
}

function clampCount(raw: string | undefined): number {
  const n = parseInt(raw ?? String(COUNT_DEFAULT), 10)
  if (Number.isNaN(n)) return COUNT_DEFAULT
  return Math.min(COUNT_MAX, Math.max(1, n))
}

generatorUsers.get('/generator/users/api', (c) => {
  const count = clampCount(c.req.query('count'))
  const format = c.req.query('format') === 'csv' ? 'csv' : 'json'
  const origin = requestOrigin(c)
  const users = Array.from({ length: count }, () => {
    const u = generateUser()
    return { ...u, avatarUrl: `${origin}/generator/users/avatar.svg?seed=${encodeURIComponent(u.avatarSeed)}&name=${encodeURIComponent(u.fullName)}` }
  })

  if (format === 'csv') {
    c.header('Content-Type', 'text/csv; charset=utf-8')
    c.header('Content-Disposition', 'attachment; filename="generated-users.csv"')
    return c.body(toCsv(users))
  }
  return c.json(users)
})

const AVATAR_COLORS = ['#2563eb', '#dc2626', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2', '#65a30d']

function hashSeed(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return hash
}

generatorUsers.get('/generator/users/avatar.svg', (c) => {
  const seed = c.req.query('seed') ?? 'seed'
  const name = c.req.query('name') ?? '?'
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const color = AVATAR_COLORS[hashSeed(seed) % AVATAR_COLORS.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
  <circle cx="60" cy="60" r="60" fill="${color}"/>
  <text x="60" y="73" font-family="monospace" font-size="42" fill="#fff" text-anchor="middle">${initials}</text>
</svg>`
  c.header('Content-Type', 'image/svg+xml')
  return c.body(svg)
})

generatorUsers.get('/generator/users', (c) => {
  return c.html(
    <Layout
      title="User Generator"
      description="Generate bulk fake user identities (name, email, phone, address, and avatar). Fresh values every time, instant CSV/JSON download, no signup or email required."
    >
      <p class="crumb">
        <a href="/generator">&laquo; Generators</a>
      </p>
      <h1>User Generator</h1>
      <p class="intro">
        Fresh, random fake identities for testing signup forms, seeding a demo, or populating a UI mockup. Unlike
        the Mock Data APIs, this gives you new values on every click: nothing here is deterministic.
      </p>

      <form class="test-form" id="gen-form">
        <label for="count">Number of users (max {COUNT_MAX})</label>
        <input type="number" id="count" name="count" min="1" max={COUNT_MAX} value={COUNT_DEFAULT} />
        <button type="submit">Generate</button>
      </form>

      <p>
        <a id="download-json" href={`/generator/users/api?count=${COUNT_DEFAULT}&format=json`}>
          Download JSON
        </a>{' '}
        &middot;{' '}
        <a id="download-csv" href={`/generator/users/api?count=${COUNT_DEFAULT}&format=csv`}>
          Download CSV
        </a>
      </p>

      <CodeBlock codeId="preview" content={'Click "Generate" to preview results here.'} filename="generated-users.json" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
        var form = document.getElementById('gen-form');
        var countInput = document.getElementById('count');
        var preview = document.getElementById('preview');
        var jsonLink = document.getElementById('download-json');
        var csvLink = document.getElementById('download-csv');

        function updateLinks() {
          var count = countInput.value || ${COUNT_DEFAULT};
          jsonLink.href = '/generator/users/api?count=' + count + '&format=json';
          csvLink.href = '/generator/users/api?count=' + count + '&format=csv';
        }
        countInput.addEventListener('input', updateLinks);

        form.addEventListener('submit', function (e) {
          e.preventDefault();
          updateLinks();
          preview.textContent = 'Generating…';
          fetch(jsonLink.href)
            .then(function (res) { return res.json(); })
            .then(function (data) { preview.textContent = JSON.stringify(data, null, 2); });
        });
      `,
        }}
      />
    </Layout>
  )
})
