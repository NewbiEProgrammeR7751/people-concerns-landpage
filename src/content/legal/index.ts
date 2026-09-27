import { company } from '@/content/company'
import type { LegalDocument, TokenMap } from './types'
import { isPending } from './types'
import enTerms from './en/terms'
import enPrivacy from './en/privacy'
import arTerms from './ar/terms'
import arPrivacy from './ar/privacy'

export type LegalLang = 'en' | 'ar'
export type LegalDocId = 'terms' | 'privacy'

export const LEGAL_LANGS: readonly LegalLang[] = ['en', 'ar']

/** Path segment for each document, shared by both languages. */
const SLUGS: Record<LegalDocId, string> = {
  terms: 'terms-and-conditions',
  privacy: 'privacy-policy',
}

const DOCS: Record<LegalLang, Record<LegalDocId, LegalDocument>> = {
  en: { terms: enTerms, privacy: enPrivacy },
  ar: { terms: arTerms, privacy: arPrivacy },
}

/**
 * Route for a document in a language. English keeps the original paths so the
 * links already in the wild keep working; Arabic is served under `/ar/`.
 */
export function legalRoute(id: LegalDocId, lang: LegalLang): string {
  return lang === 'ar' ? `/ar/${SLUGS[id]}` : `/${SLUGS[id]}`
}

export function getLegalDocument(id: LegalDocId, lang: LegalLang): LegalDocument {
  return DOCS[lang][id]
}

/** Matches a pathname to a document, or null if it is not a legal route. */
export function matchLegalRoute(route: string): { id: LegalDocId; lang: LegalLang } | null {
  for (const lang of LEGAL_LANGS) {
    for (const id of Object.keys(SLUGS) as LegalDocId[]) {
      if (legalRoute(id, lang) === route) return { id, lang }
    }
  }
  return null
}

/**
 * Values substituted for `{token}` in document text. Flattened from `company`
 * so the content files never reach into nested objects, and so a translator can
 * see the full list of tokens in one place.
 */
const baseTokens: TokenMap = {
  name: company.name,
  legalName: company.legalName,
  crNumber: company.crNumber,
  city: company.city,
  country: company.country,
  shortAddress: company.shortAddress,
  nationalAddress: company.nationalAddress,
  courtCity: company.courtCity,
  phone: company.phone,
  phoneHref: company.phoneHref,
  supportEmail: company.supportEmail,
  privacyEmail: company.privacyEmail,
  noReplyEmail: company.noReplyEmail,
  website: company.website,
  websiteUrl: company.websiteUrl,
  officeHours: company.officeHours,
  dpoName: company.dpoName,
  liabilityCap: company.liabilityCap,
  retentionClosedAccount: company.retention.closedAccount,
  retentionClosedConcern: company.retention.closedConcern,
  retentionTechnicalLogs: company.retention.technicalLogs,
  hostingStatement: company.hostingStatement,
  processorCategories: company.processorCategories ?? '',
  cookieSettingsPath: company.cookieSettingsPath,
}

/**
 * Arabic forms of the tokens that are plain place names rather than legal
 * statements. Kept short on purpose.
 *
 * TODO(translation): these tokens are still English in the Arabic documents and
 * must be supplied by whoever writes the Arabic text, because each is a legal
 * statement rather than a label:
 *
 *   {nationalAddress}          the registered address as it appears in Arabic on
 *                              the National Address certificate
 *   {officeHours}              published working hours
 *   {liabilityCap}             the liability cap, incl. how SAR is written
 *   {retentionClosedAccount}   ┐
 *   {retentionClosedConcern}    ├ retention periods
 *   {retentionTechnicalLogs}   ┘
 *   {hostingStatement}         the hosting-location sentence
 *   {processorCategories}      the processor-categories sentence
 *
 * They render in English until then, which is visible in review — the sections
 * that use them are also marked untranslated, so nothing ships half-done.
 */
const arTokenOverrides: TokenMap = {
  city: 'الرياض',
  country: 'المملكة العربية السعودية',
  shortAddress: 'الرياض، المملكة العربية السعودية',
}

/** Token values for a language. */
export function getTokens(lang: LegalLang): TokenMap {
  return lang === 'ar' ? { ...baseTokens, ...arTokenOverrides } : baseTokens
}

/** Chrome and shell strings, which are not part of the legal text. */
export const ui: Record<LegalLang, {
  dir: 'ltr' | 'rtl'
  htmlLang: string
  skipToContent: string
  home: string
  footerNav: string
  legalDocuments: string
  lastUpdated: (date: string, version: string) => string
  copyright: (year: number, name: string) => string
  /** Label on the control that switches to the other language. */
  switchTo: string
  /** Shown at the top of a document that is not fully translated. */
  pendingBanner: string
  pendingBannerLinkLabel: string
  /** Stands in for a section body that has not been translated. */
  pendingSection: string
  terms: string
  privacy: string
}> = {
  en: {
    dir: 'ltr',
    htmlLang: 'en',
    skipToContent: 'Skip to content',
    home: 'Home',
    footerNav: 'Footer',
    legalDocuments: 'Legal documents',
    lastUpdated: (date, version) => `Last updated ${date}, version ${version}`,
    copyright: (year, name) => `© ${year} ${name}. All rights reserved.`,
    switchTo: 'العربية',
    pendingBanner: 'The Arabic version of this document is being prepared and is not yet complete.',
    pendingBannerLinkLabel: 'Read the English version',
    pendingSection: 'This section has not been translated yet.',
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
  },
  ar: {
    dir: 'rtl',
    htmlLang: 'ar',
    skipToContent: 'الانتقال إلى المحتوى',
    home: 'الرئيسية',
    footerNav: 'تذييل الصفحة',
    legalDocuments: 'المستندات النظامية',
    lastUpdated: (date, version) => `آخر تحديث ${date}، الإصدار ${version}`,
    copyright: (year, name) => `© ${year} ${name}. جميع الحقوق محفوظة.`,
    switchTo: 'English',
    pendingBanner: 'النسخة العربية من هذا المستند قيد الإعداد ولم تكتمل بعد.',
    pendingBannerLinkLabel: 'اقرأ النسخة الإنجليزية',
    pendingSection: 'لم تُترجم هذه الفقرة بعد.',
    terms: 'الشروط والأحكام',
    privacy: 'سياسة الخصوصية',
  },
}

export { isPending }
export type { LegalDocument, Block, Section } from './types'
