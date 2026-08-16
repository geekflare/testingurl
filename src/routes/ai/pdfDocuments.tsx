import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { buildTablePdf, buildTwoColumnPdf, buildHeaderFooterPdf } from '../../lib/pdf'

export const pdfDocuments = new Hono()

const DOCS = [
  {
    slug: 'table',
    title: 'Table extraction',
    description: "A real drawn table (an order log) that tests whether extraction keeps each row's cells together instead of reading columns out of order.",
  },
  {
    slug: 'two-column',
    title: 'Two-column layout',
    description: 'Two unrelated, newspaper-style essays placed side by side to test whether extraction respects column boundaries instead of reading straight across the page.',
  },
  {
    slug: 'running-header-footer',
    title: 'Running headers & footers',
    description: 'A multi-page document with a repeated header and a page-numbered footer, testing whether extraction strips repeated boilerplate instead of injecting it mid-sentence.',
  },
]

pdfDocuments.get('/ai/pdf-documents', (c) => {
  return c.html(
    <Layout
      title="PDF documents"
      description="RAG testing PDFs generated specifically to stress-test PDF-to-text extraction: real tables, multi-column layout, and repeated running headers and footers."
    >
      <p class="crumb">
        <a href="/ai">&laquo; AI &amp; LLM Testing</a>
      </p>
      <h1>PDF documents</h1>
      <p class="intro">
        Every <a href="/ai/corpus">corpus article</a> is also available as a{' '}
        <a href="/ai/corpus/articles/1/pdf">plain single-column PDF</a>, a quick way to run a basic RAG testing
        PDF ingestion smoke test. The three RAG testing documents below go further, each built to trip up a
        naive PDF-to-text pipeline in one specific, labeled way. A correct extraction should still produce
        clean, readable text from all of them.
      </p>

      <ul class="index-list">
        {DOCS.map((doc) => (
          <li>
            <a href={`/ai/pdf-documents/${doc.slug}`}>{doc.title}</a> — {doc.description}
          </li>
        ))}
      </ul>
    </Layout>
  )
})

pdfDocuments.get('/ai/pdf-documents/table', async (c) => {
  const pdfBytes = await buildTablePdf()
  c.header('Content-Type', 'application/pdf')
  c.header('Content-Disposition', 'attachment; filename="table-extraction-test.pdf"')
  return c.body(pdfBytes)
})

pdfDocuments.get('/ai/pdf-documents/two-column', async (c) => {
  const pdfBytes = await buildTwoColumnPdf()
  c.header('Content-Type', 'application/pdf')
  c.header('Content-Disposition', 'attachment; filename="two-column-layout-test.pdf"')
  return c.body(pdfBytes)
})

pdfDocuments.get('/ai/pdf-documents/running-header-footer', async (c) => {
  const pdfBytes = await buildHeaderFooterPdf()
  c.header('Content-Type', 'application/pdf')
  c.header('Content-Disposition', 'attachment; filename="running-header-footer-test.pdf"')
  return c.body(pdfBytes)
})
