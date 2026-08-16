import { Hono } from 'hono'
import { Layout } from '../../lib/layout'
import { CORPUS_ARTICLES, ANSWER_KEY, findCorpusArticle } from '../../lib/aiCorpus'
import { buildArticlePdf } from '../../lib/pdf'

export const corpus = new Hono()

corpus.get('/ai/corpus', (c) => {
  return c.html(
    <Layout
      title="RAG & retrieval corpus"
      description="A RAG testing dataset of short, topically distinct articles with a documented answer key, built to check a chunking, embedding, and retrieval pipeline against a known-correct result."
    >
      <p class="crumb">
        <a href="/ai">&laquo; AI &amp; LLM Testing</a>
      </p>
      <h1>RAG &amp; retrieval corpus</h1>
      <p class="intro">
        {CORPUS_ARTICLES.length} short, deterministic, non-overlapping articles make up this RAG testing dataset,
        built to exercise a chunking, embedding, and retrieval pipeline end to end. Each article is available as
        HTML, plain Markdown, or a generated PDF, and the whole set can be pulled in one call as JSON at{' '}
        <a href="/ai/corpus/articles.json">/ai/corpus/articles.json</a>. The full dataset, including every
        format's URL and the answer key, is also available as a single download at{' '}
        <a href="/ai/corpus/dataset.json">/ai/corpus/dataset.json</a>. Looking for RAG testing PDFs built to
        stress-test extraction quality (tables, multi-column layout, repeated headers and footers)? See{' '}
        <a href="/ai/pdf-documents">PDF documents</a>.
      </p>

      <h2>Articles</h2>
      <ul class="index-list">
        {CORPUS_ARTICLES.map((a) => (
          <li>
            <a href={`/ai/corpus/articles/${a.id}`}>{a.title}</a> &middot;{' '}
            <a href={`/ai/corpus/articles/${a.id}/markdown`}>markdown</a> &middot;{' '}
            <a href={`/ai/corpus/articles/${a.id}/pdf`}>pdf</a>
          </li>
        ))}
      </ul>

      <h2>Answer key</h2>
      <p>Run each query below through your retrieval pipeline. It should return the paired article as the top result.</p>
      <table>
        <thead>
          <tr>
            <th>Query</th>
            <th>Expected article</th>
          </tr>
        </thead>
        <tbody>
          {ANSWER_KEY.map((entry) => {
            const article = findCorpusArticle(entry.articleId)!
            return (
              <tr>
                <td>{entry.query}</td>
                <td>
                  <a href={`/ai/corpus/articles/${article.id}`}>{article.title}</a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </Layout>
  )
})

corpus.get('/ai/corpus/articles.json', (c) => {
  return c.json(CORPUS_ARTICLES)
})

corpus.get('/ai/corpus/articles/:id{[0-9]+}', (c) => {
  const article = findCorpusArticle(parseInt(c.req.param('id'), 10))
  if (!article) return c.notFound()
  return c.html(
    <Layout title={article.title} description={article.body.slice(0, 150)}>
      <p class="crumb">
        <a href="/ai/corpus">&laquo; RAG &amp; retrieval corpus</a>
      </p>
      <h1>{article.title}</h1>
      <p>{article.body}</p>
      <p>
        <a href={`/ai/corpus/articles/${article.id}/markdown`}>View as Markdown &raquo;</a> &middot;{' '}
        <a href={`/ai/corpus/articles/${article.id}/pdf`}>Download as PDF &raquo;</a>
      </p>
    </Layout>
  )
})

corpus.get('/ai/corpus/articles/:id{[0-9]+}/markdown', (c) => {
  const article = findCorpusArticle(parseInt(c.req.param('id'), 10))
  if (!article) return c.notFound()
  const markdown = `# ${article.title}\n\n${article.body}\n`
  c.header('Content-Type', 'text/markdown; charset=utf-8')
  return c.body(markdown)
})

corpus.get('/ai/corpus/articles/:id{[0-9]+}/pdf', async (c) => {
  const article = findCorpusArticle(parseInt(c.req.param('id'), 10))
  if (!article) return c.notFound()
  const pdfBytes = await buildArticlePdf(article.title, article.body)
  c.header('Content-Type', 'application/pdf')
  c.header('Content-Disposition', `attachment; filename="article-${article.id}.pdf"`)
  return c.body(pdfBytes)
})

corpus.get('/ai/corpus/dataset.json', (c) => {
  return c.json({
    description:
      'The full RAG testing dataset: every article in every available format, plus the query to expected-article answer key.',
    articles: CORPUS_ARTICLES.map((a) => ({
      id: a.id,
      title: a.title,
      body: a.body,
      html: `https://testingurl.dev/ai/corpus/articles/${a.id}`,
      markdown: `https://testingurl.dev/ai/corpus/articles/${a.id}/markdown`,
      pdf: `https://testingurl.dev/ai/corpus/articles/${a.id}/pdf`,
    })),
    answerKey: ANSWER_KEY,
    pdfDocuments: {
      description: 'Additional RAG testing PDFs designed to stress-test extraction quality, not part of the answer-keyed corpus.',
      table: 'https://testingurl.dev/ai/pdf-documents/table',
      twoColumn: 'https://testingurl.dev/ai/pdf-documents/two-column',
      runningHeaderFooter: 'https://testingurl.dev/ai/pdf-documents/running-header-footer',
    },
  })
})
