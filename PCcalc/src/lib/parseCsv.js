/**
 * Minimal RFC 4180 CSV reader: handles quoted fields, escaped quotes ("") and
 * commas or newlines inside quotes. Returns an array of string arrays.
 */
export function parseCsv(input) {
  // Strip a UTF-8 BOM, which Excel writes and which would corrupt the first header.
  const text = input.charCodeAt(0) === 0xfeff ? input.slice(1) : input

  const rows = []
  let row = []
  let field = ''
  let quoted = false
  let dirty = false

  const endField = () => {
    row.push(field)
    field = ''
    dirty = true
  }
  const endRow = () => {
    endField()
    rows.push(row)
    row = []
    dirty = false
  }

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]

    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i += 1
        } else {
          quoted = false
        }
      } else {
        field += char
      }
      continue
    }

    if (char === '"') quoted = true
    else if (char === ',') endField()
    else if (char === '\n') endRow()
    else if (char !== '\r') field += char
  }

  if (dirty || field !== '') endRow()
  return rows
}

/** Header spellings tolerated, mapped onto our field names. */
const HEADER_ALIASES = {
  category: 'category',
  group: 'category',
  name: 'nameEn',
  feature: 'nameEn',
  'feature name': 'nameEn',
  'name (en)': 'nameEn',
  'feature name (en)': 'nameEn',
  title: 'nameEn',
  'name (ar)': 'nameAr',
  'name ar': 'nameAr',
  'feature name (ar)': 'nameAr',
  'arabic name': 'nameAr',
  arabic: 'nameAr',
  'الاسم': 'nameAr',
  'اسم الميزة': 'nameAr',
  cost: 'cost',
  price: 'cost',
  amount: 'cost',
  weeks: 'weeks',
  duration: 'weeks',
  'weeks estimate': 'weeks',
  effort: 'weeks',
}

const POSITIONAL = ['category', 'nameEn', 'nameAr', 'cost', 'weeks']

/** Accepts "SAR 45,000", "45 000.50", "45,000" and friends. */
export function parseNumber(raw) {
  const cleaned = String(raw).replace(/[^0-9.-]/g, '')
  if (!cleaned || cleaned === '-' || cleaned === '.') return Number.NaN
  return Number(cleaned)
}

const isBlankRow = (row) => row.every((cell) => cell.trim() === '')

/**
 * Turns CSV text into feature drafts, with costs in SAR.
 *
 * Returns { features, errors, totalRows }. Errors carry 1-based file line
 * numbers so the user can find the offending row, plus an i18n `key` (and
 * optional `value`) rather than a baked-in English message.
 */
export function parseFeatureCsv(text) {
  // Blank rows are skipped in place, never filtered out, so the line numbers
  // reported back to the user still match the file they uploaded.
  const rows = parseCsv(text)
  const headerIndex = rows.findIndex((row) => !isBlankRow(row))
  if (headerIndex === -1) {
    return {
      features: [],
      errors: [{ row: 0, key: 'emptyFile' }],
      totalRows: 0,
    }
  }

  // Treat the first row as a header only if it names the two required columns.
  const mapped = rows[headerIndex].map(
    (cell) => HEADER_ALIASES[cell.trim().toLowerCase()],
  )
  const hasHeader = mapped.includes('nameEn') && mapped.includes('cost')

  const columns = hasHeader ? mapped : POSITIONAL
  const start = hasHeader ? headerIndex + 1 : headerIndex

  const features = []
  const errors = []
  let totalRows = 0

  for (let index = start; index < rows.length; index += 1) {
    const row = rows[index]
    if (isBlankRow(row)) continue
    totalRows += 1

    const lineNumber = index + 1
    const pick = (field) => {
      const at = columns.indexOf(field)
      return at === -1 ? '' : (row[at] ?? '').trim()
    }

    const nameEn = pick('nameEn')
    if (!nameEn) {
      errors.push({ row: lineNumber, key: 'missingName' })
      continue
    }

    const rawCost = pick('cost')
    const cost = parseNumber(rawCost)
    if (!Number.isFinite(cost) || cost < 0) {
      errors.push({ row: lineNumber, key: 'invalidCost', value: rawCost })
      continue
    }

    // Weeks are optional; a blank or unreadable value imports as zero.
    const rawWeeks = pick('weeks')
    const parsedWeeks = parseNumber(rawWeeks)
    const weeks = Number.isFinite(parsedWeeks) && parsedWeeks >= 0 ? parsedWeeks : 0

    features.push({
      category: pick('category') || 'Uncategorised',
      nameEn,
      // Blank Arabic is fine: display falls back to the English name.
      nameAr: pick('nameAr'),
      cost,
      weeks,
      requiredParentId: null,
    })
  }

  return { features, errors, totalRows }
}
