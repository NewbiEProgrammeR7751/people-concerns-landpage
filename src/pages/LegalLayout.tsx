import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import logoIcon from '@/imports/PeopleConcerns_Icon_Transparent_500.png'
import { company, legalRevision } from '@/content/company'
import { Link } from '@/router'

/**
 * Shared shell for the Terms and Privacy pages.
 *
 * The source HTML documents shipped a light-on-white stylesheet. That palette is
 * re-expressed here with the site's dark design tokens from index.css, so a
 * visitor arriving from the landing page footer doesn't flash from dark to white.
 * Brand rules from the asset pack still hold: coral left / teal right on the top
 * stripe, and the logo only ever sits on a dark surface.
 */

export type TocEntry = { id: string; n: number; title: string }

const LEGAL_LINKS = [
  { to: '/terms-and-conditions', label: 'Terms and Conditions' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
] as const

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
export function ShortVersion({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 rounded-[10px] border border-[rgba(42,184,168,0.18)] bg-[var(--teal-dim)] px-5 py-6 sm:px-7">
      <h2
        className="mb-2 text-lg font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        The short version
      </h2>
      {children}
    </div>
  )
}

/**
 * `section h2` with its teal number, plus the 42px indent the source applied to
 * everything in a section except the heading. The indent collapses on mobile.
 */
export function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section id={`s${n}`} aria-labelledby={`h${n}`} className="mb-7 scroll-mt-8 pt-2">
      <h2
        id={`h${n}`}
        className="mb-3 flex items-baseline gap-3.5 text-[22px] leading-[1.35] font-semibold text-[var(--text-primary)]"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <span className="min-w-[28px] font-bold text-[var(--teal)]">{n}.</span>
        <span>{title}</span>
      </h2>
      <div className="md:ms-[42px]">{children}</div>
    </section>
  )
}

// ── Chrome ─────────────────────────────────────────────────────────────────

/** `.stripe` — coral left, teal right. Never swapped (brand rule). */
function BrandStripe() {
  return (
    <div className="flex h-1.5" aria-hidden="true">
      <span className="flex-1 bg-[var(--coral)]" />
      <span className="flex-1 bg-[var(--teal)]" />
    </div>
  )
}

function Wordmark({ size }: { size: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <img src={logoIcon} width={size} height={size} alt="" className="block" />
      <span style={{ fontFamily: "'Nunito', sans-serif", lineHeight: 1.05 }}>
        <span className="block font-extrabold text-[var(--text-primary)]">People</span>
        <span className="block font-extrabold text-[var(--teal)]">concerns</span>
      </span>
    </span>
  )
}

function TableOfContents({ items }: { items: TocEntry[] }) {
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
        Contents
      </summary>
      <nav aria-label="Contents" className="mt-3">
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

function SiteHeader({ title, current }: { title: string; current: string }) {
  return (
    <header className="bg-[var(--bg-surface)]">
      <div className="mx-auto max-w-[1120px] px-5 md:px-8">
        <div className="flex flex-col items-start gap-3.5 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Link to="/" aria-label="People concerns home" className="no-underline">
            <Wordmark size={34} />
          </Link>
          <nav aria-label="Legal documents" className="flex gap-4 sm:gap-5">
            {LEGAL_LINKS.map((l) => (
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
        </div>
        <div className="pb-8 pt-4 md:pb-12 md:pt-6">
          <h1
            className="mb-2 text-[32px] leading-[1.15] font-bold tracking-[-0.01em] text-[var(--text-primary)] md:text-[44px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            {title}
          </h1>
          <p className="text-[15px] text-[var(--text-secondary)]">
            Last updated {legalRevision.lastUpdated}, version {legalRevision.version}
          </p>
        </div>
      </div>
    </header>
  )
}

function SiteFooter({ current }: { current: string }) {
  return (
    <footer className="bg-[var(--bg-surface)] text-sm text-[var(--text-secondary)]">
      <div className="mx-auto flex max-w-[1120px] flex-wrap justify-between gap-6 px-5 py-9 md:px-8">
        <div>
          <Link to="/" className="mb-3 inline-block no-underline">
            <Wordmark size={28} />
          </Link>
          <div>{company.shortAddress}</div>
          <div>
            <a
              href={`mailto:${company.supportEmail}`}
              className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]"
            >
              {company.supportEmail}
            </a>
          </div>
        </div>
        <div className="self-end">
          <nav aria-label="Footer" className="mb-2 flex flex-wrap gap-5">
            <Link to="/" className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]">
              Home
            </Link>
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                aria-current={l.to === current ? 'page' : undefined}
                className="text-[var(--text-primary)] no-underline hover:text-[var(--teal)]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="text-xs text-[var(--text-muted)]">
            © 2026 {company.name}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Layout ─────────────────────────────────────────────────────────────────

type LegalLayoutProps = {
  /** Route of the page being rendered, used for aria-current. */
  route: string
  title: string
  /** <title> and meta description for the document head. */
  documentTitle: string
  metaDescription: string
  toc: TocEntry[]
  children: ReactNode
}

export default function LegalLayout({
  route,
  title,
  documentTitle,
  metaDescription,
  toc,
  children,
}: LegalLayoutProps) {
  // These pages are reached client-side, so the head is set on mount. The
  // landing page owns dir/lang; the legal copy is English-only for now — both
  // documents state that an Arabic version prevails if one is published.
  useEffect(() => {
    const previousTitle = document.title
    document.title = documentTitle
    document.documentElement.dir = 'ltr'
    document.documentElement.lang = 'en'

    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const previousDescription = meta.content
    meta.content = metaDescription

    return () => {
      document.title = previousTitle
      meta.content = previousDescription
    }
  }, [documentTitle, metaDescription])

  return (
    <div className="legal-doc min-h-full bg-[var(--bg-deep)] text-[16px] leading-[1.7] text-[var(--text-secondary)]">
      <a
        href="#content"
        className="absolute start-3 top-3 z-10 -translate-y-20 rounded bg-[var(--bg-card)] px-3.5 py-2 text-[var(--text-primary)] transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <BrandStripe />
      <SiteHeader title={title} current={route} />

      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-6 px-4 pb-12 pt-6 sm:px-5 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14 lg:px-8 lg:pb-[72px] lg:pt-12">
        <TableOfContents items={toc} />
        <main
          id="content"
          className="min-w-0 max-w-[780px] rounded-[14px] border border-[var(--border-subtle)] bg-[var(--bg-card)] px-5 py-8 sm:px-8 lg:px-14 lg:py-12"
        >
          {children}
        </main>
      </div>

      <SiteFooter current={route} />
    </div>
  )
}
