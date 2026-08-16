import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb } from 'pdf-lib'

const PAGE_WIDTH = 612 // US Letter, points
const PAGE_HEIGHT = 792
const MARGIN = 56
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let current = ''
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word
    if (current && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}

// pdf-lib's save() returns a Uint8Array whose backing-buffer generic doesn't
// always match what Hono's Data union expects (same TS 5.7 typed-array
// mismatch as the raw-bytes file generator), so copy into a plain ArrayBuffer.
function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return buffer
}

export async function buildArticlePdf(title: string, body: string): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  page.drawText(title, { x: MARGIN, y, size: 20, font: boldFont })
  y -= 34

  for (const line of wrapText(body, font, 12, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y, size: 12, font })
    y -= 17
  }

  y -= 24
  page.drawText('testingurl.dev/ai/corpus · RAG document test fixture', {
    x: MARGIN,
    y,
    size: 9,
    font,
    color: rgb(0.55, 0.55, 0.55),
  })

  return toArrayBuffer(await doc.save())
}

interface TableColumn {
  label: string
  width: number
}

const ORDER_COLUMNS: TableColumn[] = [
  { label: 'Order ID', width: 90 },
  { label: 'Product', width: 172 },
  { label: 'Qty', width: 46 },
  { label: 'Price', width: 70 },
  { label: 'Status', width: 122 },
]

const ORDER_ROWS: string[][] = [
  ['ORD-1001', 'Wireless Mouse', '2', '$24.98', 'Shipped'],
  ['ORD-1002', 'Mechanical Keyboard', '1', '$89.00', 'Processing'],
  ['ORD-1003', 'USB-C Hub', '3', '$47.97', 'Delivered'],
  ['ORD-1004', 'Monitor Stand', '1', '$34.50', 'Shipped'],
  ['ORD-1005', 'Webcam 1080p', '2', '$59.98', 'Cancelled'],
  ['ORD-1006', 'Laptop Sleeve 14"', '4', '$71.96', 'Delivered'],
  ['ORD-1007', 'Bluetooth Speaker', '1', '$42.00', 'Processing'],
  ['ORD-1008', 'External SSD 1TB', '2', '$219.98', 'Shipped'],
  ['ORD-1009', 'Desk Lamp', '1', '$28.75', 'Delivered'],
  ['ORD-1010', 'Cable Organizer Kit', '5', '$34.95', 'Processing'],
]

export async function buildTablePdf(): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
  let y = PAGE_HEIGHT - MARGIN

  page.drawText('Order log', { x: MARGIN, y, size: 20, font: boldFont })
  y -= 30

  const intro =
    "This document contains one real table. A correct extraction keeps each row's cells together: " +
    'the Order ID, Product, Qty, Price, and Status in a given row all belong to that row, not ' +
    'to the row above or below it.'
  for (const line of wrapText(intro, font, 11, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y, size: 11, font })
    y -= 15
  }
  y -= 20

  const rowHeight = 24
  const tableWidth = ORDER_COLUMNS.reduce((sum, col) => sum + col.width, 0)
  const tableTop = y
  const tableBottom = tableTop - rowHeight * (ORDER_ROWS.length + 1)

  // Header row
  let cx = MARGIN
  for (const col of ORDER_COLUMNS) {
    page.drawText(col.label, { x: cx + 6, y: tableTop - 16, size: 10, font: boldFont })
    cx += col.width
  }

  // Data rows
  let ry = tableTop - rowHeight
  for (const row of ORDER_ROWS) {
    cx = MARGIN
    row.forEach((cell, i) => {
      page.drawText(cell, { x: cx + 6, y: ry - 16, size: 10, font })
      cx += ORDER_COLUMNS[i].width
    })
    ry -= rowHeight
  }

  // Grid lines
  cx = MARGIN
  for (const col of ORDER_COLUMNS) {
    page.drawLine({ start: { x: cx, y: tableTop }, end: { x: cx, y: tableBottom }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) })
    cx += col.width
  }
  page.drawLine({ start: { x: cx, y: tableTop }, end: { x: cx, y: tableBottom }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) })

  let hy = tableTop
  for (let i = 0; i <= ORDER_ROWS.length + 1; i++) {
    const thickness = i === 0 || i === 1 ? 1 : 0.5
    page.drawLine({ start: { x: MARGIN, y: hy }, end: { x: MARGIN + tableWidth, y: hy }, thickness, color: rgb(0.4, 0.4, 0.4) })
    hy -= rowHeight
  }

  return toArrayBuffer(await doc.save())
}

