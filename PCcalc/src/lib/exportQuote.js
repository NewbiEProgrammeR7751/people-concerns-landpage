import { formatSar, formatWeeks } from './format'
import { PARALLEL_FACTOR, VAT_RATE } from './pricing'

const INDIGO = [79, 70, 229]
const INDIGO_TINT = [238, 242, 255]
const SLATE_900 = [15, 23, 42]
const SLATE_600 = [71, 85, 105]
const SLATE_400 = [148, 163, 184]
const SLATE_200 = [226, 232, 240]
const SLATE_50 = [248, 250, 252]
const WHITE = [255, 255, 255]

const MARGIN = 18
const PAGE_W = 210
const PAGE_H = 297
const RIGHT = PAGE_W - MARGIN
const CONTENT_W = PAGE_W - MARGIN * 2

/** The table starts lower when a "Prepared for" block precedes it. */
const tableTop = (clientName) => (clientName ? 63 : 52)

/**
 * jsPDF's built-in fonts use WinAnsi encoding. Intl emits non-breaking and
 * narrow-no-break spaces inside currency strings, which render as blanks.
 */
const clean = (value) => String(value).replace(/[  ]/g, ' ')

const money = (amount) => clean(formatSar(amount))

/** Client name folded into a filename-safe prefix, e.g. "Acme-Corp-". */
const slugify = (name) => {
  const slug = name
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
    .replace(/-+$/, '')
  return slug ? `${slug}-` : ''
}

/** Quote reference, e.g. Q-260921-4821. */
export function quoteReference(date = new Date()) {
  const stamp = [
    String(date.getFullYear()).slice(2),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('')
  const suffix = Math.floor(1000 + Math.random() * 9000)
  return `Q-${stamp}-${suffix}`
}

const formatDate = (date) =>
  date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

/** setFontSize is always in points; page coordinates are in millimetres. */
const PT_TO_MM = 0.3527777778

function drawHeader(doc, { reference, date, validUntil, clientName }) {
  doc.setFillColor(...INDIGO)
  doc.roundedRect(MARGIN, 15, 13, 13, 3, 3, 'F')

  // Badge monogram, optically centred: baseline sits half a cap-height below
  // the square's midpoint (cap height is in points, the page is in mm).
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...WHITE)
  doc.text('PC', MARGIN + 6.5, 21.5 + 11 * 0.72 * PT_TO_MM * 0.5, {
    align: 'center',
  })

  doc.setFontSize(13)
  doc.setTextColor(...SLATE_900)
  doc.text('People Concerns', MARGIN + 17, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...SLATE_400)
  doc.text('SOFTWARE DEVELOPMENT STUDIO', MARGIN + 17, 27)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...SLATE_900)
  doc.text('PROJECT ESTIMATE', RIGHT, 21, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...SLATE_600)
  doc.text(`Reference  ${reference}`, RIGHT, 26.5, { align: 'right' })
  doc.text(`Issued  ${formatDate(date)}`, RIGHT, 31, { align: 'right' })
  doc.text(`Valid until  ${formatDate(validUntil)}`, RIGHT, 35.5, {
    align: 'right',
  })

  doc.setDrawColor(...SLATE_200)
  doc.setLineWidth(0.4)
  doc.line(MARGIN, 42, RIGHT, 42)

  if (!clientName) return

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...SLATE_400)
  doc.text('PREPARED FOR', MARGIN, 49)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(...SLATE_900)
  // Guard against an over-long name colliding with the table below.
  const [firstLine] = doc.splitTextToSize(clientName, CONTENT_W)
  doc.text(firstLine, MARGIN, 55.5)
}

/** Delivery estimate card, drawn to the left of the money column. */
function drawTimeline(doc, { startY, quote }) {
  const width = 84
  doc.setFillColor(...SLATE_50)
  doc.roundedRect(MARGIN, startY, width, 26, 2.5, 2.5, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...SLATE_400)
  doc.text('ESTIMATED DELIVERY', MARGIN + 6, startY + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(...SLATE_900)
  doc.text(formatWeeks(quote.deliveryWeeks), MARGIN + 6, startY + 15)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(...SLATE_600)
  doc.text(
    `${formatWeeks(quote.totalWeeks)} of effort, delivered in parallel streams`,
    MARGIN + 6,
    startY + 21,
  )
}

/**
 * Money column. Base cost and profit margin are internal figures and are
 * deliberately never written to the document.
 */
function drawTotals(doc, { startY, quote }) {
  const cardX = 110
  const cardW = RIGHT - cardX
  let y = startY + 4

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...SLATE_600)
  doc.text(
    `Subtotal (${quote.count} ${quote.count === 1 ? 'module' : 'modules'})`,
    cardX,
    y,
  )
  doc.text(money(quote.subtotal), RIGHT, y, { align: 'right' })

  y += 6
  doc.text(`VAT (${Math.round(VAT_RATE * 100)}%)`, cardX, y)
  doc.text(money(quote.vat), RIGHT, y, { align: 'right' })

  y += 4
  doc.setDrawColor(...SLATE_200)
  doc.setLineWidth(0.3)
  doc.line(cardX, y, RIGHT, y)

  y += 4
  doc.setFillColor(...INDIGO_TINT)
  doc.roundedRect(cardX, y, cardW, 20, 2.5, 2.5, 'F')
  doc.setFillColor(...INDIGO)
  doc.rect(cardX, y, 1.6, 20, 'F')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...SLATE_600)
  doc.text('TOTAL (INCL. VAT)', cardX + 6, y + 7.5)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(...INDIGO)
  doc.text(money(quote.total), RIGHT - 6, y + 15, { align: 'right' })

  return y + 20
}

