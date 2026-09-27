import type { ReactNode } from 'react'
import {
  getLegalDocument,
  getTokens,
  isPending,
  legalRoute,
  ui,
  type LegalDocId,
  type LegalLang,
} from '@/content/legal'
import type { Block, TokenMap } from '@/content/legal/types'
import LegalLayout, {
  A,
  ContactTable,
  GridTable,
  Note,
  P,
  PendingNotice,
  Section,
  ShortVersion,
  UL,
  type TocEntry,
} from './LegalLayout'
import { renderInline, renderPlain } from './renderInline'

/**
 * Renders either legal document in either language from the content files in
 * `src/content/legal`. Replaces the hand-written TermsAndConditions /
 * PrivacyPolicy components: the structure is identical across languages, so
 * duplicating it per language would guarantee the two drift apart.
 */

function renderBlock(block: Block, key: number, tokens: TokenMap): ReactNode {
  switch (block.kind) {
    case 'p':
      return <P key={key}>{renderInline(block.text, tokens)}</P>
    case 'ul':
      return (
        <UL key={key}>
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item, tokens)}</li>
          ))}
        </UL>
      )
    case 'note':
      return <Note key={key}>{renderInline(block.text, tokens)}</Note>
    case 'table':
      return (
        <GridTable
          key={key}
          head={block.head.map((cell) => renderPlain(cell, tokens))}
          rows={block.rows.map((row) => row.map((cell) => renderInline(cell, tokens)))}
        />
      )
    case 'contact':
      return (
        <ContactTable
          key={key}
          rows={block.rows.map(([label, value]) => [
            renderPlain(label, tokens),
            renderInline(value, tokens),
          ])}
        />
      )
  }
}

function renderBlocks(blocks: readonly Block[], tokens: TokenMap): ReactNode[] {
  return blocks.map((block, i) => renderBlock(block, i, tokens))
}

type Props = { id: LegalDocId; lang: LegalLang }

export default function LegalDocumentPage({ id, lang }: Props) {
  const doc = getLegalDocument(id, lang)
  const tokens = getTokens(lang)
  const strings = ui[lang]
  const pending = isPending(doc)

  const toc: TocEntry[] = doc.sections.map((s) => ({
    id: `s${s.n}`,
    n: s.n,
    title: s.title,
  }))

  const otherLang: LegalLang = lang === 'en' ? 'ar' : 'en'

  return (
    <LegalLayout
      lang={lang}
      route={legalRoute(id, lang)}
      docId={id}
      title={doc.title}
      documentTitle={`${doc.title} | ${tokens.name}`}
      metaDescription={renderPlain(doc.metaDescription, tokens)}
      toc={toc}
      contentsLabel={doc.contentsLabel}
      // An incomplete legal document must not be indexed, and must not be the
      // version a search engine offers ahead of the finished one.
      noindex={pending}
    >
      {pending && (
        <PendingNotice>
          {strings.pendingBanner}{' '}
          <A href={legalRoute(id, otherLang)}>{strings.pendingBannerLinkLabel}</A>
        </PendingNotice>
      )}

      <ShortVersion heading={doc.summary.heading}>
        {doc.summary.blocks ? (
          renderBlocks(doc.summary.blocks, tokens)
        ) : (
          <P>{strings.pendingSection}</P>
        )}
      </ShortVersion>

      {doc.sections.map((section) => (
        <Section key={section.n} n={section.n} title={section.title}>
          {section.blocks ? renderBlocks(section.blocks, tokens) : <P>{strings.pendingSection}</P>}
        </Section>
      ))}
    </LegalLayout>
  )
}