const TWO_COLUMN_LEFT = {
  heading: 'Caching strategies for web APIs',
  paragraphs: [
    'Caching trades staleness for speed by storing a response so a later request can skip the work that produced it. The hardest part is rarely writing the cache. It is deciding when an entry stops being valid and picking a key that will not collide with a slightly different request.',
    'HTTP gives you two matching mechanisms for this: validators like ETag and Last-Modified let a client ask "has this changed?" and get a cheap 304 back instead of the full body, while Cache-Control headers let a server declare how long a response can be reused without asking at all.',
    'Application-level caches add another layer on top, usually keyed by something more specific than a URL (a user id, a query hash, a feature flag combination) because two requests to the same path can still deserve two different cached answers.',
  ],
}

const TWO_COLUMN_RIGHT = {
  heading: 'Why timezones are hard for software',
  paragraphs: [
    'A timezone is not a fixed offset from UTC; it is a set of rules that can change based on legislation, and those rules are applied differently depending on the exact date and time in question, not just the place.',
    'Daylight saving transitions create two kinds of trouble: a "spring forward" gap where a clock time like 2:30am never occurs at all, and a "fall back" overlap where a clock time like 1:30am occurs twice on the same night, once before the shift and once after.',
    'Storing an instant as UTC and converting only for display sidesteps most of this. But any software that stores a *local* wall-clock time, like a recurring meeting at 9am or an alarm, has to re-resolve that local time against current timezone rules every time it is read.',
  ],
}

export async function buildTwoColumnPdf(): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  const page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])

  page.drawText('Two independent columns', { x: MARGIN, y: PAGE_HEIGHT - MARGIN, size: 20, font: boldFont })
  const note =
    'Left and right columns hold two unrelated essays. A naive left-to-right text extraction that ignores column ' +
    'boundaries will interleave sentences from both and produce nonsense; a correct one keeps each column intact.'
  let noteY = PAGE_HEIGHT - MARGIN - 26
  for (const line of wrapText(note, font, 10, CONTENT_WIDTH)) {
    page.drawText(line, { x: MARGIN, y: noteY, size: 10, font, color: rgb(0.4, 0.4, 0.4) })
    noteY -= 13
  }

  const columnGap = 24
  const columnWidth = (CONTENT_WIDTH - columnGap) / 2
  const columnTop = noteY - 22
  const columns = [
    { x: MARGIN, content: TWO_COLUMN_LEFT },
    { x: MARGIN + columnWidth + columnGap, content: TWO_COLUMN_RIGHT },
  ]

  for (const col of columns) {
    let y = columnTop
    page.drawText(col.content.heading, { x: col.x, y, size: 13, font: boldFont })
    y -= 22
    for (const para of col.content.paragraphs) {
      for (const line of wrapText(para, font, 10.5, columnWidth)) {
        page.drawText(line, { x: col.x, y, size: 10.5, font })
        y -= 14
      }
      y -= 10
    }
  }

  return toArrayBuffer(await doc.save())
}