function drawNotes(doc, startY) {
  const notes = [
    `All figures in SAR. VAT charged at ${Math.round(VAT_RATE * 100)}% per KSA regulations.`,
    `Delivery assumes parallel work streams (factor ${PARALLEL_FACTOR}) and timely client sign-off.`,
    'Estimate covers design, build, QA and one round of revisions per module.',
    'Third-party licences, hosting and government integration fees are excluded.',
  ]

  let y = startY + 14
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(...SLATE_900)
  doc.text('NOTES', MARGIN, y)

  y += 5
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(...SLATE_600)
  for (const note of notes) {
    doc.text(`•  ${note}`, MARGIN, y)
    y += 4.6
  }
  return y
}

function drawFooters(doc) {
  const pages = doc.getNumberOfPages()
  for (let page = 1; page <= pages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(...SLATE_200)
    doc.setLineWidth(0.3)
    doc.line(MARGIN, PAGE_H - 16, RIGHT, PAGE_H - 16)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...SLATE_400)
    doc.text('People Concerns  |  Commercial in confidence', MARGIN, PAGE_H - 11)
    doc.text(`Page ${page} of ${pages}`, RIGHT, PAGE_H - 11, { align: 'right' })
  }
}

/**
 * Builds the quote PDF. jsPDF is imported on demand so it stays out of the
 * initial bundle. Returns { filename, blob }.
 */
export async function buildQuotePdf({
  features,
  quote,
  clientName = '',
  reference = quoteReference(),
  date = new Date(),
}) {
  if (!features.length) {
    throw new Error('Select at least one module before exporting a quote.')
  }

  const client = clientName.trim()

  const [{ jsPDF }, { autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true })
  doc.setProperties({
    title: `People Concerns Project Estimate ${reference}`,
    subject: client
      ? `Software development estimate for ${client}`
      : 'Software development estimate',
    author: 'People Concerns',
    creator: 'PCcalc',
  })

  const validUntil = new Date(date)
  validUntil.setDate(validUntil.getDate() + 30)

  const top = tableTop(client)

  autoTable(doc, {
    startY: top,
    margin: { top, left: MARGIN, right: MARGIN, bottom: 24 },
    head: [['#', 'Module', 'Category', 'Weeks', 'Cost']],
    body: features.map((feature, index) => [
      String(index + 1).padStart(2, '0'),
      // The PDF is English-only: jsPDF's built-in fonts cannot shape Arabic.
      feature.nameEn,
      feature.category,
      String(feature.weeks),
      money(feature.cost),
    ]),
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 9,
      cellPadding: { top: 3, right: 3, bottom: 3, left: 3 },
      lineColor: SLATE_200,
      lineWidth: 0.1,
      textColor: SLATE_900,
      valign: 'middle',
    },
    headStyles: {
      fillColor: SLATE_900,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: { top: 3.4, right: 3, bottom: 3.4, left: 3 },
    },
    alternateRowStyles: { fillColor: SLATE_50 },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', textColor: SLATE_400 },
      1: { cellWidth: 62, fontStyle: 'bold' },
      2: { cellWidth: 44, fontSize: 8, textColor: SLATE_600 },
      3: { cellWidth: 18, halign: 'right', textColor: SLATE_600 },
      4: { cellWidth: CONTENT_W - 136, halign: 'right', fontStyle: 'bold' },
    },
    didDrawPage: () =>
      drawHeader(doc, { reference, date, validUntil, clientName: client }),
  })

  const afterTable = doc.lastAutoTable.finalY + 10
  drawTimeline(doc, { startY: afterTable, quote })
  const afterTotals = drawTotals(doc, { startY: afterTable, quote })
  drawNotes(doc, Math.max(afterTotals, afterTable + 26))
  drawFooters(doc)

  return {
    filename: `PCcalc-Estimate-${slugify(client)}${reference}.pdf`,
    blob: doc.output('blob'),
  }
}

/** Generates the quote and hands it to the browser as a download. */
export async function exportQuotePdf(options) {
  const { filename, blob } = await buildQuotePdf(options)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Revoke after the click has been handed off to the browser.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  return filename
}
