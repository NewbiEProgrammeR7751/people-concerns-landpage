import type { ReactNode } from 'react'
import type { TokenMap } from '@/content/legal/types'
import { A, B } from './LegalLayout'

/**
 * Renders the tiny markup vocabulary the legal content files use:
 *
 *   {token}           substituted from the token map
 *   **bold**          <strong>
 *   [label](target)   link
 *
 * Tokens are substituted first, so a value may itself contain markup — the
 * Privacy Policy relies on that for `{processorCategories}`. Substitution runs
 * once and is not recursive, so a token value containing `{...}` is left alone
 * rather than looping.
 */

/** Replaces `{token}` with its value. Unknown tokens are left visible on purpose. */
export function substitute(text: string, tokens: TokenMap): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) => tokens[key] ?? match)
}

// `**bold**` or `[label](target)`, whichever comes first.
const MARKUP = /\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g

export function renderInline(text: string, tokens: TokenMap): ReactNode {
  const source = substitute(text, tokens)
  const out: ReactNode[] = []
  let cursor = 0
  let key = 0

  for (const match of source.matchAll(MARKUP)) {
    const at = match.index
    if (at > cursor) out.push(source.slice(cursor, at))

    const [full, bold, label, href] = match
    if (bold !== undefined) {
      out.push(<B key={key++}>{bold}</B>)
    } else if (label !== undefined && href !== undefined) {
      out.push(
        <A key={key++} href={href}>
          {label}
        </A>,
      )
    }
    cursor = at + full.length
  }

  if (cursor < source.length) out.push(source.slice(cursor))

  // A single plain string is the common case; returning it unwrapped keeps the
  // DOM free of pointless Fragments.
  return out.length === 1 && typeof out[0] === 'string' ? out[0] : out
}

/** Plain-text form, for attributes such as meta description and <title>. */
export function renderPlain(text: string, tokens: TokenMap): string {
  return substitute(text, tokens)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}