const RUNNING_HEADER = 'testingurl.dev · RAG document test fixture'
const HEADER_FOOTER_TITLE = 'Running headers & footers'
const HEADER_FOOTER_PARAGRAPHS = [
  'This document tests whether a PDF-to-text pipeline correctly strips repeated boilerplate. Every page below carries the same header line and a footer with a page number. Neither is part of the actual content, and neither should show up mid-sentence in extracted text.',
  'Encryption in transit is handled by TLS, which runs a handshake before any application data moves: the client and server agree on a protocol version and cipher suite, the server proves its identity with a certificate signed by a trusted authority, and both sides derive a shared session key from that exchange.',
  'From that point on, every byte between client and server is encrypted with the session key, which is why a network observer can see that a connection exists and roughly how much data moved, but not the request path, headers, or body being exchanged.',
  'Certificate validation is what stops this from being trivially spoofable. A browser checks that the certificate\'s domain matches the one being requested, that it has not expired, and that it chains up to a root certificate authority the browser already trusts. Fail any of those checks and the connection is refused before data flows.',
  'None of this protects against every threat: TLS secures the connection, not the endpoints. A compromised server still sees plaintext data after decryption, and a user tricked into visiting a look-alike domain with its own valid certificate is still handing data to the wrong server, just over an encrypted channel.',
  'This is also why the padlock icon in a browser only ever meant "this connection is encrypted," never "this site is trustworthy." That distinction matters more as certificate issuance has become free and automatic for nearly any registered domain.',
  'Certificate transparency logs add a further check on top of the browser-side validation above. Every publicly trusted certificate is required to be published to append-only, publicly auditable logs, so a certificate authority that mis-issues a certificate for a domain it should not have, by mistake or by compromise, cannot do so quietly.',
  'HSTS (HTTP Strict Transport Security) closes a different gap: without it, a browser that has only ever been told "this site uses HTTPS" by a previous visit has no way to know that before the very first request on a new device, leaving a window where a network attacker could intercept a plain-HTTP request and strip the upgrade. An HSTS response header tells the browser to refuse plain HTTP to that domain for a set period, no matter how the address was typed or linked.',
  'Mixed content is what happens when an HTTPS page loads a subresource, such as a script, a stylesheet, or an image, over plain HTTP. Browsers block "active" mixed content like scripts outright, because a network attacker who can tamper with that script can control the whole page even though the top-level document itself was fetched securely.',
  'Cipher suite negotiation during the TLS handshake determines exactly which encryption and key-exchange algorithms protect a given connection, and it is renegotiated for every new connection. A server can drop support for an older, weaker suite the moment it decides the security risk outweighs compatibility with older clients, without any change to the certificate itself.',
]

export async function buildHeaderFooterPdf(): Promise<ArrayBuffer> {
  const doc = await PDFDocument.create()
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)

  const headerY = PAGE_HEIGHT - 36
  const footerY = 34
  const contentTop = headerY - 34
  const contentBottom = footerY + 30
  const lineHeight = 15.5

  const pages: PDFPage[] = []
  let page: PDFPage
  let y: number = 0

  const startPage = () => {
    page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT])
    pages.push(page)
    page.drawText(RUNNING_HEADER, { x: MARGIN, y: headerY, size: 9, font, color: rgb(0.55, 0.55, 0.55) })
    page.drawLine({
      start: { x: MARGIN, y: headerY - 8 },
      end: { x: PAGE_WIDTH - MARGIN, y: headerY - 8 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
    y = contentTop
  }

  startPage()
  page!.drawText(HEADER_FOOTER_TITLE, { x: MARGIN, y, size: 18, font: boldFont })
  y -= 30

  for (const para of HEADER_FOOTER_PARAGRAPHS) {
    for (const line of wrapText(para, font, 11, CONTENT_WIDTH)) {
      if (y < contentBottom) startPage()
      page!.drawText(line, { x: MARGIN, y, size: 11, font })
      y -= lineHeight
    }
    y -= lineHeight
  }

  pages.forEach((p, i) => {
    p.drawLine({
      start: { x: MARGIN, y: footerY + 12 },
      end: { x: PAGE_WIDTH - MARGIN, y: footerY + 12 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
    p.drawText(`Page ${i + 1} of ${pages.length} · repeated footer boilerplate, not real content`, {
      x: MARGIN,
      y: footerY,
      size: 8.5,
      font,
      color: rgb(0.55, 0.55, 0.55),
    })
  })

  return toArrayBuffer(await doc.save())
}
