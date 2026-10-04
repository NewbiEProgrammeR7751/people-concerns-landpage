import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import logoIcon from '@/imports/PeopleConcerns_Icon_Transparent_500.png'
import { company, legalRevision } from '@/content/company'
import { getTokens, legalRoute, ui, type LegalDocId, type LegalLang } from '@/content/legal'
import { Link } from '@/router'

/**
 * Shared shell for the Terms and Privacy pages, in both languages.
 *
 * The source HTML documents shipped a light-on-white stylesheet. That palette is
 * re-expressed here with the site's dark design tokens from index.css, so a
 * visitor arriving from the landing page footer doesn't flash from dark to white.
 * Brand rules from the asset pack still hold: coral left / teal right on the top
 * stripe, and the logo only ever sits on a dark surface.
 *
 * Direction is driven by `lang`. The spacing utilities are all logical
 * (`ps-`, `ms-`, `border-s-`, `text-start`), so RTL needs no separate rules —
 * only the brand stripe is pinned, because coral-left/teal-right is a brand
 * constant rather than a reading-order property.
 */

export type TocEntry = { id: string; n: number; title: string }

// ── Content primitives ─────────────────────────────────────────────────────
// Each mirrors one selector from the source stylesheet.

/** `p{margin:0 0 14px}` */
export function P({ children }: { children: ReactNode }) {
  return <p className="mb-3.5 last:mb-0">{children}</p>
}

/** `ul{...}` with `li::marker{color:var(--coral)}` */
export function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-3.5 list-disc space-y-1.5 ps-5 marker:text-[var(--coral)]">{children}</ul>
}

/** `strong{color:var(--navy);font-weight:600}` — navy reads as the bright ink here. */
export function B({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
}

/** `.note{background:var(--wash);border:1px solid var(--line);border-radius:10px}` */
export function Note({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3.5 rounded-[10px] border border-[var(--border-subtle)] bg-white/[0.03] px-5 py-4">
      {children}
    </div>
  )
}

/**
 * Banner for a document that is not fully translated. Coral rather than teal:
 * this is a warning about the text's completeness, not a highlight.
 */
export function PendingNotice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mb-8 rounded-[10px] border border-[color-mix(in_srgb,var(--coral)_35%,transparent)] bg-[var(--coral-dim)] px-5 py-4 text-[15px]"
    >
      {children}
    </div>
  )
}

