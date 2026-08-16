import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CodeBlock } from '../../lib/codeBlock'
import { CARD_NETWORKS, generateCard } from '../../lib/generators'
import { toCsv } from '../../lib/csv'

export const generatorCards = new Hono()

const COUNT_MAX = 50
const COUNT_DEFAULT = 5

function clampCount(raw: string | undefined): number {
  const n = parseInt(raw ?? String(COUNT_DEFAULT), 10)
  if (Number.isNaN(n)) return COUNT_DEFAULT
  return Math.min(COUNT_MAX, Math.max(1, n))
}

generatorCards.get('/generator/cards/api', (c) => {
  const count = clampCount(c.req.query('count'))
  const network = c.req.query('network') || undefined
  const format = c.req.query('format') === 'csv' ? 'csv' : 'json'
  const cards = Array.from({ length: count }, () => generateCard(network))

  if (format === 'csv') {
    c.header('Content-Type', 'text/csv; charset=utf-8')
    c.header('Content-Disposition', 'attachment; filename="generated-test-cards.csv"')
    return c.body(toCsv(cards))
  }
  return c.json(cards)
})

generatorCards.get('/generator/cards', (c) => {
  return c.html(
    <Layout
      title="Card Generator"
      description="Generate synthetic, Luhn-valid test credit card numbers for testing payment-form validation. Not linked to any real account, bank, or network, and cannot be charged."
    >
      <p class="crumb">
        <a href="/generator">&laquo; Generators</a>
      </p>
      <h1>Card Generator</h1>
      <p class="intro">
        Synthetic card numbers that pass the Luhn checksum, for testing that a payment form's client-side
        validation accepts well-formed numbers and rejects malformed ones.
      </p>
      <p>
        <strong>These are not real cards.</strong> Numbers are generated locally from public network prefix
        patterns. They aren't looked up against any real bank or card network, aren't linked to any account, and
        cannot be used to make a purchase.
      </p>

      <form class="test-form" id="gen-form">
        <label for="network">Card network</label>
        <select id="network" name="network">
          <option value="">Any</option>
          {CARD_NETWORKS.map((n) => (
            <option value={n.key}>{n.label}</option>
          ))}
        </select>
        <label for="count">Number of cards (max {COUNT_MAX})</label>
        <input type="number" id="count" name="count" min="1" max={COUNT_MAX} value={COUNT_DEFAULT} />
        <button type="submit">Generate</button>
      </form>

      <p>
        <a id="download-json" href={`/generator/cards/api?count=${COUNT_DEFAULT}&format=json`}>
          Download JSON
        </a>{' '}
        &middot;{' '}
        <a id="download-csv" href={`/generator/cards/api?count=${COUNT_DEFAULT}&format=csv`}>
          Download CSV
        </a>
      </p>

      <CodeBlock codeId="preview" content={'Click "Generate" to preview results here.'} filename="generated-test-cards.json" />

      <script
        dangerouslySetInnerHTML={{
          __html: `
        var form = document.getElementById('gen-form');
        var countInput = document.getElementById('count');
        var networkSelect = document.getElementById('network');
        var preview = document.getElementById('preview');
        var jsonLink = document.getElementById('download-json');
        var csvLink = document.getElementById('download-csv');

        function updateLinks() {
          var count = countInput.value || ${COUNT_DEFAULT};
          var network = networkSelect.value;
          var qs = 'count=' + count + (network ? '&network=' + network : '');
          jsonLink.href = '/generator/cards/api?' + qs + '&format=json';
          csvLink.href = '/generator/cards/api?' + qs + '&format=csv';
        }
        countInput.addEventListener('input', updateLinks);
        networkSelect.addEventListener('change', updateLinks);

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
