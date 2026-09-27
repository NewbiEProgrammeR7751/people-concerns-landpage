/**
 * Content model for the Terms and Privacy documents.
 *
 * The documents are data rather than JSX so the same structure can carry more
 * than one language. Body text is plain strings with a deliberately tiny markup
 * vocabulary, because these files are handed to a legal translator who should
 * not have to read React:
 *
 *   **bold**              emphasis (renders as the navy/bright ink `strong`)
 *   [label](/target)      link — internal path, mailto:, tel: or https://
 *   {token}               value from `src/content/company.ts`, e.g. {crNumber}
 *
 * Nothing else is interpreted. A stray `*` or `[` renders literally.
 */

/** A single value the renderer substitutes for `{token}`. */
export type TokenMap = Readonly<Record<string, string>>

export type Block =
  /** A paragraph. */
  | { readonly kind: 'p'; readonly text: string }
  /** A bulleted list; each item takes the same inline markup as a paragraph. */
  | { readonly kind: 'ul'; readonly items: readonly string[] }
  /** The boxed callout used for Terms s5 ("Not for emergencies"). */
  | { readonly kind: 'note'; readonly text: string }
  /** A data table with a header row. */
  | {
      readonly kind: 'table'
      readonly head: readonly string[]
      readonly rows: readonly (readonly string[])[]
    }
  /** The label/value contact table that closes both documents. */
  | { readonly kind: 'contact'; readonly rows: readonly (readonly [string, string])[] }

export type Section = {
  /** Section number, used for the heading, the `#s{n}` anchor and the TOC. */
  readonly n: number
  readonly title: string
  /**
   * The section body. `null` marks a section whose translation has not been
   * supplied yet — the page renders a placeholder and marks itself noindex
   * rather than publishing an empty legal section.
   */
  readonly blocks: readonly Block[] | null
}

export type LegalDocument = {
  /** Stable id, shared across languages. */
  readonly id: 'terms' | 'privacy'
  /** Page heading, e.g. "Terms and Conditions". */
  readonly title: string
  /** `<title>` suffix and meta description. */
  readonly metaDescription: string
  /** The "short version" summary box above the sections. */
  readonly summary: {
    readonly heading: string
    readonly blocks: readonly Block[] | null
  }
  readonly sections: readonly Section[]
  /** Label for the table of contents disclosure. */
  readonly contentsLabel: string
}

/** True when any part of the document still needs translating. */
export function isPending(doc: LegalDocument): boolean {
  return doc.summary.blocks === null || doc.sections.some((s) => s.blocks === null)
}
