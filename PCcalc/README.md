# PCcalc

**People Concerns** internal quoting and estimating engine. Scope HR & Facility app builds:
pick modules, price the project with an internal margin, compare maintenance tiers, and
export a client-ready PDF quotation.

## Stack

React 19 · Vite 8 · Tailwind CSS 4 · Zustand 5 (`persist`) · react-i18next · Lucide React · jsPDF

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

## Views

**Calculator & Quote Builder** — features grouped by category as toggle cards showing cost
and weeks, with a sticky live quote panel on the right.

**Maintenance Packages** — four annual support tiers priced off the current project value.

**Admin Dashboard** — CRUD over the catalog plus bulk CSV import.

## State

A single Zustand store (`src/store/usePricingStore.js`) persisted to `localStorage` under
`pccalc`:

- `catalog` — `{ id, category, nameEn, nameAr, cost, weeks, requiredParentId }`
- `selectedIds` — modules currently in the quote
- `profitMargin` — internal markup percentage, default 30
- `clientName` — optional "Prepared for" name on the exported quote
- `language` — `en` or `ar`, persisted so the choice survives a reload
- Actions: `toggleFeature`, `setProfitMargin`, `importCSV`, `addFeature`, `updateFeature`,
  `deleteFeature`, `resetSelection`, plus `setClientName`, `setLanguage` and
  `resetCatalog`

Costs are held and quoted in **SAR** throughout.

## Pricing model

All quote maths lives in `src/lib/pricing.js` so there is one source of truth:

```
baseCost       = Σ selected costs                  (internal)
subtotal       = baseCost × (1 + profitMargin/100) (the client-facing project value)
vat            = subtotal × 15%
total          = subtotal + vat

totalWeeks     = Σ selected weeks
deliveryWeeks  = totalWeeks × 0.6                  (parallel development factor)
```

Each figure is rounded to whole riyals and the total is derived from those rounded parts,
so the numbers on screen and in the PDF always reconcile rather than drifting by a halala.

Maintenance tiers price off `subtotal` (project value **excluding** VAT) at 10% / 20% /
30% / 35%, each showing annual cost, 15% VAT, annual total and the monthly equivalent of
that VAT-inclusive total.

## Arabic & RTL

`src/i18n/index.js` holds both dictionaries (123 keys each, parity enforced by a test) and
configures react-i18next. The **EN / AR** switch sits in the top nav.

The Zustand store owns `language` and persists it; `App.jsx` follows it, calling
`i18n.changeLanguage` and setting `dir`/`lang` on `<html>`. That single attribute is what
drives Tailwind's `rtl:` variants and the browser's own bidi handling, so the whole layout
mirrors from one source of truth.

Layout uses logical properties throughout — `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
`text-start`/`text-end` — so nothing is hard-coded to a side. The two-column grid and
sticky sidebar are direction-agnostic and mirror without special cases. The one place that
needs an explicit flip is the toggle knob's transform (`rtl:-translate-x-6`), since
transforms have no logical equivalent.

Details worth knowing:

- **Fonts.** Inter carries no Arabic glyphs, so Noto Sans Arabic sits behind it in one
  stack; the browser falls through per glyph and both scripts render correctly.
- **Numerals.** Arabic uses Latin digits (`ar-SA-u-nu-latn`), which is the norm in Saudi
  B2B finance, keeps the tabular columns aligned, and matches the PDF. Money reads
  `SAR 45,000` in English and `45,000 ر.س.` in Arabic.
- **Plurals.** Arabic has six plural categories; `units.weeks` and `import.success` supply
  all of them, so "أسبوعان" is used for two rather than a generic form.
- **Bidi.** Prices and week counts are marked `unicode-bidi: plaintext` under RTL so a
  Latin-digit figure never gets re-ordered inside an Arabic sentence. The English name,
  cost and weeks inputs are pinned `dir="ltr"`; the Arabic name input is `dir="rtl"`.
- **Catalog.** All 16 seeded features ship with both names. Where `nameAr` is blank the UI
  falls back to `nameEn`, so a partly-translated catalog still reads correctly.

## Smart dependencies

A feature may declare `requiredParentId`. Selecting a child pulls in its whole prerequisite
chain — WPS Integration brings in Payroll Engine, which brings in Employee Database.
Clearing a parent clears everything that depended on it, so the quote can never contain an
orphaned child. Deleting a feature also nulls the `requiredParentId` of its direct children
rather than leaving dangling references.

`src/lib/dependencies.js` guards every walk with a `seen` set, so a malformed catalog that
loops back on itself terminates instead of hanging the tab. The admin form's "Requires"
dropdown hides any option that would create a cycle.

## CSV import

**Import from CSV** (beside Add Feature) reads the file with `FileReader` and parses it in
`src/lib/parseCsv.js` — no dependency, RFC 4180 rules: quoted fields, escaped `""` quotes,
commas and newlines inside quotes, CRLF and a UTF-8 BOM.

Expected columns are `Category, Feature Name, Name (AR), Cost, Weeks`. The Arabic column is
optional; when it is missing or blank the UI falls back to the English name. Its header may
also be written `Name AR`, `Arabic Name` or `اسم الميزة`. A header row is detected when
it names at least a name and a cost column, in which case order does not matter and aliases
(`Feature`, `Price`, `Duration`, `Group`, …) are accepted. A headerless file is read
positionally in the order above.

- Costs parse through currency noise: `SAR 45,000`, `45000`, `1,234.56`.
- Rows missing a name, or with a non-numeric or negative cost, are skipped — the rest still
  import, reported with their real file line number.
- Weeks are optional and default to 0; blank Category becomes `Uncategorised`.
- Imported features start with no prerequisite; link them afterwards in the form.
- Files over 2 MB are rejected rather than blocking the tab.

`sample-features.csv` is a working example including a quoted comma.

## PDF export

`src/lib/exportQuote.js` builds an A4 quote with jsPDF + jspdf-autotable: People Concerns
header, reference, issue and 30-day expiry dates, optional "Prepared for" block, a module
table (#, module, category, weeks, cost), a delivery-timeline card, the subtotal / VAT /
total column, notes and paginated footers.

**The PDF is English-only.** jsPDF's built-in fonts are WinAnsi-encoded and cannot shape
Arabic, so the quote always uses `nameEn` regardless of the UI language; a test asserts no
Arabic codepoint reaches the generated bytes. Producing an Arabic PDF would mean embedding
a Unicode font and adding bidi shaping — say the word if that is wanted.

**The margin slider and base cost never reach the PDF.** Only the marked-up subtotal, VAT
and total are written. There are tests asserting the base cost, the markup amount and the
words "margin"/"markup" are absent from the generated bytes at several margin settings.

Files download as `PCcalc-Estimate-<Client>-<Ref>.pdf`.

The document is deliberately light-themed — it is printed and sent to clients, unlike the
dark in-app UI. jsPDF is imported dynamically on first click, so its ~430 KB stays out of
the initial bundle. `quote-sample.pdf` is a generated sample; delete it freely.

## Notes

- Deleting a feature in the admin table takes two clicks — the first arms the button, the
  second commits. No native browser dialogs are used.
- The persisted store is at schema version 3. v2 data migrates cleanly: the old single
  `name` becomes `nameEn` and `nameAr` starts blank. v1 data used an incompatible feature
  shape and is reset on load rather than migrated.
- The `localStorage` key was renamed from `r2-tech-pricing-engine` to `pccalc` during the
  rebrand, so anything saved under the old name is ignored and the app starts from the
  seeded defaults.