/** Inline link keeping the source's teal underline treatment. */
export function A({ href, children }: { href: string; children: ReactNode }) {
  const className =
    'text-[var(--text-primary)] underline decoration-[var(--teal)] decoration-2 underline-offset-[3px] transition-colors hover:text-[var(--teal)]'

  if (/^(https?:|mailto:|tel:)/.test(href)) {
    const external = href.startsWith('http')
    return (
      <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

/** `table.grid` — header row plus zebra striping. */
export function GridTable({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="mb-4 max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-[14.5px] leading-[1.55]">
        <thead>
          <tr>
            {head.map((cell) => (
              <th
                key={cell}
                scope="col"
                className="border-b border-[var(--border-subtle)] bg-white/[0.06] px-3 py-2.5 text-start align-top font-semibold text-[var(--text-primary)]"
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-white/[0.02]' : undefined}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className="border-b border-[var(--border-subtle)] px-3 py-2.5 text-start align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** `table.contact` — label column at 34%. */
export function ContactTable({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <div className="mb-4 max-w-full overflow-x-auto">
      <table className="w-full border-collapse text-[14.5px] leading-[1.55]">
        <tbody>
          {rows.map(([label, value]) => (
            <tr key={label}>
              <th
                scope="row"
                className="w-[34%] border-b border-[var(--border-subtle)] px-3 py-2.5 text-start align-top font-medium text-[var(--text-secondary)]"
              >
                {label}
              </th>
              <td className="border-b border-[var(--border-subtle)] px-3 py-2.5 text-start align-top">
                {value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** `.summary{background:#EEF6F6;border-radius:10px}` */
export function ShortVersion({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div className="mb-10 rounded-[10px] border border-[color-mix(in_srgb,var(--teal)_25%,transparent)] bg-[var(--teal-dim)] px-5 py-6 sm:px-7">
      <h2 className="legal-heading mb-2 text-lg font-semibold text-[var(--text-primary)]">
        {heading}
      </h2>
      {children}
    </div>
  )
}

/**
 * `section h2` with its number, plus the 42px indent the source applied to
 * everything in a section except the heading. The indent collapses on mobile.
 */
export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section id={`s${n}`} aria-labelledby={`h${n}`} className="mb-7 scroll-mt-8 pt-2">
      <h2
        id={`h${n}`}
        className="legal-heading mb-3 flex items-baseline gap-3.5 text-[22px] leading-[1.35] font-semibold text-[var(--text-primary)]"
      >
        <span className="min-w-[28px] font-bold text-[var(--teal)]">{n}.</span>
        <span>{title}</span>
      </h2>
      <div className="md:ms-[42px]">{children}</div>
    </section>
  )
}

// ── Chrome ─────────────────────────────────────────────────────────────────

/**
 * `.stripe` — coral then teal. Pinned with physical `flex-row` because the
 * brand guidelines fix coral on the left and teal on the right; unlike the rest
 * of the layout it must not mirror in RTL.
 */
function BrandStripe() {
  return (
    <div className="flex h-1.5 flex-row" aria-hidden="true" dir="ltr">
      <span className="flex-1 bg-[var(--coral)]" />
      <span className="flex-1 bg-[var(--teal)]" />
    </div>
  )
}

/** The wordmark is a Latin lockup and stays LTR in both languages. */
function Wordmark({ size }: { size: number }) {
  return (
    <span className="flex flex-row items-center gap-2.5" dir="ltr">
      <img src={logoIcon} width={size} height={size} alt="" className="block" />
      <span style={{ fontFamily: "'Nunito', sans-serif", lineHeight: 1.05 }}>
        <span className="block font-extrabold text-[var(--text-primary)]">People</span>
        <span className="block font-extrabold text-[var(--teal)]">concerns</span>
      </span>
    </span>
  )
}

function LegalNav({
  lang,
  current,
  className,
}: {
  lang: LegalLang
  current: string
  className?: string
}) {
  const strings = ui[lang]
  const links: { to: string; label: string }[] = [
    { to: legalRoute('terms', lang), label: strings.terms },
    { to: legalRoute('privacy', lang), label: strings.privacy },
  ]

  return (
    <nav aria-label={strings.legalDocuments} className={className}>
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          aria-current={l.to === current ? 'page' : undefined}
          className={`text-[13px] font-medium underline decoration-2 underline-offset-[3px] transition-colors sm:text-sm ${
            l.to === current
              ? 'text-[var(--text-primary)] decoration-[var(--coral)]'
              : 'text-[var(--text-secondary)] decoration-[var(--teal)] hover:text-[var(--teal)]'
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  )
}

/** Switches to the same document in the other language. */
function LanguageSwitch({ lang, docId }: { lang: LegalLang; docId: LegalDocId }) {
  const other: LegalLang = lang === 'en' ? 'ar' : 'en'
  return (
    <Link
      to={legalRoute(docId, other)}
      lang={ui[other].htmlLang}
      hrefLang={ui[other].htmlLang}
      className="rounded-lg border border-[var(--border-subtle)] bg-white/[0.04] px-3 py-1.5 text-[13px] font-medium text-[var(--text-secondary)] no-underline transition-colors hover:border-[var(--teal)] hover:text-[var(--teal)]"
    >
      {ui[lang].switchTo}
    </Link>
  )
}

function TableOfContents({ items, label }: { items: TocEntry[]; label: string }) {
  // The source script collapsed the list below 960px; matchMedia keeps that
  // behaviour without reaching into the DOM after render.
  const [open, setOpen] = useState(() => !window.matchMedia('(max-width: 1023px)').matches)

  return (
    <details
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="self-start rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-4 text-sm leading-[1.5] lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-auto lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0"
    >
      <summary className="cursor-pointer list-none font-semibold text-[var(--text-primary)] [&::-webkit-details-marker]:hidden">
        {label}
      </summary>
      <nav aria-label={label} className="mt-3">
        <ol className="list-none p-0 border-s-2 border-[var(--border-subtle)]">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="-ms-0.5 flex gap-2.5 border-s-2 border-transparent py-[5px] ps-3.5 text-[var(--text-secondary)] no-underline transition-colors hover:border-s-[var(--teal)] hover:text-[var(--text-primary)]"
              >
                <span className="min-w-[18px] font-semibold text-[var(--teal)]">{item.n}</span>
                {item.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  )
}

function SiteHeader({
  lang,
  title,
  current,
  docId,
}: {
  lang: LegalLang
  title: string
  current: string
  docId: LegalDocId
}) {
  const strings = ui[lang]
  return (
    <header className="bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <div className="flex flex-col items-start gap-3.5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link to="/" aria-label={strings.home} className="no-underline">
            <Wordmark size={34} />
          </Link>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <LegalNav lang={lang} current={current} className="flex gap-4 sm:gap-5" />
            <LanguageSwitch lang={lang} docId={docId} />
          </div>
        </div>
        <div className="pb-8 pt-4 md:pb-12 md:pt-6">
          <h1 className="legal-heading mb-2 text-[32px] leading-[1.15] font-bold tracking-[-0.01em] text-[var(--text-primary)] md:text-[44px]">
            {title}
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)]">
            {strings.lastUpdated(legalRevision.lastUpdated[lang], legalRevision.version)}
          </p>
        </div>
      </div>
    </header>
  )
}

function SiteFooter({ lang, current }: { lang: LegalLang; current: string }) {
  const strings = ui[lang]
  const { shortAddress } = getTokens(lang)
  return (
    <footer className="bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-6 px-5 py-9 md:px-8">
        <div>
          <Link to="/" className="mb-3 inline-block no-underline">
            <Wordmark size={28} />
          </Link>
          <div>{shortAddress}</div>
          <div>
            <a
              href={`mailto:${company.supportEmail}`}
              dir="ltr"
              className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]"
            >
              {company.supportEmail}
            </a>
          </div>
        </div>
        <div className="self-end">
          <nav aria-label={strings.footerNav} className="mb-2 flex flex-wrap gap-5">
            <Link to="/" className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]">
              {strings.home}
            </Link>
            {(['terms', 'privacy'] as LegalDocId[]).map((id) => {
              const to = legalRoute(id, lang)
              return (
                <Link
                  key={id}
                  to={to}
                  aria-current={to === current ? 'page' : undefined}
                  className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]"
                >
                  {strings[id]}
                </Link>
              )
            })}
          </nav>
          <div className="text-xs text-[var(--text-muted)]">
            {strings.copyright(2026, company.name)}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Layout ─────────────────────────────────────────────────────────────────

type LegalLayoutProps = {
  lang: LegalLang
  /** Route of the page being rendered, used for aria-current. */
  route: string
  docId: LegalDocId
  title: string
  /** <title> and meta description for the document head. */
  documentTitle: string
  metaDescription: string
  toc: TocEntry[]
  contentsLabel: string
  /** Keeps an untranslated document out of search results. */
  noindex?: boolean
  children: ReactNode
}

/** Creates or updates a <meta>/<link> in the head, returning a cleanup function. */
function upsertHeadTag(
  selector: string,
  create: () => HTMLElement,
  apply: (el: HTMLElement) => void,
): () => void {
  const existing = document.head.querySelector<HTMLElement>(selector)
  if (existing) {
    const previous = existing.cloneNode(true) as HTMLElement
    apply(existing)
    return () => existing.replaceWith(previous)
  }
  const created = create()
  apply(created)
  document.head.appendChild(created)
  return () => created.remove()
}

export default function LegalLayout({
  lang,
  route,
  docId,
  title,
  documentTitle,
  metaDescription,
  toc,
  contentsLabel,
  noindex = false,
  children,
}: LegalLayoutProps) {
  const strings = ui[lang]

  // These pages are reached client-side, so the head is maintained on mount and
  // restored on unmount — the landing page owns dir/lang the rest of the time.
  useEffect(() => {
    const previousTitle = document.title
    const previousDir = document.documentElement.dir
    const previousLang = document.documentElement.lang

    document.title = documentTitle
    document.documentElement.dir = strings.dir
    document.documentElement.lang = strings.htmlLang

    const cleanups = [
      upsertHeadTag(
        'meta[name="description"]',
        () => Object.assign(document.createElement('meta'), { name: 'description' }),
        (el) => el.setAttribute('content', metaDescription),
      ),
      // hreflang alternates, so each language is offered to the right reader.
      ...(['en', 'ar'] as LegalLang[]).map((l) =>
        upsertHeadTag(
          `link[rel="alternate"][hreflang="${ui[l].htmlLang}"]`,
          () => Object.assign(document.createElement('link'), { rel: 'alternate' }),
          (el) => {
            el.setAttribute('hreflang', ui[l].htmlLang)
            el.setAttribute('href', new URL(legalRoute(docId, l), window.location.origin).href)
          },
        ),
      ),
    ]

    if (noindex) {
      cleanups.push(
        upsertHeadTag(
          'meta[name="robots"]',
          () => Object.assign(document.createElement('meta'), { name: 'robots' }),
          (el) => el.setAttribute('content', 'noindex, follow'),
        ),
      )
    }

    return () => {
      document.title = previousTitle
      document.documentElement.dir = previousDir
      document.documentElement.lang = previousLang
      for (const undo of cleanups) undo()
    }
  }, [documentTitle, metaDescription, strings.dir, strings.htmlLang, docId, noindex])

  return (
    <div
      className="legal-doc min-h-full bg-[var(--bg-deep)] text-[16px] leading-[1.7] text-[var(--text-secondary)]"
      lang={strings.htmlLang}
      dir={strings.dir}
      data-legal-lang={lang}
    >
      <a
        href="#content"
        className="absolute start-3 top-3 z-10 -translate-y-20 rounded bg-[var(--bg-card)] px-3.5 py-2 text-[var(--text-primary)] transition-transform focus:translate-y-0"
      >
        {strings.skipToContent}
      </a>
      <BrandStripe />
      <SiteHeader lang={lang} title={title} current={route} docId={docId} />

      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-6 px-4 pb-12 pt-6 sm:px-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-[72px] lg:pt-12">
        <TableOfContents items={toc} label={contentsLabel} />
        <main
          id="content"
          className="min-w-0 max-w-[780px] rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-8 sm:px-8 lg:px-14 lg:py-12"
        >
          {children}
        </main>
      </div>

      <SiteFooter lang={lang} current={route} />
    </div>
  )
}
